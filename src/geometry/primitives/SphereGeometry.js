/**
 * @class EZ3.SphereGeometry
 * @extends EZ3.PrimitiveGeometry
 * @constructor
 * @param {EZ3.Vector2} [resolution]
 * @param {Number} [radius]
 */
EZ3.SphereGeometry = function(resolution, radius) {
  EZ3.PrimitiveGeometry.call(this);

  /**
   * @property {EZ3.Vector2} resolution
   * @default new EZ3.Vector2(6, 6)
   */
  this.resolution = resolution || new EZ3.Vector2(15, 15);
  /**
   * @property {EZ3.Vector2} radius
   * @default 1
   */
  this.radius = (radius !== undefined)? radius : 1;

  this.updateData();
};

EZ3.SphereGeometry.prototype = Object.create(EZ3.PrimitiveGeometry.prototype);
EZ3.SphereGeometry.prototype.constructor = EZ3.SphereGeometry;

/**
 * @method EZ3.SphereGeometry#_computeData
 * @private
 */
EZ3.SphereGeometry.prototype._computeData = function() {
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

  this.buffers.setTriangles(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.setPositions(vertices);
  this.buffers.setNormals(normals);
  this.buffers.setUVs(uvs);
};

/**
 * @property {Boolean} _dataNeedUpdate
 * @memberof EZ3.SphereGeometry
 * @private
 */
Object.defineProperty(EZ3.SphereGeometry.prototype, '_dataNeedUpdate', {
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
