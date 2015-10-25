/**
 * @class TargetCamera
 * @extends Camera
 */

EZ3.TargetCamera = function(position, target, up, mode, filter) {
  EZ3.Camera.call(this, position, target, up, mode, filter);

  this.distance = 1;
};

EZ3.TargetCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.TargetCamera.prototype.constructor = EZ3.TargetCamera;

EZ3.TargetCamera.prototype._update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);
  var vector = new EZ3.Vector4(0, 0, -1, 0).mulMat(matrix).toVec3();

  this.distance = new EZ3.Vector3().sub(this.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scaleEqual(this.distance);

  this.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat(matrix).toVec3();
  this.right = new EZ3.Vector3().cross(this.look.normalize(), this.up);
};

EZ3.TargetCamera.prototype.pan = function(dx, dy) {
  var rx;
  var ry;
  var up;
  var right;
  var vector;

  rx = dx * EZ3.Camera.MOVE_SPEED;
  ry = -dy * EZ3.Camera.MOVE_SPEED;

  right = new EZ3.Vector3().copy(this.right).scaleEqual(rx);
  up = new EZ3.Vector3().copy(this.up).scaleEqual(ry);
  vector = new EZ3.Vector3().add(right, up);

  this.position.addEqual(vector);
  this.target.addEqual(vector);
};

EZ3.TargetCamera.prototype.zoom = function(speed) {
  var look = new EZ3.Vector3().copy(this.look).scaleEqual(speed);
  this.position.addEqual(look);
};
