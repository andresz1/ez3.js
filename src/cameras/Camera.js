/**
 * @class EZ3.Camera
 * @extends EZ3.Entity
 * @constructor
 */
EZ3.Camera = function() {
  EZ3.Entity.call(this);

  /**
   * @property {EZ3.Matrix4} view
   */
  this.view = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4} projection
   */
  this.projection = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4} viewProjection
   */
  this.viewProjection = new EZ3.Matrix4();

  /**
   * @property {EZ3.Frustum} Frustum
   */
  this.frustum = new EZ3.Frustum();
};

EZ3.Camera.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Camera.prototype.constructor = EZ3.Camera;

/**
 * @method EZ3.Camera#_updateView
 * @protected
 * @return {Boolean}
 */
EZ3.Camera.prototype._updateView = function() {
  if (this.world.isDiff(this._cache.world)) {
    this._cache.world = this.world.clone();
    this.view.inverse(this.world);

    return true;
  }

  return false;
};

/**
 * @method EZ3.Camera#computeFrustum
 */
EZ3.Camera.prototype.computeFrustum = function() {
  this.viewProjection.mul(this.projection, this.view);
  this.frustum.setFromMatrix4(this.viewProjection);
};

/**
 * @method EZ3.Camera#updateFrustum
 */
EZ3.Camera.prototype.updateFrustum = function() {
  if (this._updateView() || this.updateProjection())
    this.computeFrustum();
};
