/**
 * @class PerspectiveCamera
 * @extends Camera
 */

EZ3.PerspectiveCamera = function(fov, aspect, near, far) {
  EZ3.Camera.call(this);

  this.fov = fov || 70;
  this.aspect = aspect || 1;
  this.near = near || 0.1;
  this.far = far || 2000;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

EZ3.PerspectiveCamera.prototype.updateProjection = function() {
  this.projection.perspective(this.fov, this.aspect, this.near, this.far);
};
