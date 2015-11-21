/**
 * @class FreeControl
 * @extends Control
 */

EZ3.FreeControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  this._rotationAngles = new EZ3.Vector2();

  this.target = target || new EZ3.Vector3();
  this.up = up || new EZ3.Vector3(0, 1, 0);
  this.look = new EZ3.Vector3(0, 0, -1);
  this.right = new EZ3.Vector3(1, 0, 0);
  this.moveSpeed = 50.0;
  this.rotationSpeed = 300.0;

  this._setupRotationAngles();
};

EZ3.FreeControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.FreeControl.prototype.constructor = EZ3.FreeControl;

EZ3.FreeControl.prototype._setupRotationAngles = function() {
  var yaw;
  var pitch;

  this.look = new EZ3.Vector3().sub(this.entity.position, this.target);

  if(!this.look.testZero())
    this.look.normalize();

  yaw = EZ3.Math.toDegrees(Math.atan2(this.look.z, this.look.x) + EZ3.Math.PI);
  pitch = EZ3.Math.toDegrees(Math.asin(this.look.y));

  this._rotationAngles.x = yaw;
  this._rotationAngles.y = pitch;
};

EZ3.FreeControl.prototype.update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);

  this.up = new EZ3.Vector4(0.0, 1.0, 0.0, 0.0).mulMat4(matrix).toVec3();
  this.look = new EZ3.Vector4(0.0, 0.0, 1.0, 0.0).mulMat4(matrix).toVec3();
  this.right = new EZ3.Vector4(1.0, 0.0, 0.0, 0.0).mulMat4(matrix).toVec3();

  this.target = new EZ3.Vector3().add(this.entity.position, this.look);

  //console.log(this.entity.position.toString());

  this.entity.lookAt(this.target, this.up);
};

EZ3.FreeControl.prototype.rotate = function(dx, dy) {
  this._rotationAngles.x -= dx * this.rotationSpeed;
  this._rotationAngles.y += dy * this.rotationSpeed;
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
