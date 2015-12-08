/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.context = null;
  this.extension = null;
  this.canvas = canvas;
  this.options = options;
  this.state = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._renderMesh = function(mesh, camera, lights) {
  var gl = this.context;
  var program = mesh.material.program;
  var modelView = new EZ3.Matrix4();
  var i;

  program.bind(gl);
  mesh.material.updateStates(gl, this.state);
  mesh.material.updateUniforms(gl, this.state);

  modelView.mul(camera.view, mesh.world);

  program.loadUniformFloat(gl, 'uEyePosition', camera.position);
  program.loadUniformMatrix(gl, 'uModel', mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', camera.projection);

  if (this.state.hasLights) {
    mesh.updateNormal();
    mesh.updateNormalData();
    program.loadUniformMatrix(gl, 'uNormal', mesh.normal);
  }

  this.state.activeShadowReceiver = mesh.shadowReceiver;

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, this.state, program, i);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, this.state, program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, this.state, program, i);

  mesh.render(gl, program.attributes, this.state, this.extension);

  if (this.state.usedTextureSlots)
    this.state.usedTextureSlots = 0;
};

EZ3.Renderer.prototype._renderShadowCaster = function(mesh, program, view, projection) {
  var gl = this.context;
  var modelView = new EZ3.Matrix4();

  modelView.mul(view, mesh.world);

  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', projection);

  mesh.render(gl, program.attributes, this.state, this.extension);
};

EZ3.Renderer.prototype._renderDepth = function(lights, shadowCasters) {
  var gl = this.context;
  var color = new EZ3.Vector4(1.0);
  var origin;
  var view;
  var projection;
  var target;
  var program;
  var fragment;
  var vertex;
  var light;
  var up;
  var i;
  var j;
  var k;

  if (this.state.faceCulling !== EZ3.Material.FRONT) {
    if (this.state.faceCulling === EZ3.Material.NONE)
      gl.enable(gl.CULL_FACE);

    gl.cullFace(gl.FRONT);
    this.state.faceCulling = EZ3.Material.FRONT;
  }

  if (!this.state.programs.depth) {
    vertex = EZ3.ShaderLibrary.depth.vertex;
    fragment = EZ3.ShaderLibrary.depth.fragment;
    this.state.programs.depth = new EZ3.GLSLProgram(gl, vertex, fragment);
  }

  program = this.state.programs.depth;

  program.bind(gl);

  for (i = 0; i < lights.length; i++) {
    light = lights[i];

    light.updateProjection();

    light.depthFramebuffer.bind(gl);

    light.depthFramebuffer.update(gl);

    this.viewport(new EZ3.Vector2(), light.depthFramebuffer.size);

    if (light instanceof EZ3.PointLight) {

      up = new EZ3.Vector3();
      view = new EZ3.Matrix4();
      origin = new EZ3.Vector3();
      target = new EZ3.Vector3();

      for (j = 0; j < 6; j++) {

        switch (j) {
          case EZ3.Cubemap.POSITIVE_X:
            target.set(1, 0, 0);
            up.set(0, -1, 0);
            break;
          case EZ3.Cubemap.NEGATIVE_X:
            target.set(-1, 0, 0);
            up.set(0, -1, 0);
            break;
          case EZ3.Cubemap.POSITIVE_Y:
            target.set(0, 1, 0);
            up.set(0, 0, 1);
            break;
          case EZ3.Cubemap.NEGATIVE_Y:
            target.set(0, -1, 0);
            up.set(0, 0, -1);
            break;
          case EZ3.Cubemap.POSITIVE_Z:
            target.set(0, 0, 1);
            up.set(0, -1, 0);
            break;
          case EZ3.Cubemap.NEGATIVE_Z:
            target.set(0, 0, -1);
            up.set(0, -1, 0);
            break;
        }

        view.lookAt(origin, target, up);
        view.mul(new EZ3.Matrix4().setPosition(light.position.clone().invert()));

        projection = light.projection.clone();
        projection.scale(new EZ3.Vector3(1, -1, 1));

        light.depthFramebuffer.texture.attach(gl, j);

        this.clear(color);

        for (k = 0; k < shadowCasters.length; k++)
          this._renderShadowCaster(shadowCasters[k], program, view, projection);
      }
    } else {

      light.updateView();

      this.clear(color);

      for (j = 0; j < shadowCasters.length; j++)
        this._renderShadowCaster(shadowCasters[j], program, light.view, light.projection);
    }
  }
};

EZ3.Renderer.prototype._defaultFramebuffer = function() {
  var gl = this.context;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

EZ3.Renderer.prototype.initContext = function() {
  var that = this;
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];
  var i;

  for (i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context) {
      this.state = new EZ3.State();
      this.state.maxTextureSlots = this.context.getParameter(this.context.MAX_TEXTURE_IMAGE_UNITS) - 1;
      this.extension = new EZ3.Extension(this.context);
      break;
    }
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options.');

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
};

EZ3.Renderer.prototype.clear = function(color) {
  var gl = this.context;

  if (color instanceof EZ3.Vector4)
    gl.clearColor(color.x, color.y, color.z, color.w);
  else
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

EZ3.Renderer.prototype.viewport = function(position, size) {
  var gl = this.context;

  gl.viewport(position.x, position.y, size.x, size.y);
};

EZ3.Renderer.prototype.render = function(scene, camera) {
  var gl = this.context;
  var entities = [];
  var meshes = {
    common: [],
    opaque: [],
    transparent: [],
    shadowCasters: []
  };
  var lights = {
    point: [],
    directional: [],
    spot: []
  };
  var found = false;
  var entity;
  var mesh;
  var i;

  entities.push(scene);

  while (entities.length) {
    entity = entities.pop();

    if (entity instanceof EZ3.PointLight)
      lights.point.push(entity);
    else if (entity instanceof EZ3.DirectionalLight)
      lights.directional.push(entity);
    else if (entity instanceof EZ3.SpotLight)
      lights.spot.push(entity);
    else if (entity instanceof EZ3.Mesh)
      meshes.common.push(entity);
    else if (entity === camera)
      found = true;

    for (i = entity.children.length - 1; i >= 0; i--)
      entities.push(entity.children[i]);

    entity.updateWorld();
  }

  if (!found)
    camera.updateWorld();

  camera.updateView();
  camera.updateProjection();

  this.state.maxSpotLights = lights.spot.length;
  this.state.maxPointLights = lights.point.length;
  this.state.maxDirectionalLights = lights.directional.length;
  this.state.hasLights = lights.point.length || lights.directional.length || lights.spot.length;

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];

    mesh.updatePrimitiveData();
    mesh.updateLinearData();

    this.state.activeShadowReceiver = mesh.shadowReceiver;

    mesh.material.updateProgram(gl, this.state);

    if (mesh.material.transparent)
      meshes.transparent.push(mesh);
    else
      meshes.opaque.push(mesh);

    if (mesh.shadowCaster)
      meshes.shadowCasters.push(mesh);
  }

  if (meshes.shadowCasters.length) {
    if (this.state.maxSpotLights)
      this._renderDepth(lights.spot, meshes.shadowCasters);

    if (this.state.maxPointLights)
      this._renderDepth(lights.point, meshes.shadowCasters);

    if (this.state.maxDirectionalLights)
      this._renderDepth(lights.directional, meshes.shadowCasters);

    this._defaultFramebuffer();
    this.viewport(new EZ3.Vector2(), new EZ3.Vector2(this.canvas.width, this.canvas.height));
  }

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i], camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i], camera, lights);
};
