/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._programs = {};

  this.canvas = canvas;
  this.options = options;
  this.context = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype._updateCommonUniforms = function(mesh, camera, lights) {
  var gl = this.context;
  var program = mesh.material.program;
  var modelView = new EZ3.Matrix4();
  
  modelView.mul(mesh.world, camera.view);

  program.loadUniformMatrix(gl, 'uModel', 4, mesh.world.toArray());
  program.loadUniformMatrix(gl, 'uModelView', 4, modelView.toArray());
  program.loadUniformMatrix(gl, 'uProjection', 4, camera.projection.toArray());

  if (lights)
    program.loadUniformMatrix(gl, 'uNormal', 3, mesh.normal.toArray());
};

EZ3.Renderer.prototype._prepareMesh = function(mesh, lights) {
  var gl = this.context;

  if (lights.point.length || lights.directional.length || lights.spot.length)
    mesh.updateIllumination();

  mesh.updateFill();
  mesh.material.updateProgram(gl, this._programs, lights);
};

EZ3.Renderer.prototype._renderMesh = function(mesh, camera, lights) {
  var gl = this.context;
  var lighting = lights.point.length ||
    lights.directional.length ||
    lights.spot.length;
  var i;

  mesh.material.program.bind(gl);
  mesh.material.updateStates(gl);
  mesh.material.updateUniforms(gl);

  this._updateCommonUniforms(mesh, camera, lighting);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, mesh.material.program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, mesh.material.program, i);

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, mesh.material.program, i);

  mesh.render(gl, mesh.material.program.attributes);
};

EZ3.Renderer.prototype.initContext = function() {
  var that = this;
  var contextName;
  var contextStatus;
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

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  contextName = 'webglcontextlost';
  contextStatus = this._onContextLost;
  this.canvas.addEventListener(contextName, contextStatus, false);

  if (this._onContextRestored) {
    contextName = 'webglcontextrestored';
    contextStatus = this._onContextRestored;
    this.canvas.removeEventListener(contextName, contextStatus, false);
    delete this._onContextRestored;
  }
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
  var entities = [];
  var meshes = [];
  var lights = {
    point: [],
    directional: [],
    spot: []
  };
  var entity;
  var k;

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
      meshes.push(entity);

    for (k = entity.children.length - 1; k >= 0; k--)
      entities.push(entity.children[k]);

    entity.updateWorld();
  }

  for (k = 0; k < meshes.length; k++) {
    this._prepareMesh(meshes[k], lights);
    this._renderMesh(meshes[k], camera, lights);
  }
};
