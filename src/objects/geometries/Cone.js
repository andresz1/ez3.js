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

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(5,5);
  }
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
  var radius;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      radius = Math.abs(this.height - actualHeight) * 0.5;

      vertex.x = radius * Math.cos(EZ3.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = radius * Math.sin(EZ3.DOUBLE_PI * v);

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

  this.uvs.data = uvs;
  this.uvs.dynamic = true;

  this.indices.data = indices;
  this.indices.dynamic = true;

  this.vertices.data = vertices;
  this.vertices.dynamic = true;

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
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'dirty', {
  get: function() {
    return this.base.dirty || this.height.dirty || this.resolution.dirty;
  },
  set: function(dirty) {
    this.base.dirty = dirty;
    this.height.dirty = dirty;
    this.resolution.dirty = dirty;
  }
});
