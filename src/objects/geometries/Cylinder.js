/**
 * @class Cylinder
 * @extends Geometry
 */

EZ3.Cylinder = function(radius, base, height, resolution) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._base.dirty = true;

  this._radius = radius;
  this._radius.dirty = true;

  this._height = height;
  this._height.dirty = true;

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(5,5);
  }
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;

EZ3.Cylinder.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var actualHeight = this.height;
  var step = (this.height - this.base) / this.resolution.x;
  var buffer;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      vertex.x = this.radius * Math.cos(EZ3.Math.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = this.radius * Math.sin(EZ3.Math.DOUBLE_PI * v);

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
      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 0) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 1));

      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 1) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 0));
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);

  this.mergeVertices();
};

Object.defineProperty(EZ3.Cylinder.prototype, 'base', {
  get: function() {
    return this._base;
  },
  set: function(base) {
    this._base = base;
    this._base.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'radius', {
  get: function() {
    return this._radius;
  },
  set: function(radius) {
    this._radius = radius;
    this._radius.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(height) {
    this._height = height;
    this._height.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'regenerate', {
  get: function() {
    return this.base.dirty ||
           this.height.dirty ||
           this.radius.dirty ||
           this.resolution.dirty;
  },
  set: function(regenerate) {
    this.base.dirty = regenerate;
    this.height.dirty = regenerate;
    this.radius.dirty = regenerate;
    this.resolution.dirty = regenerate;
  }
});
