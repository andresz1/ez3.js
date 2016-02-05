/**
 * @class EZ3.PerspectiveCamera
 * @extends EZ3.Camera
 * @constructor
 * @param {Number} [fov]
 * @param {Number} [aspect]
 * @param {Number} [near]
 * @param {Number} [far]
 */
EZ3.PerspectiveCamera = function(fov, aspect, near, far) {
  EZ3.Camera.call(this);

  /**
   * @property {Number} fov
   * @default 70
   */
  this.fov = (fov !== undefined) ? fov : 70;

  /**
   * @property {Number} aspect
   * @default 1
   */
  this.aspect = (aspect !== undefined) ? aspect : 1;

  /**
   * @property {Number} near
   * @default 0.1
   */
  this.near = (near !== undefined) ? near : 0.1;

  /**
   * @property {Number} far
   * @default 2000
   */
  this.far = (far !== undefined) ? far : 2000;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

/**
 * @method EZ3.PerspectiveCamera#_updateProjection
 * @return {Boolean}
 */
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

  return changed;
};
