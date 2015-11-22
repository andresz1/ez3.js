/**
 * @class OrthographicCamera
 * @extends Camera
 */

EZ3.OrthographicCamera = function(left, right, top, bottom, near, far) {
  EZ3.Camera.call(this);

  this.left = left || -25.0;
  this.right = right || 25.0;
  this.top = top || 25.0;
  this.bottom = bottom || -25.0;
  this.near = near || 0.1;
  this.far = far || 2000.0;
};

EZ3.OrthographicCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.OrthographicCamera.prototype.constructor = EZ3.OrthographicCamera;

EZ3.OrthographicCamera.prototype.updateProjection = function() {
  var build = false;
  var dx;
	var dy;
	var cx;
	var cy;

  if(this._cache.left !== this.left) {
    this._cache.left = this.left;
    build = true;
  }

  if(this._cache.right !== this.right) {
    this._cache.right = this.right;
    build = true;
  }

  if(this._cache.top !== this.top) {
    this._cache.top = this.top;
    build = true;
  }

  if(this._cache.bottom !== this.bottom) {
    this._cache.bottom = this.bottom;
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

  if(build) {
    dx = (this.right - this.left) / 2;
    dy = (this.top - this.bottom) / 2;
    cx = (this.right + this.left) / 2;
    cy = (this.top + this.bottom) / 2;

    this.projection.orthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);
  }
};
