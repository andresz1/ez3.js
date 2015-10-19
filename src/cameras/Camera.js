/**
 * @class Camera
 */

EZ3.Camera = function () {
  var up = new EZ3.Vector3(0, 1, 0);
  var target = new EZ3.Vector3(0, 0, 0);
  var position = new EZ3.Vector3(45, 45, 45);

  this.view = new EZ3.Matrix4().lookAt(position, target, up);
	this.projection = new EZ3.Matrix4().perspective(70, 800 / 600, 1, 1000);
};

EZ3.Camera.prototype.constructor = EZ3.Camera;
