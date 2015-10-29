/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.context = null;
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

  modelView.mul(mesh.world, camera.view);

  program.loadUniformf(gl, 'uEyePosition', 3, camera.position);
  program.loadUniformMatrix(gl, 'uModel', 4, mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', 4, modelView);
  program.loadUniformMatrix(gl, 'uProjection', 4, camera.projection);

  if (!lights.empty)
    program.loadUniformMatrix(gl, 'uNormal', 3, mesh.normal);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, program, i);

  mesh.render(gl, program.attributes, this.state);
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
      this.state = new EZ3.RendererState(this.context);
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
    transparent: []
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

    mesh.material.updateProgram(gl, lights, this.state);

    if (mesh.material.transparent)
      meshes.transparent.push(mesh);
    else
      meshes.opaque.push(mesh);
  }

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i], camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i], camera, lights);
};
