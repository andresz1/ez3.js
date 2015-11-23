/**
 * @class PerspectiveCamera
 * @extends Camera
 */

EZ3.PerspectiveCamera = function(fov, aspect, near, far) {
  EZ3.Camera.call(this);

  this.fov = fov || 70.0;
  this.aspect = aspect || 1.0;
  this.near = near || 0.1;
  this.far = far || 2000.0;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

EZ3.PerspectiveCamera.prototype.updateProjection = function() {
  var build = false;

  if(this._cache.fov !== this.fov) {
    this._cache.fov = this.fov;
    build = true;
  }

  if(this._cache.aspect !== this.aspect) {
    this._cache.aspect = this.aspect;
    build = true;
  }

  if(this._cache.near !== this.near) {
    this._cache.near = this.near;
    build = true;
  }

  if(this._cache.far !== this.far) {
    this._cache.far = this.far;
    build = true;
  }

  if(build)
    this.projection.perspective(this.fov, this.aspect, this.near, this.far);
};
