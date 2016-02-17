/**
 * @class EZ3.EllipsoidGeometry
 * @extends EZ3.PrimitiveGeometry
 * @constructor
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Vector3} [radiouses]
 */
EZ3.EllipsoidGeometry = function(resolution, radiouses) {
  EZ3.PrimitiveGeometry.call(this);

  /**
   * @property {EZ3.Vector2} resolution
   * @default new EZ3.Vector3(40, 40)
   */
  this.resolution = resolution || new EZ3.Vector2(40, 40);
  /**
   * @property {EZ3.Vector3} radiouses
   * @default new EZ3.Vector3(10, 5, 10)
   */
  this.radiouses = radiouses || new EZ3.Vector3(10, 5, 10);

  this.updateData();
};

EZ3.EllipsoidGeometry.prototype = Object.create(EZ3.PrimitiveGeometry.prototype);
EZ3.EllipsoidGeometry.prototype.constructor = EZ3.EllipsoidGeometry;

/**
 * @method EZ3.EllipsoidGeometry#_computeData
 * @private
 */
EZ3.EllipsoidGeometry.prototype._computeData = function() {
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

      vertex.x = this.radiouses.x * Math.cos(phi) * sinr;
      vertex.y = this.radiouses.y * Math.sin(rho - EZ3.Math.HALF_PI);
      vertex.z = this.radiouses.z * Math.sin(phi) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.x /= this.radiouses.x;
      vertex.y /= this.radiouses.y;
      vertex.z /= this.radiouses.z;

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

  this.buffers.setTriangles(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.setPositions(vertices);
  this.buffers.setNormals(normals);
  this.buffers.setUVs(uvs);
};

/**
 * @property {Boolean} _dataNeedUpdate
 * @memberof EZ3.EllipsoidGeometry
 * @private
 */
Object.defineProperty(EZ3.EllipsoidGeometry.prototype, '_dataNeedUpdate', {
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
