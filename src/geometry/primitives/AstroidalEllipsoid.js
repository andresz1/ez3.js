/**
 * @class AstroidalEllipsoid
 * @extends Primitive
 */

EZ3.AstroidalEllipsoid = function(resolution, radiouses) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiouses = radiouses || new EZ3.Vector3(90, 90, 90);
  this.resolution = resolution || new EZ3.Vector2(150, 150);
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.AstroidalEllipsoid.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var phi;
  var rho;
  var cosr;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u - EZ3.Math.PI;
      rho = EZ3.Math.PI * v - EZ3.Math.HALF_PI;

      cosr = Math.pow(Math.cos(rho), 3.0);

      vertex.x = (this.radiouses.x * cosr * Math.pow(Math.cos(phi), 3.0));
      vertex.y = (this.radiouses.y * Math.pow(Math.sin(rho), 3.0));
      vertex.z = (this.radiouses.z * cosr * Math.pow(Math.sin(phi), 3.0));

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.x /= this.radiouses.x;
      vertex.y /= this.radiouses.y;
      vertex.z /= this.radiouses.z;

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

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'needGenerate', {
  get: function() {
    if (!this.radiouses.testEqual(this._cache.radiouses) || !this.resolution.testEqual(this._cache.resolution)) {
      this._cache.radiouses = this.radiouses.clone();
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});
