/**
 * @class Screen
 */

EZ3.Screen = function(id, position, size) {
  this.id = id;
  this.position = position;
  this.size = size;
  this.scene = new EZ3.Scene();
  this.camera = new EZ3.PerspectiveCamera(70.0, 800/600, 0.1, 1000.0);
  this.camera.setPointOfView(new EZ3.Vector3(45.0, 100.0, 45.0),
  new EZ3.Vector3(0.0, 0.0, 0.0),
  new EZ3.Vector3(0.0, 1.0, 0.0));
};

EZ3.Screen.prototype.onKeyPress = function() {
};

EZ3.Screen.prototype.onKeyDown = function() {
};

EZ3.Screen.prototype.onKeyUp = function() {
};

EZ3.Screen.prototype.onMousePress = function() {
};

EZ3.Screen.prototype.onMouseMove = function() {
};

EZ3.Screen.prototype.onMouseUp = function() {
};

EZ3.Screen.prototype.onTouchPress = function() {
};

EZ3.Screen.prototype.onTouchMove = function() {
};

EZ3.Screen.prototype.onTouchUp = function() {
};

EZ3.Screen.prototype.create = function() {
};

EZ3.Screen.prototype.update = function() {
};
