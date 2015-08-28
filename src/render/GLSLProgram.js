/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, material, code) {
  this._gl = gl;
  this._code = code;
  this._shaders = [];
  this._program = null;
  this._uniformList = {};
  this._attributeList = {};

  this._create(material);
};

EZ3.GLSLProgram.prototype.enable = function() {
  this._gl.useProgram(this._program);
};

EZ3.GLSLProgram.prototype.disable = function() {
  this._gl.useProgram(null);
};

EZ3.GLSLProgram.prototype.loadUniformf = function(name, size, data) {
  switch (size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
      this._gl.uniform1f(this._getUniform(name), data);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
      this._gl.uniform2f(this._getUniform(name), data[0], data[1]);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
      this._gl.uniform3f(this._getUniform(name), data[0], data[1], data[2]);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
      this._gl.uniform4f(this._getUniform(name), data[0], data[1], data[2], data[3]);
      break;
  }
};

EZ3.GLSLProgram.prototype.loadUniformi = function(name, size, data) {
  switch (size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
      this._gl.uniform1i(this._getUniform(name), data);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
      this._gl.uniform2i(this._getUniform(name), data[0], data[1]);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
      this._gl.uniform3i(this._getUniform(name), data[0], data[1], data[2]);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
      this._gl.uniform4i(this._getUniform(name), data[0], data[1], data[2], data[3]);
      break;
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(name, size, data) {
  switch (size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_2X2:
      this._gl.uniformMatrix2fv(this._getUniform(name), false, data);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3X3:
      this._gl.uniformMatrix3fv(this._getUniform(name), false, data);
      break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4X4:
      this._gl.uniformMatrix4fv(this._getUniform(name), false, data);
      break;
  }
};

EZ3.GLSLProgram.prototype._compile = function(type, code) {
  var shader = this._gl.createShader(type);
  this._gl.shaderSource(shader, code);
  this._gl.compileShader(shader);

  if (!this._gl.getShaderParameter(shader,this._gl.COMPILE_STATUS)) {
    var infoLog = this._gl.getShaderInfoLog(shader);
    console.log('EZ3.GLSLProgram shader info log: ', infoLog, this._addLineNumbers(code) + '\n');
  } else {
    if (type === this._gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX_POSITION] = shader;
    else if (type === this._gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(material) {
  this._program = this._gl.createProgram();

  this._compile(this._gl.VERTEX_SHADER, material.vertex);
  this._compile(this._gl.FRAGMENT_SHADER, material.fragment);

  this._gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
  this._gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);
  this._gl.linkProgram(this._program);

  if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
    var infolog = this._gl.getProgramInfoLog(this._program, this._gl.LINK_STATUS);
    console.log('EZ3.GLSLProgram linking program error info log: ' + infoLog + '\n');
  } else {
    this._loadUniforms();
    this._loadAttributes();
    this._gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
    this._gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function() {
  var totalUniforms = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);

  for (var k = 0; k < totalUniforms; ++k) {
    var uniformInfo = this._gl.getActiveUniform(this._program, k);
    this._addUniform(uniformInfo.name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function() {
  var totalAttributes = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);

  for (var k = 0; k < totalAttributes; ++k) {
    var attributeInfo = this._gl.getActiveAttrib(this._program, k);
    this._addAttribute(attributeInfo.name);
  }
};

EZ3.GLSLProgram.prototype._addUniform = function(name) {
  this._uniformList[name] = this._gl.getUniformLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getUniform = function(name) {
  return this._uniformList[name];
};

EZ3.GLSLProgram.prototype._addAttribute = function(name) {
  this._attributeList[name] = this._gl.getAttribLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getAttribute = function(name) {
  return this._attributeList[name];
};

EZ3.GLSLProgram.prototype._addLineNumbers = function(code) {
  var codeLines = code.split('\n');

  for (var k = 0; k < codeLines.length; ++k)
    codeLines[k] = (k + 1) + ": " + codeLines[k];

  return codeLines;
};

EZ3.GLSLProgram.UNIFORM_SIZE_1D = 1;
EZ3.GLSLProgram.UNIFORM_SIZE_2D = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3D = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4D = 4;
EZ3.GLSLProgram.UNIFORM_SIZE_2X2 = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3X3 = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4X4 = 4;

EZ3.GLSLProgram.VERTEX_POSITION = 0;
EZ3.GLSLProgram.FRAGMENT_POSITION = 1;
