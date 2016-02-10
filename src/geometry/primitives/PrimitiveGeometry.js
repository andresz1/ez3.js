/**
 * @class EZ3.PrimitiveGeometry
 * @extends EZ3.Geometry
 * @constructor
 */
EZ3.PrimitiveGeometry = function() {
  EZ3.Geometry.call(this);

  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};
};

EZ3.PrimitiveGeometry.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.PrimitiveGeometry.prototype.constructor = EZ3.PrimitiveGeometry;

/**
 * @method EZ3.PrimitiveGeometry#updateData
 */
EZ3.PrimitiveGeometry.prototype.updateData = function() {
  if (this._dataNeedUpdate)
    this._computeData();
};
