/**
 * @class EZ3.OrthographicCamera
 * @extends EZ3.Camera
 * @constructor
 * @param {Number} [left]
 * @param {Number} [right]
 * @param {Number} [top]
 * @param {Number} [bottom]
 * @param {Number} [near]
 * @param {Number} [far]
 */

EZ3.OrthographicCamera = function(left, right, top, bottom, near, far) {
  EZ3.Camera.call(this);

  /**
   * @property {Number} left
   * @default -25
   */
  this.left = (left !== undefined) ? left : -25;

  /**
   * @property {Number} right
   * @default 25
   */
  this.right = (right !== undefined) ? right : 25;

  /**
   * @property {Number} top
   * @default 25
   */
  this.top = (top !== undefined) ? top : 25;

  /**
   * @property {Number} bottom
   * @default -25
   */
  this.bottom = (bottom !== undefined) ? bottom : -25;

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

EZ3.OrthographicCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.OrthographicCamera.prototype.constructor = EZ3.OrthographicCamera;

/**
 * @method EZ3.OrthographicCamera#updateProjection
 * @private
 * @return {Boolean}
 */
EZ3.OrthographicCamera.prototype._updateProjection = function() {
  var changed = false;
  var dx;
  var dy;
  var cx;
  var cy;

  if (this._cache.left !== this.left) {
    this._cache.left = this.left;
    changed = true;
  }

  if (this._cache.right !== this.right) {
    this._cache.right = this.right;
    changed = true;
  }

  if (this._cache.top !== this.top) {
    this._cache.top = this.top;
    changed = true;
  }

  if (this._cache.bottom !== this.bottom) {
    this._cache.bottom = this.bottom;
    changed = true;
  }

  if (this._cache.near !== this.near) {
    this._cache.near = this.near;
    changed = true;
  }

  if (this._cache.far !== this.far) {
    this._cache.far = this.far;
    changed = true;
  }

  if (changed) {
    dx = (this.right - this.left) / 2;
    dy = (this.top - this.bottom) / 2;
    cx = (this.right + this.left) / 2;
    cy = (this.top + this.bottom) / 2;

    this.projection.orthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);
  }

  return changed;
};
