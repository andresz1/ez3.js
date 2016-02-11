/**
 * @class EZ3.Renderer
 * @param {HTMLElement} canvas
 * @param {Object} options
 */
EZ3.Renderer = function(canvas, options) {
  /**
   * @property {HTMLElement} canvas
   */
  this.canvas = canvas;
  /**
   * @property {Object} options
   */
  this.options = options;
  /**
   * @property {WebGLContext} context
   */
  this.context = null;
  /**
   * @property {EZ3.RendererState} state
   */
  this.state = null;
  /**
   * @property {EZ3.RendererExtensions} extensions
   */
  this.extensions = null;
  /**
   * @property {EZ3.RendererCapabilities} capabilities
   */
  this.capabilities = null;
};

/**
 * @method EZ3.Renderer#_processContextLost
 */
EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

/**
 * @method EZ3.Renderer#_renderMesh
 * @param {EZ3.Mesh} mesh
 * @param {EZ3.Camera} camera
 * @param {Object} lights
 */
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

  program.loadUniformFloat(gl, 'uEyePosition', camera.getWorldPosition());
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

  mesh.render(gl, this.state, this.extensions, program.attributes);

  this.state.usedTextureSlots = 0;
};

/**
 * @method EZ3.Renderer#_renderMeshDepth
 * @param {EZ3.GLSLProgram} program
 * @param {EZ3.Mesh} mesh
 * @param {EZ3.Matrix4} view
 * @param {EZ3.Matrix4} projection
 */
EZ3.Renderer.prototype._renderMeshDepth = function(program, mesh, view, projection) {
  var gl = this.context;
  var modelView = new EZ3.Matrix4();

  modelView.mul(view, mesh.world);

  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', projection);

  mesh.render(gl, this.state, this.extensions, program.attributes);
};

/**
 * @method EZ3.Renderer#_renderOmnidirectionalDepth
 * @param {EZ3.GLSLProgram} program
 * @param {EZ3.Mesh[]} meshes
 * @param {Object} lights
 */
EZ3.Renderer.prototype._renderOmnidirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var light;
  var frustum;
  var view;
  var projection;
  var mesh;
  var i;
  var j;
  var k;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

    for (j = 0; j < 6; j++) {
      view = light.getView(j);
      projection = light.projection;
      frustum = light.getFrustum(j);

      light.depthFramebuffer.texture.attach(gl, j);
      this.clear();

      for (k = 0; k < meshes.length; k++) {
        mesh = meshes[k];

        if (frustum.intersectsMesh(mesh))
          this._renderMeshDepth(program, mesh, view, projection);
      }
    }
  }
};

/**
 * @method EZ3.Renderer#_renderDirectionalDepth
 * @param {EZ3.GLSLProgram} program
 * @param {EZ3.Mesh[]} meshes
 * @param {Object} lights
 */
EZ3.Renderer.prototype._renderDirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var light;
  var mesh;
  var i;
  var j;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

    this.clear();

    for (j = 0; j < meshes.length; j++) {
      mesh = meshes[j];

      if (light.frustum.intersectsMesh(mesh))
        this._renderMeshDepth(program, mesh, light.view, light.projection);
    }
  }
};

/**
 * @method EZ3.Renderer#_renderDepth
 * @param {EZ3.Mesh[]} meshes
 * @param {Object} lights
 */
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
};

/**
 * @method EZ3.Renderer#initContext
 */
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

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
};

/**
 * @method EZ3.Renderer#clearColor
 * @param {EZ3.Vector4} color
 */
EZ3.Renderer.prototype.clearColor = function(color) {
  var gl = this.context;

  gl.clearColor(color.x, color.y, color.z, color.w);
};

/**
 * @method EZ3.Renderer#clear
 */
EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

/**
 * @method EZ3.Renderer#render
 * @param {EZ3.Vector2} position
 * @param {EZ3.Vector2} size
 * @param {EZ3.Entity} scene
 * @param {EZ3.Camera} camera
 */
EZ3.Renderer.prototype.render = function(position, size, scene, camera) {
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
    spot: []
  };
  var depth = new EZ3.Vector3();
  var empty = true;
  var mesh;
  var i;

  scene.updateWorldTraverse();

  scene.traverse(function(entity) {
    if (entity instanceof EZ3.Light) {
      empty = false;

      if (entity instanceof EZ3.PointLight) {
        entity.updateFrustums();

        lights.point.push(entity);
      } else {
        entity.updateFrustum();

        if (entity instanceof EZ3.DirectionalLight)
          lights.directional.push(entity);
        else if (entity instanceof EZ3.SpotLight)
          lights.spot.push(entity);
      }
    } else if (entity instanceof EZ3.Mesh)
      meshes.common.push(entity);
  });

  if (!camera.parent)
    camera.updateWorld();

  camera.updateFrustum();

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];

    if (!mesh.material.visible)
      continue;

    if (mesh.geometry instanceof EZ3.PrimitiveGeometry)
      mesh.geometry.updateData();

    if (mesh.shadowCaster)
      meshes.shadowCasters.push(mesh);

    if (!camera.frustum.intersectsMesh(mesh))
      continue;

    mesh.updateLines();

    if (!empty) {
      mesh.geometry.updateNormals();
      mesh.updateNormal();
    }

    mesh.updateProgram(gl, this.state, lights);

    depth.setPositionFromWorldMatrix(mesh.world).setFromViewProjectionMatrix(camera.viewProjection).z;

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
  }

  meshes.opaque.sort(function(a, b) {
    if (a.depth !== b.depth)
      return a.depth - b.depth;
  });

  meshes.transparent.sort(function(a, b) {
    if (a.depth !== b.depth)
      return b.depth - a.depth;
  });

  if (!empty)
    this._renderDepth(meshes.shadowCasters, lights);

  this.state.viewport(position, size);

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i].mesh, camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i].mesh, camera, lights);
};
