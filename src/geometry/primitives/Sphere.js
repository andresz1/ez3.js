/**
 * @class Sphere
 * @extends Primitive
 */

EZ3.Sphere = function(resolution, radius) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radius = radius || 5;
  this.resolution = resolution || new EZ3.Vector2(6, 6);
};

EZ3.Sphere.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var phi;
  var rho;
  var sinr;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      sinr = Math.sin(rho);

      vertex.x = this.radius * Math.cos(phi) * sinr;
      vertex.y = this.radius * Math.sin(rho - EZ3.Math.HALF_PI);
      vertex.z = this.radius * Math.sin(phi) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      if (!vertex.isZeroVector())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Sphere.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (this._cache.radius !== this.radius) {
      this._cache.radius = this.radius;
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});
