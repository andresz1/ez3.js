/**
 * @class Ellipsoid
 * @extends Primitive
 */

EZ3.Ellipsoid = function(radiuses, resolution) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiuses = radiuses || new EZ3.Vector3(10, 5, 10);
  this.resolution = resolution || new EZ3.Vector2(100, 100);
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

EZ3.Ellipsoid.prototype.generate = function() {
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

      vertex.x = this.radiuses.x * Math.cos(phi) * sinr;
      vertex.y = this.radiuses.y * Math.sin(rho - EZ3.Math.HALF_PI);
      vertex.z = this.radiuses.z * Math.sin(phi) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.x /= this.radiuses.x;
      vertex.y /= this.radiuses.y;
      vertex.z /= this.radiuses.z;

      if (!vertex.testZero())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; s++) {
    for (t = 0; t < this.resolution.y - 1; t++) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this._setData(indices, vertices, normals, uvs);
};

Object.defineProperty(EZ3.Ellipsoid.prototype, 'needGenerate', {
  get: function() {
    if (!this.radiuses.testEqual(this._cache.radiuses) || !this.resolution.testEqual(this._cache.resolution)) {
      this._cache.radiuses = this.radiuses.clone();
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});