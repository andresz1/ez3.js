/**
 * @class PerspectiveCamera
 * @extends Camera
 */

EZ3.PerspectiveCamera = function(fov, aspect, near, far) {
  EZ3.Camera.call(this);

  this.fov = (fov === undefined) ? 70 : fov;
  this.aspect = (aspect === undefined) ? 1 : aspect;
  this.near = (near === undefined) ? 0.1 : near;
  this.far = (far === undefined) ? 2000 : far;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

EZ3.PerspectiveCamera.prototype.updateProjection = function() {
  var changed = false;

  if(this._cache.fov !== this.fov) {
    this._cache.fov = this.fov;
    changed = true;
  }

  if(this._cache.aspect !== this.aspect) {
    this._cache.aspect = this.aspect;
    changed = true;
  }

  if(this._cache.near !== this.near) {
    this._cache.near = this.near;
    changed = true;
  }

  if(this._cache.far !== this.far) {
    this._cache.far = this.far;
    changed = true;
  }

  if(changed)
    this.projection.perspective(this.fov, this.aspect, this.near, this.far);
};
