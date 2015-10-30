/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, dynamic, need32Bits) {
  EZ3.Buffer.call(this, data, dynamic);

  this.need32Bits = need32Bits || false;
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

EZ3.IndexBuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
};

EZ3.IndexBuffer.prototype.update = function(gl, state) {
  var usage = (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var length;
  var UintArray;
  var offset;
  var array;
  var bytes;
  var k;

  if(this.need32Bits) {
    if(state.extension['OES_element_index_uint']) {
      bytes = 4;
      UintArray = Uint32Array;
    } else
      return;
  } else {
    bytes = 2;
    UintArray = Uint16Array;
  }

  length = bytes * this.data.length;

  if((length !== this.length) || (usage !== this.usage)) {
    this.usage = usage;
    this.length = length;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new UintArray(this.data), usage);
  } else {
    if(this.ranges.length) {
      for(k = 0; k < this.ranges.length; k++) {
        offset = bytes * this.ranges[k].left;
        array = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, new UintArray(array));
      }
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new UintArray(this.data));
    }
  }
};

EZ3.IndexBuffer.prototype.getType = function(gl, state) {
  return (state.extension['OES_element_index_uint'] && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};
