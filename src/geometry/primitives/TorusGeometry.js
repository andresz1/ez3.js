/**
 * @class EZ3.TorusGeometry
 * @extends EZ3.PrimitiveGeometry
 * @constructor
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Vector2} [radiouses]
 */
EZ3.TorusGeometry = function(resolution, radiouses) {
  EZ3.PrimitiveGeometry.call(this);

  /**
   * @property {EZ3.Vector2} resolution
   * @default new EZ3.Vector2(5, 5)
   */
  this.resolution = resolution || new EZ3.Vector2(5, 5);
  /**
   * @property {EZ3.Vector2} radiouses
   * @default new EZ3.Vector2(7, 3)
   */
  this.radiouses = radiouses || new EZ3.Vector2(7, 3);

  this.updateData();
};

EZ3.TorusGeometry.prototype = Object.create(EZ3.PrimitiveGeometry.prototype);
EZ3.TorusGeometry.prototype.constructor = EZ3.TorusGeometry;

/**
 * @method EZ3.TorusGeometry#_computeData
 * @private
 */
EZ3.TorusGeometry.prototype._computeData = function() {
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

      center.x = this.radiouses.x * cosr;
      center.z = this.radiouses.x * sinr;

      vertex.x = (this.radiouses.x + this.radiouses.y * cosp) * cosr;
      vertex.y = (this.radiouses.y * Math.sin(phi));
      vertex.z = (this.radiouses.x + this.radiouses.y * cosp) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.sub(center).normalize();

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

  this.buffers.setTriangles(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.setPositions(vertices);
  this.buffers.setNormals(normals);
  this.buffers.setUVs(uvs);
};

/**
 * @property {Boolean} _dataNeedUpdate
 * @memberof EZ3.TorusGeometry
 * @private
 */
Object.defineProperty(EZ3.TorusGeometry.prototype, '_dataNeedUpdate', {
  get: function() {
    var changed = false;

    if (!this.radiouses.isEqual(this._cache.radiouses)) {
      this._cache.radiouses = this.radiouses.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});
