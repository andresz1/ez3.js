/**
 * @class EZ3.VertexBufferAttribute
 * @constructor
 * @param {Number} size
 * @param {Number} offset
 * @param {Boolean} normalized
 */
EZ3.VertexBufferAttribute = function(size, offset, normalized) {
  this.size = size;
  this.offset = (offset !== undefined) ? 4 * offset : 0;
  this.normalized = (normalized !== undefined) ? normalized : false;
};
