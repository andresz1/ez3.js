/**
 * @class CameraControl
 * @extends Control
 */

EZ3.CameraControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  this.rigth = new EZ3.Vector3();
  this.roll = 0;
  this.minPitch = -Infinity;
  this.maxPitch = Infinity;
  this.minYaw = -Infinity;
  this.maxYaw = Infinity;

  this.lookAt(target, up);
};

EZ3.CameraControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.CameraControl.prototype.constructor = EZ3.CameraControl;

EZ3.CameraControl.prototype.lookAt = function(target, up) {
  var xy;

  this.target = target || new EZ3.Vector3();
  this.up = up || new EZ3.Vector3(0, 1, 0);
  this.look = new EZ3.Vector3().sub(this.entity.position, this.target);

  xy = Math.sqrt(this.look.x * this.look.x + this.look.z * this.look.z);

  this.yaw = Math.atan2(-this.look.x, -this.look.z);
  this.pitch = Math.atan2(this.look.y, xy);

  this.entity.lookAt(this.target, this.up);
};

EZ3.CameraControl.prototype.rotate = function(dx, dy, speed) {
  speed = (speed === undefined) ? 1 : speed;

  this.yaw -= dx * speed;
  this.pitch += dy * speed;

  this.yaw = Math.max(this.minYaw, Math.min(this.maxYaw, this.yaw));
  this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
};
