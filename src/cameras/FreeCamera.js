/**
 * @class FreeCamera
 * @extends Camera
 */

EZ3.FreeCamera = function(position, target, up, mode, filter) {
  EZ3.Camera.call(this, position, target, up, mode, filter);
};

EZ3.FreeCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.FreeCamera.prototype.constructor = EZ3.FreeCamera;

EZ3.FreeCamera.prototype.update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);

  this.up = new EZ3.Vector4(0.0, 1.0, 0.0, 0.0).mulMat4(matrix).toVec3();
  this.look = new EZ3.Vector4(0.0, 0.0, 1.0, 0.0).mulMat4(matrix).toVec3();
  this.right = new EZ3.Vector4(1.0, 0.0, 0.0, 0.0).mulMat4(matrix).toVec3();

  this.target = new EZ3.Vector3().add(this.position, this.look);
};

EZ3.FreeCamera.prototype.lift = function(speed) {
  var lift = this.up.clone().scale(speed);
  this.position.add(lift);
};

EZ3.FreeCamera.prototype.walk = function(speed) {
  var walk = this.look.clone().scale(speed);
  this.position.add(walk);
};

EZ3.FreeCamera.prototype.strafe = function(speed) {
  var strafe = this.right.clone().scale(speed);
  this.position.add(strafe);
};
