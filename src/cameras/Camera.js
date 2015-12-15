/**
 * @class Camera
 * @extends Entity
 */

EZ3.Camera = function() {
  EZ3.Entity.call(this);

  this.view = new EZ3.Matrix4();
  this.projection = new EZ3.Matrix4();
};

EZ3.Camera.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Camera.prototype.constructor = EZ3.Camera;

EZ3.Camera.prototype.updateView = function() {
  if(this._cache.world.isDiff(this.world)) {
    this._cache.world = this.world.clone();
    this.view.inverse(this.world);
  }
};
