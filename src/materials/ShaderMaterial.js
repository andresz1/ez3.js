/**
 * @class EZ3.ShaderMaterial
 * @extends EZ3.Material
 * @constructor
 * @param {String} id
 * @param {String} vertex
 * @param {String} fragment
 */
EZ3.ShaderMaterial = function(id, vertex, fragment) {
  EZ3.Material.call(this, 'SHADER.' + id);

  /**
   * @property {String} _vertex
   * @private
   */
  this._vertex = vertex;
  /**
   * @property {String} _fragment
   * @private
   */
  this._fragment = fragment;
  /**
   * @property {Object} _uniformIntegers
   * @private
   */
  this._uniformIntegers = {};
  /**
   * @property {Object} _uniformFloats
   * @private
   */
  this._uniformFloats = {};
  /**
   * @property {Object} _uniformMatrices
   * @private
   */
  this._uniformMatrices = {};
  /**
   * @property {Object} _uniformTextures
   * @private
   */
  this._uniformTextures = {};
};

EZ3.ShaderMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ShaderMaterial.prototype.constructor = EZ3.Material;

/**
 * @method EZ3.ShaderMaterial#updateProgram
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 */
EZ3.ShaderMaterial.prototype.updateProgram = function(gl, state) {
  if (!this.program)
    this.program = state.createProgram(this._id, this._vertex, this._fragment);
};

/**
 * @method EZ3.ShaderMaterial#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 */
EZ3.ShaderMaterial.prototype.updateUniforms = function(gl, state, capabilities) {
  var name;
  var texture;

  for (name in this._uniformIntegers)
    this.program.loadUniformInteger(gl, name, this._uniformIntegers[name]);

  for (name in this._uniformFloats)
    this.program.loadUniformFloat(gl, name, this._uniformFloats[name]);

  for (name in this._uniformMatrices)
    this.program.loadUniformMatrix(gl, name, this._uniformMatrices[name]);

  for (name in this._uniformTextures) {
    texture = this._uniformTextures[name];

    texture.bind(gl, state, capabilities);
    texture.update(gl);

    this.program.loadUniformInteger(gl, name, state.usedTextureSlots++);
  }
};

/**
 * @method EZ3.ShaderMaterial#setUniformInteger
 * @param {String} name
 * @param {Number|EZ3.Vector2|EZ3.Vector3|EZ3.Vector4} value
 */
EZ3.ShaderMaterial.prototype.setUniformInteger = function(name, value) {
  this._uniformIntegers[name] = value;
};

/**
 * @method EZ3.ShaderMaterial#setUniformFloat
 * @param {String} name
 * @param {Number|EZ3.Vector2|EZ3.Vector3|EZ3.Vector4} value
 */
EZ3.ShaderMaterial.prototype.setUniformFloat = function(name, value) {
  this._uniformFloats[name] = value;
};

/**
 * @method EZ3.ShaderMaterial#setUniformMatrix
 * @param {String} name
 * @param {EZ3.Matrix3|EZ3.Matrix4} value
 */
EZ3.ShaderMaterial.prototype.setUniformMatrix = function(name, value) {
  this._uniformMatrices[name] = value;
};

/**
 * @method EZ3.ShaderMaterial#setUniformTexture
 * @param {String} name
 * @param {EZ3.Texture} value
 */
EZ3.ShaderMaterial.prototype.setUniformTexture = function(name, value) {
  this._uniformTextures[name] = value;
};

/**
 * @method EZ3.ShaderMaterial#getUniform
 * @param {String} name
 * @return {Number|EZ3.Vector2|EZ3.Vector3|EZ3.Vector4|EZ3.Matrix3|EZ3.Matrix4|EZ3.Texture}
 */
EZ3.ShaderMaterial.prototype.getUniform = function(name) {
  if (this._uniformIntegers[name])
    return this._uniformIntegers[name];
  else if(this._uniformFloats[name])
    return this._uniformFloat[name];
  else if(this._uniformMatrices[name])
    return this._uniformMatrices[name];
  else
    return this._uniformTextures[name];
};
