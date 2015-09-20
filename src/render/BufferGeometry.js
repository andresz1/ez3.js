/**
 * @class BufferGeometry
 */

EZ3.BufferGeometry = function() {
  this._id = null;
};

EZ3.BufferGeometry.prototype.setup = function(gl, target, type, layout, bufferAttribute) {
  gl.bindBuffer(target, this._id);

  if(layout !== undefined) {
    gl.enableVertexAttribArray(layout);
    gl.vertexAttribPointer(layout, bufferAttribute.length, type, bufferAttribute.normalized, bufferAttribute.stride, bufferAttribute.offset);
  }
};

EZ3.BufferGeometry.prototype.update = function(gl, target, type, bufferAttribute) {
  var array;

  if(type === gl.UNSIGNED_SHORT)
    array = new Uint16Array(bufferAttribute.data);
  else
    array = new Float32Array(bufferAttribute.data);

  if (bufferAttribute.dynamic) {
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
