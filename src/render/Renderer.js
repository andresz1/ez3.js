/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._spots = [];
  this._puntuals = [];
  this._directionals = [];

  this._entities = [];
  this._programs = [];

  this._eyePosition = vec3.create();
  this._eyePosition.dirty = true;
  vec3.set(this._eyePosition, 45, 45, 45);

  this._mvMatrix = mat4.create();
  this._mvpMatrix = mat4.create();
  this._viewMatrix = mat4.create();
  this._modelMatrix = mat4.create();
  this._normalMatrix = mat3.create();
  this._projectionMatrix = mat4.create();

  this._viewMatrix.dirty = true;
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
  // Importante: Preguntar por la matriz de vista de la camara,
  // seterarle su dirty a falso y setear el dirty de la
  // matriz de vista del renderer en true
  if (this._viewMatrix.dirty) {
    var up = vec3.create();
    vec3.set(up, 0, 1, 0);

    var target = vec3.create();
    vec3.set(target, 0, 0, 0);

    mat4.lookAt(this._viewMatrix, this._eyePosition, target, up);
  }

  // Importante: Preguntar por la matriz de proyeccion de la camara,
  // seterarle su dirty a falso y setear el dirty de la
  // matriz de proyeccion del renderer en true
  if (this._projectionMatrix.dirty) {
    mat4.perspective(this._projectionMatrix, 70, 800 / 600, 1, 1000);
  }

  mat4.copy(this._modelMatrix, entity.worldMatrix);

  mat4.copy(this._normalMatrix, entity.normalMatrix);

  mat4.multiply(this._mvMatrix, this._viewMatrix, this._modelMatrix);

  mat4.multiply(this._mvpMatrix, this._projectionMatrix, this._mvMatrix);
};

EZ3.Renderer.prototype._updateUniformMaterial = function(material) {
  var gl = this.context;
  var program = material.program;

  if (material.color.dirty) {
    material.color.dirty = false;
    program.loadUniformf(gl, 'uMaterial.color', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.color.value);
  }

  if (material.shininess.dirty) {
    material.shininess.dirty = false;
    program.loadUniformf(gl, 'uMaterial.shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, material.shininess.value);
  }

  if (material.ambientColor.dirty) {
    material.ambientColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.ambientColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.ambientColor.value);
  }

  if (material.diffuseColor.dirty) {
    material.diffuseColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.diffuseColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.diffuseColor.value);
  }

  if (material.specularColor.dirty) {
    material.specularColor.dirty = false;
    program.loadUniformf(gl, 'uMaterial.specularColor', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.specularColor.value);
  }
};

EZ3.Renderer.prototype._updateUniformMatrices = function(material) {
  var gl = this.context;
  var program = material.program;

  program.loadUniformMatrix(gl, 'uMvMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvMatrix);

  program.loadUniformMatrix(gl, 'uMvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvpMatrix);

  program.loadUniformMatrix(gl, 'uModelMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._modelMatrix);

  program.loadUniformMatrix(gl, 'uNormalMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_3X3, this._normalMatrix);

  if (this._viewMatrix.dirty) {
    this._viewMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uViewMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._viewMatrix);
  }

  if (this._projectionMatrix.dirty) {
    this._projectionMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uProjectionMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._projectionMatrix);
  }
};

EZ3.Renderer.prototype._updateUniformTextures = function(material) {
  var gl = this.context;
  var program = material.program;

  if (material.heightTexture.dirty) {
    material.heightTexture.dirty = false;

    if (material.heightTexture.map) {
      material.heightTexture.value = material.setupTexture(gl, material.heightTexture.map);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, material.heightTexture.value);
      program.loadUniformi(gl, 'uHeightTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
    }
  }

  if (material.normalTexture.dirty) {
    material.normalTexture.dirty = false;

    if (material.normalTexture.map) {
      material.normalTexture.value = material.setupTexture(gl, material.normalTexture.map);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, material.normalTexture.value);
      program.loadUniformi(gl, 'uNormalTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 1);
    }
  }

  if (material.diffuseTexture.dirty) {
    material.diffuseTexture.dirty = false;

    if (material.diffuseTexture.map) {
      material.diffuseTexture.value = material.setupTexture(gl, material.diffuseTexture.map);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture.value);
      program.loadUniformi(gl, 'uDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 2);
    }
  }
};

EZ3.Renderer.prototype._updateUniformSpots = function(material) {
  var gl = this.context;
  var program = material.program;

  for (var k = 0; k < this._spots.length; ++k) {
    if (this._spots[k].cutoff.dirty) {
      this._spots[k].cutoff.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].cutoff', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._spots[k].cutoff.value);
    }

    if (this._spots[k].exponent.dirty) {
      this._spots[k].exponent.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].exponent', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._spots[k].exponent.value);
    }

    if (this._spots[k].position.dirty) {
      this._spots[k].position.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].position', EZ3.GLSLProgram.UNIFORM_SIZE_3D, this._spots[k].position.value);
    }

    if (this._spots[k].linearAttenuation.dirty) {
      this._spots[k].linearAttenuation.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].linearAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._spots[k].linearAttenuation.value);
    }

    if (this._spots[k].constantAttenuation.dirty) {
      this._spots[k].constantAttenuation.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].constantAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._spots[k].constantAttenuation.value);
    }

    if (this._spots[k].quadraticAttenuation.dirty) {
      this._spots[k].quadraticAttenuation.dirty = false;
      program.loadUniformf(gl, 'uSpots[' + k + '].quadraticAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._spots[k].quadraticAttenuation.value);
    }
  }
};

EZ3.Renderer.prototype._updateUniformPuntuals = function(material) {
  var gl = this.context;
  var program = material.program;

  for (var k = 0; k < this._puntuals.length; ++k) {
    if (this._puntuals[k].position.dirty) {
      this._puntuals[k].position.dirty = false;
      program.loadUniformf(gl, 'uPuntuals[' + k + '].position', EZ3.GLSLProgram.UNIFORM_SIZE_3D, this._puntuals[k].position.value);
    }

    if (this._puntuals[k].linearAttenuation.dirty) {
      this._puntuals[k].linearAttenuation.dirty = false;
      program.loadUniformf(gl, 'uPuntuals[' + k + '].linearAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._puntuals[k].linearAttenuation.value);
    }

    if (this._puntuals[k].constantAttenuation.dirty) {
      this._puntuals[k].constantAttenuation.dirty = false;
      program.loadUniformf(gl, 'uPuntuals[' + k + '].constantAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._puntuals[k].constantAttenuation.value);
    }

    if (this._puntuals[k].quadraticAttenuation.dirty) {
      this._puntuals[k].quadraticAttenuation.dirty = false;
      program.loadUniformf(gl, 'uPuntuals[' + k + '].quadraticAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._puntuals[k].quadraticAttenuation.value);
    }
  }
};

EZ3.Renderer.prototype._updateUniformDirectionals = function(material) {
  var gl = this.context;
  var program = material.program;

  for (var k = 0; k < this._directionals.length; ++k) {
    if (this._directional[k].direction.dirty) {
      this._directional[k].direction.dirty = false;
      program.loadUniformf(gl, 'uDirectionals[' + k + '].direction', EZ3.GLSLProgram.UNIFORM_SIZE_3D, this._directional[k].direction.value);
    }

    if (this._directionals[k].linearAttenuation.dirty) {
      this._directionals[k].linearAttenuation.dirty = false;
      program.loadUniformf(gl, 'uDirectionals[' + k + '].linearAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._directionals[k].linearAttenuation.value);
    }

    if (this._directionals[k].constantAttenuation.dirty) {
      this._directionals[k].constantAttenuation.dirty = false;
      program.loadUniformf(gl, 'uDirectionals[' + k + '].constantAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._directionals[k].constantAttenuation.value);
    }

    if (this._directionals[k].quadraticAttenuation.dirty) {
      this._directionals[k].quadraticAttenuation.dirty = false;
      program.loadUniformf(gl, 'uDirectionals[' + k + '].quadraticAttenuation', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this._directionals[k].quadraticAttenuation.value);
    }
  }
};

EZ3.Renderer.prototype._updateUniforms = function(entity) {
  var gl = this.context;
  var material = entity.material;
  var program = entity.material.program;

  this._updateUniformSpots(material);
  this._updateUniformMaterial(material);
  this._updateUniformMatrices(material);
  this._updateUniformTextures(material);
  this._updateUniformPuntuals(material);
  this._updateUniformDirectionals(material);

  if(this._eyePosition.dirty) {
    this._eyePosition.dirty = false;
    program.loadUniformf(gl, 'uEyePosition', EZ3.GLSLProgram.UNIFORM_SIZE_3D, this._eyePosition.value);
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
    } catch (e) {

    }

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

  this._spots = screen.scene.spots;
  this._puntuals = screen.scene.puntuals;
  this._directionals = screen.scene.directionals;

  screen.scene.update();
  this._entities.push(screen.scene);

  while (this._entities.length) {

    entity = this._entities.pop();

    if (entity instanceof EZ3.Mesh) {

      entity.setup(this.context);
      
      this._updateMatrices(entity);

      entity.material.program.enable(this.context);

      this._updateUniforms(entity);
      entity.render(this.context);

      entity.material.program.disable(this.context);

    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
