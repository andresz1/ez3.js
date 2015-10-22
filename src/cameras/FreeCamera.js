/**
 * @class FreeCamera
 * @extends Camera
 */

EZ3.FreeCamera = function(position, target, up) {
  EZ3.Camera.call(this);

  this._angle = new EZ3.Vector2();

  if(position instanceof EZ3.Vector3)
    this.position.copy(position);

  if(target instanceof EZ3.Vector3)
    this._target.copy(target);

  if(up instanceof EZ3.Vector3)
    this._up.copy(up);

  this.fov = 70.0;
  this.near = 0.1;
  this.far = 1000.0;
  this.aspectRatio = 1.0;
};

EZ3.FreeCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.FreeCamera.prototype.constructor = EZ3.FreeCamera;

EZ3.FreeCamera.prototype._rotateView = function(axis, angle) {
  var quat = new EZ3.Quaternion().fromAxisAngle(axis, angle);
  var mat = quat.toMatrix3(EZ3.Quaternion.NORMAL);
  var newView;

  this._view = new EZ3.Vector3().sub(this._target, this.position);
  newView = new EZ3.Vector3().mulMat(mat, this._view);

  this._target = new EZ3.Vector3().add(this.position, newView);
};

EZ3.FreeCamera.prototype.walk = function(speed) {
  var view = new EZ3.Vector3().sub(this._target, this.position).normalize();

  this._target.x += view.x * speed;
  this._target.y += view.z * speed;
  this._target.z += view.z * speed;

  this.position.x += view.x * speed;
  this.position.y += view.x * speed;
  this.position.z += view.z * speed;
};

EZ3.FreeCamera.prototype.strafe = function(speed) {
  this._target.x += this._right.x * speed;
  this._target.z += this._right.z * speed;

  this.position.x += this._right.x * speed;
  this.position.z += this._right.z * speed;
};

EZ3.FreeCamera.prototype.onMouseMove = function(posNew, posOld) {
  this._angle.x += (posNew.x - posOld.x) * 0.02;
  this._angle.y += (posNew.y - posOld.y) * 0.02;

  this._view = new EZ3.Vector3().sub(this._target, this.position).normalize();
  this._right = new EZ3.Vector3().cross(this._view, this._up).normalize();

  this._rotateView(this._right, EZ3.Math.toRadians(this._angle.y));
  this._rotateView(new EZ3.Vector3(0, 1, 0), EZ3.Math.toRadians(this._angle.x));
};

Object.defineProperty(EZ3.FreeCamera.prototype, 'projection', {
  get: function() {
    var fov = this.fov;
    var aspect = this.aspectRatio;
    var near = this.near;
    var far = this.far;

    return new EZ3.Matrix4().perspective(fov, aspect, near, far);
  }
});
