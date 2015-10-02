/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, dynamic, need32Bits) {
  EZ3.Buffer.call(this, data, dynamic);
  this._need32Bits = need32Bits || false;
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

EZ3.IndexBuffer.prototype.bind = function(gl) {
  if(!(this._id && gl.isBuffer(this._id)))
    this._id = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
};

EZ3.IndexBuffer.prototype.getType = function(gl) {
  var extension = gl.getExtension('OES_element_index_uint');
  return (extension && this._need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

EZ3.IndexBuffer.prototype.update = function(gl) {
  var extension = gl.getExtension('OES_element_index_uint');
  var hint = (this._dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var usage = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_USAGE);
  var length = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE);
  var UintArray;
  var offset;
  var array;
  var bytes;
  var k;

  if(this._need32Bits) {
    if(extension) {
      bytes = 4;
      UintArray = Uint32Array;
    } else {
      // Error
      return;
    }
  } else {
    bytes = 2;
    UintArray = Uint16Array;
  }

  if((bytes * this.data.length !== length) || (usage !== hint)) {
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new UintArray(this.data), hint);
  } else {
    if(this.ranges.length) {
      for(k = 0; k < this.ranges.length; k++) {
        offset = this.ranges[k].left * bytes;
        array = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, new UintArray(array));
      }
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new UintArray(array));
    }
  }
};

Object.defineProperty(EZ3.IndexBuffer.prototype, 'need32Bits', {
  get: function() {
    return this._need32Bits;
  },
  set: function(need32Bits) {
    this._need32Bits = need32Bits;
    this._dirty = true;
  }
});
