/**
 * @class VertexBufferAttribute
 */

EZ3.VertexBufferAttribute = function(size, offset, normalized) {
  this.size = size;
  this.offset = 4 * offset || 0;
  this.normalized = normalized || false;
};
