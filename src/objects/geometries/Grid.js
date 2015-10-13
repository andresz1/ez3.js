/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(resolution) {
  EZ3.Geometry.call(this);

  if (resolution !== undefined) {
    if (resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(2, 2);
  }

  this.generate();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Grid.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var need32Bits = false;
  var buffer;
  var length;
  var a;
  var b;
  var c;
  var d;
  var x;
  var z;

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x);
      vertices.push(0);
      vertices.push(z);

      uvs.push(x / this.resolution.y);
      uvs.push(z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      a = z * (this.resolution.x + 1) + x;
      b = a + 1;
      c = a + (this.resolution.x + 1);
      d = c + 1;

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, c, b, b, c, d);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);

  //this.mergeVertices();
};

Object.defineProperty(EZ3.Grid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if (resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Grid.prototype, 'regenerate', {
  get: function() {
    return this.resolution.dirty;
  },
  set: function(regenerate) {
    this.resolution.dirty = regenerate;
  }
});
