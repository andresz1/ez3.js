/**
 * @class Camera
 */

EZ3.Camera = function() {
  EZ3.Entity.call(this);

  this._up = new EZ3.Vector3();
  this._view = new EZ3.Vector3();
  this._right = new EZ3.Vector3();
  this._target = new EZ3.Vector3();
};

EZ3.Camera.prototype.constructor = EZ3.Camera;

Object.defineProperty(EZ3.Camera.prototype, 'view', {
  get: function() {
    return new EZ3.Matrix4().lookAt(this.position, this._target, this._up);
  }
});
