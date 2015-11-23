/**
 * @class Grid
 * @extends Primitive
 */

EZ3.Plane = function(resolution) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.resolution = resolution || new EZ3.Vector2(2, 2);
};

EZ3.Plane.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Plane.prototype.constructor = EZ3.Plane;

EZ3.Plane.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var a;
  var b;
  var c;
  var d;
  var x;
  var z;

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x, 0, z);
      normals.push(0, 1, 0);
      uvs.push(x / this.resolution.y, z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      a = z * (this.resolution.x + 1) + x;
      b = a + 1;
      c = a + (this.resolution.x + 1);
      d = c + 1;

      indices.push(a, c, b, b, c, d);
    }
  }

  this._setData(indices, vertices, normals, uvs);
};

Object.defineProperty(EZ3.Plane.prototype, 'needGenerate', {
  get: function() {
    if (!this.resolution.testEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});