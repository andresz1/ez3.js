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
};

EZ3.Camera.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Camera.prototype.constructor = EZ3.Camera;

/**
 * @method EZ3.Camera#updateView
 */
EZ3.Camera.prototype.updateView = function() {
  if(this.world.isDiff(this._cache.world)) {
    this._cache.world = this.world.clone();
    this.view.inverse(this.world);
  }
};
