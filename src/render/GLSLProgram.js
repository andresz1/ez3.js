/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, config) {
  this._shaders = [];
  this._uniform = {};
  this._attribute = {};
  this._program = null;
  this._create(gl, config);
};

EZ3.GLSLProgram.prototype._buildPrefix = function(config) {
  var prefix = [
    'precision highp float;'
  ].join('\n');

  return prefix;
};

EZ3.GLSLProgram.prototype._buildVertex = function(prefix) {
  var vertex = [
    'attribute vec3 vertex;',
    'uniform mat4 uModelView;',
    'uniform mat4 uModelViewProjection;',
    'uniform mat4 uView;',
    'uniform mat4 uModel;',
    'uniform mat3 uNormal;',
    'uniform mat4 uProjection;',
    'void main() {',
    ' gl_PointSize = 3.0;',
    ' gl_Position = uModelViewProjection * vec4(vertex, 1.0);',
    '}'
  ].join('\n');

  return prefix + vertex;
};

EZ3.GLSLProgram.prototype._buildFragment = function(prefix) {
  var fragment = [
    'void main() {',
    ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  return prefix + fragment;
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var infoLog = gl.getShaderInfoLog(shader);
    console.log('EZ3.GLSLProgram shader info log: ', infoLog, this._addLineNumbers(code) + '\n');
  } else {
    if (type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX_POSITION] = shader;
    else if (type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, config) {
  var infoLog;
  var prefix = this._buildPrefix(config);

  this._compile(gl, gl.VERTEX_SHADER, this._buildVertex(prefix));
  this._compile(gl, gl.FRAGMENT_SHADER, this._buildFragment(prefix));

  this._program = gl.createProgram();

  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);

  gl.linkProgram(this._program);

  if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
    var infolog = gl.getProgramInfoLog(this._program, gl.LINK_STATUS);
    console.log('EZ3.GLSLProgram linking program error info log: ' + infoLog + '\n');
  } else {
    this._loadUniforms(gl);
    this._loadAttributes(gl);

    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var uniformInfo;
  var totalUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);

  for (var k = 0; k < totalUniforms; ++k) {
    uniformInfo = gl.getActiveUniform(this._program, k);
    this._addUniform(gl, uniformInfo.name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var totalAttributes = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
  var attributeInfo;

  for (var k = 0; k < totalAttributes; ++k) {
    attributeInfo = gl.getActiveAttrib(this._program, k);
    this._addAttribute(gl, attributeInfo.name);
  }
};

EZ3.GLSLProgram.prototype._addUniform = function(gl, name) {
  this.uniform[name] = gl.getUniformLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getUniform = function(name) {
  return this.uniform[name];
};

EZ3.GLSLProgram.prototype._addAttribute = function(gl, name) {
  this.attribute[name] = gl.getAttribLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getAttribute = function(name) {
  return this.attribute[name];
};

EZ3.GLSLProgram.prototype._addLineNumbers = function(code) {
  var codeLines = code.split('\n');

  for (var k = 0; k < codeLines.length; ++k)
    codeLines[k] = (k + 1) + ": " + codeLines[k] + '\n\n';

  return codeLines;
};

EZ3.GLSLProgram.prototype.enable = function(gl) {
  gl.useProgram(this._program);
};

EZ3.GLSLProgram.prototype.disable = function(gl) {
  gl.useProgram(null);
};

EZ3.GLSLProgram.prototype.loadUniformf = function(gl, name, size, data) {
  if (data) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1f(this._getUniform(name), data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2f(this._getUniform(name), data[0], data[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3f(this._getUniform(name), data[0], data[1], data[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4f(this._getUniform(name), data[0], data[1], data[2], data[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformi = function(gl, name, size, data) {
  if (data) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1i(this._getUniform(name), data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2i(this._getUniform(name), data[0], data[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3i(this._getUniform(name), data[0], data[1], data[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4i(this._getUniform(name), data[0], data[1], data[2], data[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, size, data) {
  if (data !== undefined) {
    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_2X2:
        gl.uniformMatrix2fv(this._getUniform(name), false, data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3X3:
        gl.uniformMatrix3fv(this._getUniform(name), false, data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4X4:
        gl.uniformMatrix4fv(this._getUniform(name), false, data);
        break;
    }
  }
};

Object.defineProperty(EZ3.GLSLProgram.prototype, "uniform", {
  get: function() {
    return this._uniform;
  }
});

Object.defineProperty(EZ3.GLSLProgram.prototype, "attribute", {
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

EZ3.GLSLProgram.VERTEX_POSITION = 0;
EZ3.GLSLProgram.FRAGMENT_POSITION = 1;
