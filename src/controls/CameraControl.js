/**
 * @class EZ3.CameraControl
 * @extends EZ3.Control
 * @constructor
 * @param {EZ3.Entity} entity
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.CameraControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  /**
   * @property {EZ3.Vector3} target
   */

  /**
   * @property {EZ3.Vector3} up
   */

  /**
   * @property {EZ3.Vector3} look
   */

  /**
   * @property {EZ3.Vector3} rigth
   */
  this.right = new EZ3.Vector3();

  /**
   * @property {Number} roll
   * @default 0
   */
  this.roll = 0;

  /**
   * @property {Number} minPitch
   * @default -EZ3.Math.HALF_PI
   */
  this.minPitch = -EZ3.Math.HALF_PI;

  /**
   * @property {Number} maxPitch
   * @default EZ3.Math.HALF_PI
   */
  this.maxPitch = EZ3.Math.HALF_PI;

  /**
   * @property {Number} minYaw
   * @default -Infinity
   */
  this.minYaw = -Infinity;

  /**
   * @property {Number} maxYaw
   */
  this.maxYaw = Infinity;

  this.lookAt(target, up);
};

EZ3.CameraControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.CameraControl.prototype.constructor = EZ3.CameraControl;

/**
 * @method EZ3.CameraControl#lookAt
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.CameraControl.prototype.lookAt = function(target, up) {
  var xy;

  this.target = target || new EZ3.Vector3();
  this.up = up || new EZ3.Vector3(0, 1, 0);
  this.look = new EZ3.Vector3().sub(this.target, this.entity.position).normalize();
  this.right = new EZ3.Vector3().cross(this.look, this.up);

  xy = Math.sqrt(this.look.x * this.look.x + this.look.z * this.look.z);

  this.yaw = Math.atan2(this.look.x, this.look.z);
  this.pitch = Math.atan2(-this.look.y, xy);

  this.entity.lookAt(this.target, this.up);
};

/**
 * @method EZ3.CameraControl#rotate
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.CameraControl.prototype.rotate = function(dx, dy, speed) {
  speed = (speed !== undefined) ? speed : 1;

  this.yaw -= dx * speed;
  this.pitch += dy * speed;

  this.yaw = Math.max(this.minYaw, Math.min(this.maxYaw, this.yaw));
  this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
};
