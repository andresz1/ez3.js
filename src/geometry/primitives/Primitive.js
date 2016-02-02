/**
 * @class EZ3.Primitive
 * @extends EZ3.Geometry
 * @constructor
 */
EZ3.Primitive = function() {
  EZ3.Geometry.call(this);

  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};
};

EZ3.Primitive.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Primitive.prototype.constructor = EZ3.Primitive;

/**
 * @method EZ3.Primitive#updateCommonData
 */
EZ3.Primitive.prototype.updateCommonData = function() {
  if (this.needGenerate) {
    this.generate();
    this.linearDataNeedUpdate = true;
    this.normalDataNeedUpdate = false;
  }
};
