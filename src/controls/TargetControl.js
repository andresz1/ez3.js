/**
 * @class TargetControl
 * @extends CameraControl
 */

EZ3.TargetControl = function(entity, target, up) {
  EZ3.CameraControl.call(this, entity, target, up);
};

EZ3.TargetControl.prototype = Object.create(EZ3.CameraControl.prototype);
EZ3.TargetControl.prototype.constructor = EZ3.TargetControl;

EZ3.TargetControl.prototype.rotate = function(dx, dy, speed) {
  var matrix;
  var vector;

  EZ3.CameraControl.prototype.rotate.call(this, dx, dy, speed);

  matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);
  vector = new EZ3.Vector4(0, 0, -1, 0).mulMat4(matrix).toVector3();

  this.distance = new EZ3.Vector3().sub(this.entity.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scale(this.distance);

  this.entity.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.entity.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat4(matrix).toVector3();
  this.right = new EZ3.Vector3().cross(this.look.normalize(), this.up);

  this.entity.lookAt(this.target, this.up);
};

EZ3.TargetControl.prototype.pan = function(dx, dy, speed) {
  var rx;
  var ry;
  var up;
  var right;
  var vector;

  speed = (speed !== undefined) ? speed : 100;

  rx = dx * speed;
  ry = -dy * speed;

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
