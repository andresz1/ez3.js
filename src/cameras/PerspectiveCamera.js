/**
 * @class PerspectiveCamera
 * @extends Camera
 */

EZ3.PerspectiveCamera = function(fov, aspectRatio, near, far) {
  EZ3.Camera.call(this);

  this.fov = fov || 70.0;
  this.near = near || 0.1;
  this.far = far || 1000.0;
  this.aspectRatio = aspectRatio || 1.0;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

EZ3.PerspectiveCamera.prototype._rotateView = function(axis, angle) {
  var quat = new EZ3.Quaternion().fromAxisAngle(axis, angle);
  var mat = quat.toMatrix3(EZ3.Quaternion.NORMAL);
  var newView;

  this._view = new EZ3.Vector3().sub(this._target, this.position);
  newView = new EZ3.Vector3().mulMat(mat, this._view);

  this._target = new EZ3.Vector3().add(this.position, newView);
};

EZ3.PerspectiveCamera.prototype.walk = function(speed) {
  var view = new EZ3.Vector3().sub(this._target, this.position).normalize();

  this._target.x += view.x * speed;
  this._target.y += view.z * speed;
  this._target.z += view.z * speed;

  this.position.x += view.x * speed;
  this.position.y += view.x * speed;
  this.position.z += view.z * speed;
};

EZ3.PerspectiveCamera.prototype.strafe = function(speed) {
  this._target.x += this._right.x * speed;
  this._target.z += this._right.z * speed;

  this.position.x += this._right.x * speed;
  this.position.z += this._right.z * speed;
};

EZ3.PerspectiveCamera.prototype.onMouseMove = function(posNew, posOld) {
  var angleY = (posNew.x - posOld.x) / 500.0;
  var angleZ = (posNew.y - posOld.y) / 500.0;

  this._view = new EZ3.Vector3().sub(this._target, this.position).normalize();
  this._right = new EZ3.Vector3().cross(this._view, this._up).normalize();

  this._rotateView(this._right, EZ3.Math.toRadians(angleZ));
  this._rotateView(new EZ3.Vector3(0, 1, 0), EZ3.Math.toRadians(angleY));
};

Object.defineProperty(EZ3.PerspectiveCamera.prototype, 'projection', {
  get: function() {
    var fov = this.fov;
    var aspect = this.aspectRatio;
    var near = this.near;
    var far = this.far;

    return new EZ3.Matrix4().perspective(fov, aspect, near, far);
  }
});
