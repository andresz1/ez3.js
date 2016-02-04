/**
 * @class EZ3.PlaneGeometry
 * @extends EZ3.Primitive
 * @constructor
 * @param {EZ3.Vector2} [resolution]
 */

EZ3.PlaneGeometry = function(resolution) {
  EZ3.Primitive.call(this);

  /**
   * @property {EZ3.Vector2} resolution
   * @default new EZ3.Vector2(2, 2)
   */
  this.resolution = resolution || new EZ3.Vector2(2, 2);
};

EZ3.PlaneGeometry.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.PlaneGeometry.prototype.constructor = EZ3.PlaneGeometry;

/**
 * @method EZ3.PlaneGeometry#generate
 */
EZ3.PlaneGeometry.prototype.generate = function() {
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

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

/**
 * @property {Boolean} needGenerate
 * @memberof EZ3.PlaneGeometry
 */
Object.defineProperty(EZ3.PlaneGeometry.prototype, 'needGenerate', {
  get: function() {
    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});
