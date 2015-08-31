/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._entities = [];
  this._programs = [];

  this._mvMatrix = {};
  this._mvpMatrix = {};
  this._viewMatrix = {};
  this._modelMatrix = {};
  this._normalMatrix = {};
  this._projectionMatrix = {};

  this._mvMatrix.value = mat4.create();
  this._mvpMatrix.value = mat4.create();
  this._viewMatrix.value = mat4.create();
  this._modelMatrix.value = mat4.create();
  this._normalMatrix.value = mat3.create();
  this._projectionMatrix.value = mat4.create();

  this._mvMatrix.dirty = true;
  this._mvpMatrix.dirty = true;
  this._viewMatrix.dirty = true;
  this._modelMatrix.dirty = true;
  this._normalMatrix.dirty = true;
  this._projectionMatrix.dirty = true;

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
  if(this._modelMatrix.dirty) {
    mat4.copy(this._modelMatrix.value, entity.worldMatrix);
  }

  if(this._normalMatrix.dirty) {
    mat4.copy(this._normalMatrix.value, entity.normalMatrix);
  }

  if(this._viewMatrix.dirty){
    var up = vec3.create();
    var target = vec3.create();
    var position = vec3.create();

    vec3.set(up, 0, 1, 0);
    vec3.set(target, 0, 0, 0);
    vec3.set(position, 45, 45, 45);

    mat4.lookAt(this._viewMatrix.value, position, target, up);
  }

  if(this._projectionMatrix.dirty) {
    mat4.perspective(this._projectionMatrix.value, 70, 800 / 600, 1, 1000);
  }

  if(this._mvMatrix.dirty) {
    mat4.multiply(this._mvMatrix.value, this._viewMatrix.value, this._modelMatrix.value);
  }

  if(this._mvMatrix.dirty) {
      mat4.multiply(this._mvpMatrix.value, this._projectionMatrix.value, this._mvMatrix.value);
  }
};

EZ3.Renderer.prototype._updateUniforms = function(material) {
  var gl = this.context;
  var program = material.program;

  if(this._mvMatrix.dirty){
    this._mvMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uMvMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvMatrix.value);
  }

  if(this._mvpMatrix.dirty) {
    this._mvpMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uMvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvpMatrix.value);
  }

  if(this._viewMatrix.dirty) {
    this._viewMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uViewMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._viewMatrix.value);
  }

  if(this._modelMatrix.dirty) {
    this._modelMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uModelMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._modelMatrix.value);
  }

  if(this._normalMatrix.dirty) {
    this._normalMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uNormalMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_3X3, this._normalMatrix.value);
  }

  if(this._projectionMatrix.dirty) {
    this._projectionMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uProjectionMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._projectionMatrix.value);
  }

  if(material.color.dirty) {
    material.color.dirty = false;
    program.loadUniformf(gl, 'uMaterial.color', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.color.value);
  }

  if(material.shininess.dirty) {
    material.shininess.dirty = false;
    program.loadUniformf(gl, 'uMaterial.shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, material.shininess.value);
  }

  if(material.ambientColor.dirty) {
    material.ambientColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.ambientColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.ambientColor.value);
  }

  if(material.diffuseColor.dirty) {
    material.diffuseColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.diffuseColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.diffuseColor.value);
  }

  if(material.specularColor.dirty) {
    material.specularColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.specularColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.specularColor.value);
  }

  if(material.heightTexture.dirty) {
    material.heightTexture.dirty = false;

    if(material.heightTexture.map) {
      material.heightTexture.value = material.setupTexture(gl, material.heightTexture.map);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, material.heightTexture.value);
      program.loadUniformi(gl, 'uHeightTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
    }
  }

  if(material.normalTexture.dirty) {
    material.normalTexture.dirty = false;

    if(material.normalTexture.map) {
      material.normalTexture.value = material.setupTexture(gl, material.normalTexture.map);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, material.normalTexture.value);
      program.loadUniformi(gl, 'uNormalTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 1);
    }
  }

  if(material.diffuseTexture.dirty) {
    material.diffuseTexture.dirty = false;

    if(material.diffuseTexture.map) {
      material.diffuseTexture.value = material.setupTexture(gl, material.diffuseTexture.map);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture.value);
      program.loadUniformi(gl, 'uDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 2);
    }
  }
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
