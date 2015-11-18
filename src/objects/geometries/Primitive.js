/**
 * @class Primitive
 * @extends Geometry
 */

 EZ3.Primitive = function() {
   EZ3.Geometry.call(this);
 };

 EZ3.Primitive.prototype = Object.create(EZ3.Geometry.prototype);
 EZ3.Primitive.prototype.constructor = EZ3.Primitive;

EZ3.Primitive.prototype._setData = function(indices, vertices, normals, uvs) {
  var buffer = this.buffers.get('triangle');
  var need32Bits = (vertices.length / 3) > EZ3.Math.MAX_USHORT;

  if (!buffer) {
    buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
    this.buffers.add('triangle', buffer);
  } else {
    buffer.data = indices;
    buffer.need32Bits = need32Bits;
    buffer.needUpdate = true;
  }

  buffer = this.buffers.get('position');

  if (!buffer) {
    buffer = new EZ3.VertexBuffer(vertices);
    buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
    this.buffers.add('position', buffer);
  } else {
    buffer.data = vertices;
    buffer.needUpdate = true;
  }

  buffer = this.buffers.get('uv');

  if (!buffer) {
    buffer = new EZ3.VertexBuffer(uvs);
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    this.buffers.add('uv', buffer);
  } else {
    buffer.data = uvs;
    buffer.needUpdate = true;
  }

  this._setNormalData(normals);
};
