/**
 * @class TargetControl
 * @extends Control
 */

EZ3.TargetControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  this.moveSpeed = 50.0;
  this.rotationSpeed = 150.0;

  this.right = new EZ3.Vector3();
  this.up = up || new EZ3.Vector3();
  this.target = target || new EZ3.Vector3();
  this.look = new EZ3.Vector3().sub(this.entity.position, this.target);

  this._setPointOfView(this.look);
};

EZ3.TargetControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.TargetControl.prototype.constructor = EZ3.TargetControl;

EZ3.TargetControl.prototype.update = function() {
  var matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);
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
  this.yaw -= dx * this.rotationSpeed;
  this.pitch += dy * this.rotationSpeed;
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
