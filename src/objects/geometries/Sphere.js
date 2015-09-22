/**
 * @class Sphere
 * @extends Geometry
 */

EZ3.Sphere = function(radius, resolution) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._radius.dirty = true;

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(5,5);
  }
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.generate = function() {
  var vertex = new EZ3.Vector3();
  var uvs = [];
  var indices = [];
  var vertices = [];
  var phi;
  var rho;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    for (t = 0; t < this.resolution.y; t++) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.DOUBLE_PI * u;
      rho = EZ3.PI * v;

      vertex.x = (this.radius * Math.cos(phi) * Math.sin(rho));
      vertex.y = (this.radius * Math.sin(rho - EZ3.HALF_PI));
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
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Sphere.prototype, 'dirty', {
  get: function() {
    return this.radius.dirty || this.resolution.dirty;
  },
  set: function(dirty) {
    this.radius.dirty = dirty;
    this.resolution.dirty = dirty;
  }
});
