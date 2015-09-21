/**
 * @class BufferGeometry
 */

EZ3.BufferGeometry = function() {
  this._id = null;
};

EZ3.BufferGeometry.prototype.bind = function(gl, target, type, layout, attr) {
  var length, normalized, stride, offset;
  
  gl.bindBuffer(target, this._id);

  if(layout !== undefined) {
    length = attr.length;
    normalized = attr.normalized;
    stride = attr.stride;
    offset = attr.offset;

    gl.enableVertexAttribArray(layout);
    gl.vertexAttribPointer(layout, length, type, normalized, stride, offset);
  }
};

EZ3.BufferGeometry.prototype.update = function(gl, target, type, attribute) {
  var array;

  if(type === gl.UNSIGNED_SHORT)
    array = new Uint16Array(attribute.data);
  else
    array = new Float32Array(attribute.data);

  if (attribute.dynamic) {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(target, this._id);
      gl.bufferData(target, array, gl.DYNAMIC_DRAW);
      gl.bindBuffer(target, null);
    } else {
      gl.bindBuffer(target, this._id);
      gl.bufferSubData(target, 0, array);
      gl.bindBuffer(target, null);
    }
  } else {
    if (!this._id) {
      this._id = gl.createBuffer();
      gl.bindBuffer(target, this._id);
      gl.bufferData(target, array, gl.STATIC_DRAW);
      gl.bindBuffer(target, null);
    }
  }
};
