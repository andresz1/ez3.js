/**
 * @class EZ3.FreeControl
 * @extends EZ3.CameraControl
 * @constructor
 * @param {EZ3.Entity} entity
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.FreeControl = function(entity, target, up) {
  EZ3.CameraControl.call(this, entity, target, up);
};

EZ3.FreeControl.prototype = Object.create(EZ3.CameraControl.prototype);
EZ3.FreeControl.prototype.constructor = EZ3.FreeControl;

/**
 * @method EZ3.FreeControl#rotate
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.FreeControl.prototype.rotate = function(dx, dy, speed) {
  var matrix;

  EZ3.CameraControl.prototype.rotate.call(this, dx, dy, speed);

  matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);

  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMatrix4(matrix).toVector3();
  this.look = new EZ3.Vector4(0, 0, 1, 0).mulMatrix4(matrix).toVector3();
  this.right = new EZ3.Vector4(-1, 0, 0, 0).mulMatrix4(matrix).toVector3();

  this.target = new EZ3.Vector3().add(this.entity.position, this.look);

  this.entity.lookAt(this.target, this.up);
};

/**
 * @method EZ3.FreeControl#lift
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.lift = function(speed) {
  var lift = this.up.clone().scale(speed);
  this.entity.position.add(lift);
};

/**
 * @method EZ3.FreeControl#walk
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.walk = function(speed) {
  var walk = this.look.clone().scale(speed);
  this.entity.position.add(walk);
};

/**
 * @method EZ3.FreeControl#strafe
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.strafe = function(speed) {
  var strafe = this.right.clone().scale(speed);
  this.entity.position.add(strafe);
};
