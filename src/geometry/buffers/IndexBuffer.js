/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, need32Bits, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  this.need32Bits = (need32Bits !== undefined) ? need32Bits : false;
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

EZ3.IndexBuffer.prototype.bind = function(gl) {
  EZ3.Buffer.prototype.bind.call(this, gl, gl.ELEMENT_ARRAY_BUFFER);
};

EZ3.IndexBuffer.prototype.update = function(gl, extension) {
  var bytes;

  if(this.need32Bits) {
    if(extension.elementIndexUInt)
      bytes = 4;
    else
      return;
  } else
    bytes = 2;

  EZ3.Buffer.prototype.update.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, bytes);
};

EZ3.IndexBuffer.prototype.getGLType = function(gl, extensions) {
  return (extensions.elementIndexUInt && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

EZ3.IndexBuffer.TRIANGULAR = 1;
EZ3.IndexBuffer.LINEAR = 2;
