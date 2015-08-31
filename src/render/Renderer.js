/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._entities = [];
  this._programs = [];

  this._mvMatrix = mat4.create();
  this._mvpMatrix = mat4.create();
  this._viewMatrix = mat4.create();
  this._modelMatrix = mat4.create();
  this._normalMatrix = mat3.create();
  this._projectionMatrix = mat4.create();

  this.context = null;
  this.canvas = canvas;
  this.options = options;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype._updateMatrices = function(entity) {
  var position = vec3.create();
  vec3.set(position, 45, 45, 45);

  var target = vec3.create();
  vec3.set(target, 0, 0, 0);

  var up = vec3.create();
  vec3.set(up, 0, 1, 0);

  mat4.lookAt(this._viewMatrix, position, target, up);
  mat4.perspective(this._projectionMatrix, 70, 800 / 600, 1, 1000);

  mat4.copy(this._modelMatrix, entity.worldMatrix);
  mat4.copy(this._normalMatrix, entity.normalMatrix);
  mat4.multiply(this._mvMatrix, this._viewMatrix, this._modelMatrix);
  mat4.multiply(this._mvpMatrix, this._projectionMatrix, this._mvMatrix);
};

EZ3.Renderer.prototype._updateUniforms = function(material) {
  var gl = this.context;
  var program = material.program;

  if(material.heightMap && !material.heightTexture)
    material.heightTexture = material.setupTexture(gl, material.heightMap);

  if(material.normalMap && !material.normalTexture)
    material.normalTexture = material.setupTexture(gl, material.normalMap);

  if(material.diffuseMap && !material.diffuseTexture)
    material.diffuseTexture = material.setupTexture(gl, material.diffuseMap);

  if(material.heightTexture) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, material.heightTexture);
    program.loadUniformi(gl, 'heightTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }

  if(material.normalTexture) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, material.normalTexture);
    program.loadUniformi(gl, 'normalTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 1);
  }

  if(material.diffuseTexture) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    program.loadUniformi(gl, 'diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 2);
  }

  if(material.color)
    program.loadUniformf(gl, 'uColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.color);

  program.loadUniformMatrix(gl, 'mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvpMatrix);
};

EZ3.Renderer.prototype.initContext = function() {
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];

  for (var i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context)
      break;

  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options. Your browser may not support it.');

  var that = this;

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);

  if (this._onContextRestored) {
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    delete this._onContextRestored;
  }
};

EZ3.Renderer.prototype.clear = function() {
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  this.context.enable(this.context.DEPTH_TEST);
  this.context.depthFunc(this.context.LEQUAL);

  this.context.enable(this.context.CULL_FACE);
  this.context.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var entity;

  this.context.viewport(screen.position[0], screen.position[1], screen.size[0], screen.size[1]);
  this.context.clearColor(0.0, 0.0, 0.0, 1.0);

  screen.scene.update();
  this._entities.push(screen.scene);

  while (this._entities.length) {

    entity = this._entities.pop();

    if (entity instanceof EZ3.Mesh) {

      entity.setup(this.context);
      this._updateMatrices(entity);

      entity.material.program.enable(this.context);

      this._updateUniforms(entity.material);
      entity.render(this.context);

      entity.material.program.disable(this.context);
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
