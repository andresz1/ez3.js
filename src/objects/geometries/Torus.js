/**
 * @class Torus
 * @extends Primitive
 */

EZ3.Torus = function(resolution, radiuses) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiuses = radiuses || new EZ3.Vector2(7, 3);
  this.resolution = resolution || new EZ3.Vector2(5, 5);
};

EZ3.Torus.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var center = new EZ3.Vector3();
  var rho;
  var phi;
  var cosr;
  var sinr;
  var cosp;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      rho = EZ3.Math.DOUBLE_PI * u;
      phi = EZ3.Math.DOUBLE_PI * v;

      cosr = Math.cos(rho);
      sinr = Math.sin(rho);
      cosp = Math.cos(phi);

      center.x = this.radiuses.x * cosr;
      center.z = this.radiuses.x * sinr;

      vertex.x = (this.radiuses.x + this.radiuses.y * cosp) * cosr;
      vertex.y = (this.radiuses.y * Math.sin(phi));
      vertex.z = (this.radiuses.x + this.radiuses.y * cosp) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.sub(center);

      if (!vertex.testZero())
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

  this._setData(indices, vertices, normals, uvs);
};

Object.defineProperty(EZ3.Torus.prototype, 'needGenerate', {
  get: function() {
    if (!this.radiuses.testEqual(this._cache.radiuses) || !this.resolution.testEqual(this._cache.resolution)) {
      this._cache.radiuses = this.radiuses.clone();
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});
