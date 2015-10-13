/**
 * @class Sphere
 * @extends Geometry
 */

EZ3.Sphere = function(radius, resolution) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._radius.dirty = true;

  if (resolution instanceof EZ3.Vector2)
    this._resolution = resolution;
  else
    this._resolution = new EZ3.Vector2(5, 5);

  this.generate();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.generate = function() {
  var vertex = new EZ3.Vector3();
  var uvs = [];
  var indices = [];
  var vertices = [];
  var need32Bits = false;
  var buffer;
  var length;
  var phi;
  var rho;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    for (t = 0; t < this.resolution.y; t++) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      vertex.x = (this.radius * Math.cos(phi) * Math.sin(rho));
      vertex.y = (this.radius * Math.sin(rho - EZ3.Math.HALF_PI));
      vertex.z = (this.radius * Math.sin(phi) * Math.sin(rho));

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
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

//  this.mergeVertices();
};

Object.defineProperty(EZ3.Sphere.prototype, 'radius', {
  get: function() {
    return this._radius;
  },
  set: function(radius) {
    this._radius = radius;
    this._radius.dirty = true;
  }
});

Object.defineProperty(EZ3.Sphere.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if (resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Sphere.prototype, 'regenerate', {
  get: function() {
    return this.radius.dirty || this.resolution.dirty;
  },
  set: function(regenerate) {
    this.radius.dirty = regenerate;
    this.resolution.dirty = regenerate;
  }
});
