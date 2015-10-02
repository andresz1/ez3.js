/**
 * @class Cone
 * @extends Geometry
 */

EZ3.Cone = function(base, height, resolution) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._base.dirty = true;

  this._height = height;
  this._height.dirty = true;


  if (resolution instanceof EZ3.Vector2)
    this._resolution = resolution;
  else
    this._resolution = new EZ3.Vector2(5, 5);
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;

EZ3.Cone.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var actualHeight = this.height;
  var step = (this.height - this.base) / this.resolution.x;
  var need32Bits = false;
  var radius;
  var buffer;
  var length;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      radius = Math.abs(this.height - actualHeight) * 0.5;

      vertex.x = radius * Math.cos(EZ3.Math.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = radius * Math.sin(EZ3.Math.DOUBLE_PI * v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);

      uvs.push(u);
      uvs.push(v);
    }

    actualHeight -= step;

    if (actualHeight < this.base)
      break;
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
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

  this.mergeVertices();
};

Object.defineProperty(EZ3.Cone.prototype, 'base', {
  get: function() {
    return this._base;
  },
  set: function(base) {
    this._base = base;
    this._base.dirty = true;
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(height) {
    this._height = height;
    this._height.dirty = true;
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if (resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'regenerate', {
  get: function() {
    return this.base.dirty || this.height.dirty || this.resolution.dirty;
  },
  set: function(regenerate) {
    this.base.dirty = regenerate;
    this.height.dirty = regenerate;
    this.resolution.dirty = regenerate;
  }
});
