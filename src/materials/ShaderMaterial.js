/**
 * @class ShaderMaterial
 * @extends Material
 */

EZ3.ShaderMaterial = function(id, vertex, fragment) {
  EZ3.Material.call(this, EZ3.Material.SHADER + id);

  this._vertex = vertex;
  this._fragment = fragment;
  this._uniformIntegers = {};
  this._uniformFloats = {};
  this._uniformMatrices = {};
  this._uniformTextures = {};
};

EZ3.ShaderMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ShaderMaterial.prototype.constructor = EZ3.Material;

EZ3.ShaderMaterial.prototype.updateProgram = function(gl, state) {
  if (!this.program) {
    if(state.programs[this._id])
      this.program = state.programs[this._id];
    else {
      this.program = new EZ3.GLSLProgram(gl, this._vertex, this._fragment);
      state.programs[this._id] = this.program;
    }
  }
};

EZ3.ShaderMaterial.prototype.updateUniforms = function(gl, state) {
  var i = 0;
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

    texture.bind(gl, state);
    texture.update(gl);

    this.program.loadUniformInteger(gl, name, i++);
  }
};

EZ3.ShaderMaterial.prototype.setUniformInteger = function(name, value) {
  this._uniformIntegers[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformFloat = function(name, value) {
  this._uniformFloats[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformMatrix = function(name, value) {
  this._uniformMatrices[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformTexture = function(name, value) {
  this._uniformTextures[name] = value;
};

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
