/**
 * @class FreeControl
 * @extends Control
 */

EZ3.FreeControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  this.moveSpeed = 50.0;
  this.rotationSpeed = 150.0;

  this.right = new EZ3.Vector3();
  this.up = up || new EZ3.Vector3();
  this.target = target || new EZ3.Vector3();
  this.look = new EZ3.Vector3().sub(this.entity.position, this.target);

  this._setPointOfView(this.look);
};

EZ3.FreeControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.FreeControl.prototype.constructor = EZ3.FreeControl;

EZ3.FreeControl.prototype.update = function() {
  var matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);

  this.up = new EZ3.Vector4(0.0, 1.0, 0.0, 0.0).mulMat4(matrix).toVec3();
  this.look = new EZ3.Vector4(0.0, 0.0, 1.0, 0.0).mulMat4(matrix).toVec3();
  this.right = new EZ3.Vector4(1.0, 0.0, 0.0, 0.0).mulMat4(matrix).toVec3();

  this.target = new EZ3.Vector3().add(this.entity.position, this.look);

  this.entity.lookAt(this.target, this.up);
};

EZ3.FreeControl.prototype.rotate = function(dx, dy) {
  this.yaw -= dx * this.rotationSpeed;
  this.pitch += dy * this.rotationSpeed;
};

EZ3.FreeControl.prototype.lift = function(speed) {
  var lift = this.up.clone().scale(speed);
  this.entity.position.add(lift);
};

EZ3.FreeControl.prototype.walk = function(speed) {
  var walk = this.look.clone().scale(speed);
  this.entity.position.add(walk);
};

EZ3.FreeControl.prototype.strafe = function(speed) {
  var strafe = this.right.clone().scale(speed);
  this.entity.position.add(strafe);
};
