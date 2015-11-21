/**
 * @class TargetControl
 * @extends Control
 */

EZ3.TargetControl = function(entity, target, up) {
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

EZ3.TargetControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.TargetControl.prototype.constructor = EZ3.TargetControl;

EZ3.TargetControl.prototype._setupRotationAngles = function() {
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

EZ3.TargetControl.prototype.update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);
  var vector = new EZ3.Vector4(0, 0, -1, 0).mulMat4(matrix).toVec3();

  this.distance = new EZ3.Vector3().sub(this.entity.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scale(this.distance);

  this.entity.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.entity.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat4(matrix).toVec3();
  this.right = new EZ3.Vector3().cross(this.look.normalize(), this.up);

  this.entity.lookAt(this.target, this.up);
};

EZ3.TargetControl.prototype.rotate = function(dx, dy) {
  this._rotationAngles.x -= dx * this.rotationSpeed;
  this._rotationAngles.y += dy * this.rotationSpeed;
};

EZ3.TargetControl.prototype.pan = function(dx, dy) {
  var rx;
  var ry;
  var up;
  var right;
  var vector;

  rx = dx * this.moveSpeed;
  ry = -dy * this.moveSpeed;

  right = new EZ3.Vector3().copy(this.right).scale(rx);
  up = new EZ3.Vector3().copy(this.up).scale(ry);
  vector = new EZ3.Vector3().add(right, up);

  this.entity.position.add(vector);
  this.target.add(vector);
};

EZ3.TargetControl.prototype.zoom = function(speed) {
  var look = this.look.clone().scale(speed);
  this.entity.position.add(look);
};
