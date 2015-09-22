/**
 * @class BufferGeometry
 */

EZ3.BufferGeometry = function() {
  this._id = 0;
};

EZ3.BufferGeometry.prototype.constructor = EZ3.BufferGeometry;

EZ3.BufferGeometry.prototype.bind = function(gl, target, type, layout, attr) {
  var size;
  var normalized;
  var stride;
  var offset;

  gl.bindBuffer(target, this._id);

  if(layout !== undefined) {
    size = attr.size;
    normalized = attr.normalized;
    stride = attr.stride;
    offset = attr.offset;

    gl.enableVertexAttribArray(layout);
    gl.vertexAttribPointer(layout, size, type, normalized, stride, offset);
  }
};

EZ3.BufferGeometry.prototype.update = function(gl, target, type, attr) {
  var data;

  if(type === gl.UNSIGNED_SHORT)
    data = new Uint16Array(attr.data);
  else
    data = new Float32Array(attr.data);

  if (attr.dynamic) {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(target, this._id);
      gl.bufferData(target, data, gl.DYNAMIC_DRAW);
      gl.bindBuffer(target, null);
    } else {
      gl.bindBuffer(target, this._id);
      gl.bufferSubData(target, 0, data);
      gl.bindBuffer(target, null);
    }
  } else {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(target, this._id);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      gl.bindBuffer(target, null);
    }
  }
};
