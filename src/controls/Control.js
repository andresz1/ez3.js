/**
 * @class Control
 */

EZ3.Control = function(entity) {
  this.entity = entity;
};

EZ3.Control.prototype.constructor = EZ3.Control;

EZ3.Control.prototype._setPointOfView = function(look) {

  if(!look.testZero())
    this.look.normalize();

  this.yaw = EZ3.Math.toDegrees(Math.atan2(this.look.z, this.look.x) + EZ3.Math.PI);
  this.pitch = EZ3.Math.toDegrees(Math.asin(this.look.y));
  this.roll = 0.0;
};
