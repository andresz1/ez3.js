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

  if (!lights.empty)
    program.loadUniformMatrix(gl, 'uNormal', mesh.normal);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, program, i);

  mesh.render(gl, program.attributes, this.state, this.extension);
};

EZ3.Renderer.prototype._renderDepth = function(lights, shadowCasters) {
  var gl = this.context;
  var shadow = new EZ3.Matrix4();
  var position = new EZ3.Vector2();
  var modelViewProjection = new EZ3.Matrix4();
  var bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
  var framebuffer;
  var program;
  var light;
  var mesh;
  var i;
  var j;

  if (!this.state.program.depth)
    this.state.programs.depth = new EZ3.GLSLProgram(gl, EZ3.ShaderLibrary.depth.vert, EZ3.ShaderLibrary.depth.frag);

  program = this.state.programs.depth;

  program.bind(gl);

  for (i = 0; i < lights.length; i++) {
    light = lights[i];
    framebuffer = light.depthFramebuffer;

    framebuffer.bind(gl);

    if (framebuffer.dirty) {
      framebuffer.update(gl);
      framebuffer.dirty = false;
    }

    gl.clear(gl.DEPTH_BUFFER_BIT);
    this.viewport(position, framebuffer.dimensions);

    for (j = 0; j < shadowCasters.length; j++) {
      mesh = shadowCasters[j];

      modelViewProjection.mul(light.projection, new EZ3.Matrix4().mul(light.view, mesh.world));
      shadow.mul(bias, modelViewProjection);
    }
  }
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

EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

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
    empty: true,
    point: [],
    directional: [],
    spot: []
  };
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

    for (i = entity.children.length - 1; i >= 0; i--)
      entities.push(entity.children[i]);

    entity.updateWorld();
  }

  if (lights.point.length || lights.directional.length || lights.spot.length)
    lights.empty = false;

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];

    mesh.updateEssentialBuffers();

    if (!lights.empty) {
      mesh.updateIlluminationBuffers();
      mesh.updateNormal();
    }

    mesh.material.updateProgram(gl, this.state, lights);

    if (mesh.material.transparent)
      meshes.transparent.push(mesh);
    else
      meshes.opaque.push(mesh);

    if (mesh.material.shadowCaster)
      meshes.shadowCasters.push(mesh);
  }

  if (meshes.shadowCasters.length) {
    this._renderDepth(lights.directional, meshes.shadowCasters);
    this._renderDepth(lights.spot, meshes.shadowCasters);

    gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
  }

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i], camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i], camera, lights);
};
