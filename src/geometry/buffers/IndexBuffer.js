/**
 * @class EZ3.IndexBuffer
 * @extends EZ3.Buffer
 * @constructor
 * @param {Number[]} [data]
 * @param {Boolean} [need32Bits]
 * @param {Boolean} [dynamic]
 */
EZ3.IndexBuffer = function(data, need32Bits, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  /**
   * @property {Boolean} needUpdate
   * @default false
   */
  this.need32Bits = (need32Bits !== undefined) ? need32Bits : false;
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

/**
 * @method EZ3.IndexBuffer#bind
 * @param {WebGLContext} gl
 */
EZ3.IndexBuffer.prototype.bind = function(gl) {
  EZ3.Buffer.prototype.bind.call(this, gl, gl.ELEMENT_ARRAY_BUFFER);
};

/**
 * @method EZ3.IndexBuffer#update
 * @param {WebGLContext} gl
 * @param {EZ3.RendererExtensions} extensions
 */
EZ3.IndexBuffer.prototype.update = function(gl, extensions) {
  var bytes;

  if(this.need32Bits) {
    if(extensions.elementIndexUInt)
      bytes = 4;
    else
      return;
  } else
    bytes = 2;

  EZ3.Buffer.prototype.update.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, bytes);
};

/**
 * @method EZ3.IndexBuffer#getGLType
 * @param {WebGLContext} gl
 * @param {EZ3.RendererExtensions} extensions
 * @return Number
 */
EZ3.IndexBuffer.prototype.getGLType = function(gl, extensions) {
  return (extensions.elementIndexUInt && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

/**
 * @property {Number} TRIANGULAR
 * @memberof EZ3.IndexBuffer
 * @static
 * @final
 */
EZ3.IndexBuffer.TRIANGULAR = 1;

/**
 * @property {Number} LINEAR
 * @memberof EZ3.IndexBuffer
 * @static
 * @final
 */
EZ3.IndexBuffer.LINEAR = 2;
