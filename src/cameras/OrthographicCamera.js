/**
 * @class OrthographicCamera
 * @extends Camera
 */

EZ3.OrthographicCamera = function(left, right, top, bottom, near, far) {
  EZ3.Camera.call(this);

  this.left = left;
  this.right = right;
  this.top = top;
  this.bottom = bottom;
  this.near = near || 0.1;
  this.far = far || 2000;
};

EZ3.OrthographicCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.OrthographicCamera.prototype.constructor = EZ3.OrthographicCamera;

EZ3.OrthographicCamera.prototype.updateProjection = function() {
  var dx = (this.right - this.left) / 2;
	var dy = (this.top - this.bottom) / 2;
	var cx = (this.right + this.left) / 2;
	var cy = (this.top + this.bottom) / 2;

	this.projection.orthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);
};
