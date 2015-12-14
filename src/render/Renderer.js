/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.canvas = canvas;
  this.options = options;
  this.context = null;
  this.state = null;
  this.extensions = null;
  this.capabilities = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._renderMesh = function(mesh, camera, lights) {
  var gl = this.context;
  var program = mesh.material.program;
  var modelView = new EZ3.Matrix4();
  var light;
  var i;

  this.state.bindProgram(program);

  mesh.material.updateStates(gl, this.state);
  mesh.material.updateUniforms(gl, this.state, this.capabilities);

  modelView.mul(camera.view, mesh.world);

  program.loadUniformFloat(gl, 'uEyePosition', camera.position);
  program.loadUniformMatrix(gl, 'uModel', mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', camera.projection);
  program.loadUniformMatrix(gl, 'uNormal', mesh.normal);

  for (i = 0; i < lights.spot.length; i++) {
    light = lights.spot[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.spot.length);
  }

  for (i = 0; i < lights.point.length; i++) {
    light = lights.point[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.point.length);
  }

  for (i = 0; i < lights.directional.length; i++) {
    light = lights.directional[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.directional.length);
  }

  mesh.render(gl, program.attributes, this.state, this.extensions);

  this.state.usedTextureSlots = 0;
};

EZ3.Renderer.prototype._renderMeshDepth = function(program, mesh, view, projection) {
  var gl = this.context;
  var modelView = new EZ3.Matrix4();

  modelView.mul(view, mesh.world);

  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', projection);

  mesh.render(gl, program.attributes, this.state, this.extensions);
};

EZ3.Renderer.prototype._renderOmnidirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var target = new EZ3.Vector3();
  var up = new EZ3.Vector3();
  var view = new EZ3.Matrix4();
  var position;
  var light;
  var i;
  var j;
  var k;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];
    position = light.worldPosition();

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

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

      view.lookAt(position, target.add(position.clone()), up);

      light.depthFramebuffer.texture.attach(gl, j);

      this.clear();

      for (k = 0; k < meshes.length; k++)
        this._renderMeshDepth(program, meshes[k], view, light.projection);
    }
  }
};

EZ3.Renderer.prototype._renderDirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var light;
  var i;
  var j;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

    this.clear();

    for (j = 0; j < meshes.length; j++)
      this._renderMeshDepth(program, meshes[j], light.view, light.projection);
  }
};

EZ3.Renderer.prototype._renderDepth = function(meshes, lights) {
  var gl = this.context;
  var vertex;
  var fragment;
  var program;

  this.state.disable(gl.BLEND);

  this.state.enable(gl.CULL_FACE);
  this.state.cullFace(gl.FRONT);

  if (!this.state.programs.depth) {
    vertex = EZ3.ShaderLibrary.depth.vertex;
    fragment = EZ3.ShaderLibrary.depth.fragment;
    this.state.programs.depth = new EZ3.GLSLProgram(gl, vertex, fragment);
  }

  program = this.state.programs.depth;

  this.state.bindProgram(program);

  this._renderDirectionalDepth(program, meshes, lights.directional);
  this._renderDirectionalDepth(program, meshes, lights.spot);
  this._renderOmnidirectionalDepth(program, meshes, lights.point);

  EZ3.Framebuffer.unbind(gl);

  this.viewport(new EZ3.Vector2(), new EZ3.Vector2(this.canvas.width, this.canvas.height));
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

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options.');

  this.state = new EZ3.RendererState(this.context);
  this.extensions = new EZ3.RendererExtensions(this.context);
  this.capabilities = new EZ3.RendererCapabilities(this.context);

  this.clearColor();

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
};

EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

EZ3.Renderer.prototype.clearColor = function(color) {
  var gl = this.context;

  if (color)
    gl.clearColor(color.x, color.y, color.z, color.w);
  else
    gl.clearColor(0, 0, 0, 1);
};

EZ3.Renderer.prototype.viewport = function(position, size) {
  this.state.viewport(position, size);
};

EZ3.Renderer.prototype.render = function(scene, camera) {
  var gl = this.context;
  var meshes = {
    common: [],
    opaque: [],
    transparent: [],
    shadowCasters: []
  };
  var lights = {
    point: [],
    directional: [],
    spot: [],
    empty: true
  };
  var mesh;
  var depth;
  var viewProjection;
  var i;

  scene.updateWorldTraverse();

  scene.traverse(function(entity) {
    if (entity instanceof EZ3.Light) {
      lights.empty = false;

      entity.updateProjection();

      if (entity instanceof EZ3.PointLight)
        lights.point.push(entity);
      else if (entity instanceof EZ3.DirectionalLight) {
        entity.updateView();
        lights.directional.push(entity);
      } else if (entity instanceof EZ3.SpotLight) {
        entity.updateView();
        lights.spot.push(entity);
      }
    } else if (entity instanceof EZ3.Mesh && entity.material.visible)
      meshes.common.push(entity);
  });

  if (!camera.parent)
    camera.updateWorld();

  camera.updateView();
  camera.updateProjection();

  viewProjection = new EZ3.Matrix4().mul(camera.projection, camera.view);

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];
    depth = new EZ3.Vector3().fromPositionMatrix(mesh.world).fromViewProjectionMatrix(viewProjection).z;

    mesh.updatePrimitiveData();
    mesh.updateLinearData();

    if (!lights.empty) {
      mesh.updateNormal();
      mesh.updateNormalData();
    }

    mesh.material.updateProgram(gl, this.state, lights, mesh.shadowReceiver);

    if (mesh.material.transparent)
      meshes.transparent.push({
        mesh: mesh,
        depth: depth
      });
    else
      meshes.opaque.push({
        mesh: mesh,
        depth: depth
      });

    if (mesh.shadowCaster)
      meshes.shadowCasters.push(mesh);
  }

  meshes.opaque.sort(function(a, b) {
    if (a.depth !== b.depth)
      return a.depth - b.depth;
  });

  meshes.transparent.sort(function(a, b) {
    if (a.depth !== b.depth)
      return b.depth - a.depth;
  });

  if (meshes.shadowCasters.length && !lights.empty)
    this._renderDepth(meshes.shadowCasters, lights);

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i].mesh, camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i].mesh, camera, lights);
};
