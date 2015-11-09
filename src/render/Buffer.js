/**
 * @class Buffer
 */

EZ3.Buffer = function(data, dynamic) {
  this._id = null;
  this._cache = {};

  this.ranges = [];
  this.data = data || [];
  this.dynamic = dynamic || false;
  this.usage = null;
  this.length = null;
  this.dirty = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

EZ3.Buffer.prototype.bind = function(gl, target) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(target, this._id);
};

EZ3.Buffer.prototype.update = function(gl, target, bytes) {
  var length = bytes * this.data.length;
  var ArrayType;
  var offset;
  var data;
  var k;

  if (target === gl.ELEMENT_ARRAY_BUFFER) {
    ArrayType = Float32Array;
  } else {
    if (bytes === 4)
      ArrayType = Uint32Array;
    else
      ArrayType = Uint16Array;
  }


  if ((this._cache.length !== length) || (this._cache.dynamic !== this.dynamic)) {
    this._cache.length = length;
    this._cache.dynamic =  this.dynamic;

    gl.bufferData(target, new ArrayType(this.data), (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  } else {
    if (this.ranges.length) {
      for (k = 0; k < this.ranges.length; k++) {
        offset = bytes * this.ranges[k].left;
        data = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(target, offset, new ArrayType(data));
      }

      this.ranges.length = 0;
    } else
      gl.bufferSubData(target, 0, new ArrayType(this.data));
  }
};
