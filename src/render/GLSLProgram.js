/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, vertex, fragment, prefix) {
  this._id = null;
  this._cache = {};
  this._shaders = [];

  this.uniforms = {};
  this.attributes = {};

  this._create(gl, vertex, fragment, prefix);
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var shader = gl.createShader(type);
  var warning;

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    warning = 'EZ3.GLSLProgram shader info log: ';
    warning += gl.getShaderInfoLog(shader);
    warning += '\n';

    console.warn(warning);
  } else {
    if (type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX] = shader;
    else if (type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, vertex, fragment, prefix) {
  var warning;

  prefix = (prefix) ? prefix : '';

  this._compile(gl, gl.VERTEX_SHADER, prefix + vertex);
  this._compile(gl, gl.FRAGMENT_SHADER, prefix + fragment);

  this._id = gl.createProgram();

  gl.attachShader(this._id, this._shaders[EZ3.GLSLProgram.VERTEX]);
  gl.attachShader(this._id, this._shaders[EZ3.GLSLProgram.FRAGMENT]);

  gl.linkProgram(this._id);

  if (!gl.getProgramParameter(this._id, gl.LINK_STATUS)) {
    warning = 'EZ3.GLSLProgram linking program error info log: ';
    warning += gl.getProgramInfoLog(this._id, gl.LINK_STATUS);
    warning += '\n';

    console.warn(warning);
  } else {
    this._loadUniforms(gl);
    this._loadAttributes(gl);

    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var uniforms = gl.getProgramParameter(this._id, gl.ACTIVE_UNIFORMS);
  var name;
  var k;

  for (k = 0; k < uniforms; k++) {
    name = gl.getActiveUniform(this._id, k).name;
    this.uniforms[name] = gl.getUniformLocation(this._id, name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var attributes = gl.getProgramParameter(this._id, gl.ACTIVE_ATTRIBUTES);
  var name;
  var k;

  for (k = 0; k < attributes; k++) {
    name = gl.getActiveAttrib(this._id, k).name;
    this.attributes[name] = gl.getAttribLocation(this._id, name);
  }
};

EZ3.GLSLProgram.prototype.bind = function(gl) {
  gl.useProgram(this._id);
};

EZ3.GLSLProgram.prototype.loadUniformInteger = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (typeof data === 'number' && this._cache[name] !== data) {
      gl.uniform1i(location, data);
      this._cache[name] = data;
    } else if (data instanceof EZ3.Vector2 && data.isDiff(this._cache[name])) {
      gl.uniform2iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && data.isDiff(this._cache[name])) {
      gl.uniform3iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && data.isDiff(this._cache[name])) {
      gl.uniform4iv(location, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformFloat = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (typeof data === 'number' && this._cache[name] !== data) {
      gl.uniform1f(location, data);
      this._cache[name] = data;
    } else if (data instanceof EZ3.Vector2 && data.isDiff(this._cache[name])) {
      gl.uniform2fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && data.isDiff(this._cache[name])) {
      gl.uniform3fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && data.isDiff(this._cache[name])) {
      gl.uniform4fv(location, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (data instanceof EZ3.Matrix3 && data.isDiff(this._cache[name])) {
      gl.uniformMatrix3fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Matrix4 && data.isDiff(this._cache[name])) {
      gl.uniformMatrix4fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformSamplerArray = function(gl, name, data) {
  var location = this.uniforms[name];

  if(location) {
    if(data instanceof Array && this._cache[name] !== data.toString()) {
      this._cache[name] = data.toString();
      gl.uniform1iv(location, data);
    }
  }
};

EZ3.GLSLProgram.VERTEX = 0;
EZ3.GLSLProgram.FRAGMENT = 1;
