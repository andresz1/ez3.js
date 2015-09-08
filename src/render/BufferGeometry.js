/**
 * @class BufferGeometry
 */

EZ3.BufferGeometry = function() {
  this._id = null;
  this._data = [];
};

EZ3.BufferGeometry.prototype.setup = function(config) {
  var gl = config.context;

  gl.bindBuffer(config.target, this._id);

  if(config.layout !== undefined) {
    gl.enableVertexAttribArray(config.layout);
    gl.vertexAttribPointer(config.layout, config.length, config.type, config.normalized, config.stride, config.offset);
  }
};

EZ3.BufferGeometry.prototype.update = function(config) {
  var gl = config.context;
  var array;

  if(config.type === gl.UNSIGNED_SHORT)
    array = new Uint16Array(config.data);
  else
    array = new Float32Array(config.data);

  if (config.dynamic) {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(config.target, this._id);
      gl.bufferData(config.target, array, gl.DYNAMIC_DRAW);
      gl.bindBuffer(config.target, null);
    } else {
      gl.bindBuffer(config.target, this._id);
      gl.bufferSubData(config.target, 0, array);
      gl.bindBuffer(config.target, null);
    }
  } else {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(config.target, this._id);
      gl.bufferData(config.target, array, gl.STATIC_DRAW);
      gl.bindBuffer(config.target, null);
    }
  }
  this._data = config.data;
};

Object.defineProperty(EZ3.BufferGeometry.prototype, "id", {
  get: function() {
    return this._id;
  }
});

Object.defineProperty(EZ3.BufferGeometry.prototype, "data", {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
  }
});

EZ3.BufferGeometry.UV_LENGTH = 2;
EZ3.BufferGeometry.COLOR_LENGTH = 3;
EZ3.BufferGeometry.VERTEX_LENGTH = 3;
EZ3.BufferGeometry.NORMAL_LENGTH = 3;
EZ3.BufferGeometry.TANGENT_LENGTH = 4;
EZ3.BufferGeometry.BITANGENT_LENGTH = 3;