/**
 * @class EZ3.AstroidalEllipsoidGeometry
 * @extends EZ3.PrimitiveGeometry
 * @constructor
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Vector3} [radiouses]
 */
EZ3.AstroidalEllipsoidGeometry = function(resolution, radiouses) {
  EZ3.PrimitiveGeometry.call(this);

  /**
   * @property {EZ3.Vector2} resolution
   * @default new EZ3.Vector2(50, 50)
   */
  this.resolution = resolution || new EZ3.Vector2(5, 5);
  /**
   * @property {EZ3.Vector3} radiouses
   * @default new EZ3.Vector3(6, 6, 6)
   */
  this.radiouses = radiouses || new EZ3.Vector3(6, 6, 6);
};

EZ3.AstroidalEllipsoidGeometry.prototype = Object.create(EZ3.PrimitiveGeometry.prototype);
EZ3.AstroidalEllipsoidGeometry.prototype.constructor = EZ3.AstroidalEllipsoidGeometry;

/**
 * @method EZ3.AstroidalEllipsoidGeometry#_computeData
 * @private
 */
EZ3.AstroidalEllipsoidGeometry.prototype._computeData = function() {
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

      if (!vertex.isZeroVector())
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
 * @memberof EZ3.AstroidalEllipsoidGeometry
 * @private
 */
Object.defineProperty(EZ3.AstroidalEllipsoidGeometry.prototype, '_dataNeedUpdate', {
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
