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
  var matrix = new EZ3.Matrix4().yawPitchRoll(-rx, -ry, 0);
  var dVector = new EZ3.Vector4(0, 0, this.distance, 0).mulMat(matrix).toVec3();

  this.position = new EZ3.Vector3().add(this.target, dVector);
  this.look = new EZ3.Vector3().sub(this.target, this.position).normalize();
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat(matrix).toVec3();
  this.right = new EZ3.Vector3().cross(this.look, this.up);
};

EZ3.TargetCamera.prototype.pan = function(dx, dy) {
  var up;
  var right;
  var sumVector;

  this._rotationAngles.x += dx * EZ3.Camera.MOVE_SPEED;
  this._rotationAngles.y += dy * EZ3.Camera.MOVE_SPEED;

  right = new EZ3.Vector3().copy(this.right).scaleEqual(this._rotationAngles.x);
  up = new EZ3.Vector3().copy(this.up).scaleEqual(this._rotationAngles.y);
  sumVector = new EZ3.Vector3().add(right, up);

  this.position.addEqual(sumVector);
  this.target.addEqual(sumVector);
};

EZ3.TargetCamera.prototype.zoom = function(speed) {
  this.position.addEqual(new EZ3.Vector3().copy(this.look).scaleEqual(speed));
  this.distance = new EZ3.Vector3().sub(this.position, this.target).length();
  this.distance = Math.max(1, this.distance);
};
