/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, vertex, fragment, prefix) {
  this.used = 1;
  this._shaders = [];
  this._uniform = {};
  this._attribute = {};
  this._program = null;
  this._create(gl, vertex, fragment, prefix);
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var infoLog;
  var message;
  var lineNumbers;
  var shader = gl.createShader(type);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    infoLog = gl.getShaderInfoLog(shader);
    lineNumbers = this._addLineNumbers(code);
    message = 'EZ3.GLSLProgram shader info log: ';
    console.log(message + infoLog + lineNumbers + '\n');
  } else {
    if (type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX_POSITION] = shader;
    else if (type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, vertex, fragment, prefix) {
  var infoLog;
  var message;

  prefix = (prefix)? prefix: '';

  this._compile(gl, gl.VERTEX_SHADER, prefix + vertex);
  this._compile(gl, gl.FRAGMENT_SHADER, prefix + fragment);

  this._program = gl.createProgram();

  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.VERTEX]);
  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.FRAGMENT]);

  gl.linkProgram(this._program);

  if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
    infoLog = gl.getProgramInfoLog(this._program, gl.LINK_STATUS);
    message = 'EZ3.GLSLProgram linking program error info log: ';
    console.log(message + infoLog + '\n');
  } else {
    this._loadUniforms(gl);
    this._loadAttributes(gl);

    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var totalUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
  var uniformInfo;

  for (var k = 0; k < totalUniforms; ++k) {
    uniformInfo = gl.getActiveUniform(this._program, k);
    this._addUniform(gl, uniformInfo.name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var totalAttrib = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
  var attributeInfo;

  for (var k = 0; k < totalAttrib; ++k) {
    attributeInfo = gl.getActiveAttrib(this._program, k);
    this._addAttribute(gl, attributeInfo.name);
  }
};

EZ3.GLSLProgram.prototype._addUniform = function(gl, name) {
  this.uniforms[name] = gl.getUniformLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._addAttribute = function(gl, name) {
  this.attributes[name] = gl.getAttribLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._addLineNumbers = function(code) {
  var codeLines = code.split('\n');

  for (var k = 0; k < codeLines.length; ++k)
    codeLines[k] = (k + 1) + ': ' + codeLines[k] + '\n\n';

  return codeLines;
};

EZ3.GLSLProgram.prototype.bind = function(gl) {
  gl.useProgram(this._program);
};

EZ3.GLSLProgram.prototype.loadUniformf = function(gl, name, size, data) {
  if (data) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1f(this.uniforms[name], data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2f(this.uniforms[name], data[0], data[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3f(this.uniforms[name], data[0], data[1], data[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4f(this.uniforms[name], data[0], data[1], data[2], data[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformi = function(gl, name, size, data) {
  if (data) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1i(this.uniforms[name], data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2i(this.uniforms[name], data[0], data[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3i(this.uniforms[name], data[0], data[1], data[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4i(this.uniforms[name], data[0], data[1], data[2], data[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, size, data) {
  if (data !== undefined) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_2X2:
        gl.uniformMatrix2fv(this.uniforms[name], false, data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3X3:
        gl.uniformMatrix3fv(this.uniforms[name], false, data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4X4:
        gl.uniformMatrix4fv(this.uniforms[name], false, data);
        break;
    }
  }
};

Object.defineProperty(EZ3.GLSLProgram.prototype, 'uniforms', {
  get: function() {
    return this._uniform;
  }
});

Object.defineProperty(EZ3.GLSLProgram.prototype, 'attributes', {
  get: function() {
    return this._attribute;
  }
});

EZ3.GLSLProgram.UNIFORM_SIZE_1D = 1;
EZ3.GLSLProgram.UNIFORM_SIZE_2D = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3D = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4D = 4;
EZ3.GLSLProgram.UNIFORM_SIZE_2X2 = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3X3 = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4X4 = 4;

EZ3.GLSLProgram.VERTEX = 0;
EZ3.GLSLProgram.FRAGMENT = 1;
