/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._mvMatrix = new EZ3.Matrix4();
  this._mvpMatrix = new EZ3.Matrix4();
  this._viewMatrix = new EZ3.Matrix4();
  this._modelMatrix = new EZ3.Matrix4();
  this._normalMatrix = new EZ3.Matrix3();
  this._projectionMatrix = new EZ3.Matrix4();
  this._lights = [];
  this._meshes = [];
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

EZ3.Renderer.prototype._processProgram = function(material) {
  var gl = this.context;

  if (!material.program) {
    material.program = new EZ3.GLSLProgram(gl, material.config);
  }
};

EZ3.Renderer.prototype._processMatrices = function(mesh) {
  if (this._viewMatrix.dirty) {
    var up = new EZ3.Vector3(0, 1, 0);
    var target = new EZ3.Vector3(0, 0, 0);
    var position = new EZ3.Vector3(45, 45, 45);
    this._viewMatrix.lookAt(position, target, up);
  }

  if (this._projectionMatrix.dirty)
    this._projectionMatrix.perspective(70, 800 / 600, 1, 1000);

  this._modelMatrix.copy(mesh.worldMatrix);
  this._normalMatrix.copy(mesh.normalMatrix);
  this._mvMatrix.mul(this._modelMatrix, this._viewMatrix);
  this._mvpMatrix.mul(this._mvMatrix, this._projectionMatrix);
};

EZ3.Renderer.prototype._processUniforms = function(material) {
  var gl = this.context;
  var program = material.program;
  var data;
  var name;
  var length;

  name = 'uModelView';
  data = this._mvMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uModelViewProjection';
  data = this._mvpMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uModel';
  data = this._modelMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uNormal';
  data = this._normalMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_3X3;
  program.loadUniformMatrix(gl, name, length, data);

  if (this._viewMatrix.dirty) {
    name = 'uView';
    data = this._viewMatrix.toArray();
    length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
    program.loadUniformMatrix(gl, name, length, data);
    this._viewMatrix.dirty = false;
  }

  if (this._projectionMatrix.dirty) {
    name = 'uProjection';
    data = this._projectionMatrix.toArray();
    length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
    program.loadUniformMatrix(gl, name, length, data);
    this._projectionMatrix.dirty = false;
  }
};

EZ3.Renderer.prototype._opaqueSort = function(a, b) {
  if(a.position.z !== b.position.z) {
    return a.position.z - b.position.z;
  }
};

EZ3.Renderer.prototype._transparentSort = function(a, b) {
  if(a.position.z !== b.position.z) {
    return b.position.z - a.position.z;
  }
};

EZ3.Renderer.prototype._processScene = function(scene) {
  var entities = [];
  var entity;
  var dirty;
  var k;

  this._lights.length = 0;
  this._meshes.length = 0;

  entities.push(scene);

  while(entities.length) {
    entity = entities.pop();
    dirty = entity.dirty;

    if(entity instanceof EZ3.Light)
      this._lights.push(entity);
    else if(entity instanceof EZ3.Mesh)
      this._meshes.push(entity);

    for(k = entity.children.length - 1; k >= 0; k--) {
      entity.children[k].dirty = dirty;
      entities.push(entity.children[k]);
    }

    if(dirty) {
      entity.update();
      entity.dirty = false;
    }
  }

  this._meshes.sort(this._opaqueSort);
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

  gl.enable(this.context.DEPTH_TEST);
  gl.depthFunc(this.context.LEQUAL);

  gl.enable(this.context.CULL_FACE);
  gl.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var gl = this.context;
  var position = screen.position;
  var size = screen.size;
  var material;
  var program;
  var k;

  gl.viewport(position.x, position.y, size.x, size.y);

  this._processScene(screen.scene);

  for(k = 0; k < this._meshes.length; ++k) {
    material = this._meshes[k].material;

    this._processMatrices(this._meshes[k]);

    material.update(gl, this._programs);
    program = this._meshes[k].material.program;

    program.bind(gl);

    material.bind(gl);
    this._processUniforms(material);
    this._meshes[k].render(gl);
  }
};
