/**
 * @class Screen
 */

EZ3.Screen = function(id, position, size) {
  this.id = id;
  this.position = position;
  this.size = size;
  this.load = new EZ3.LoadManager();
  this.scene = new EZ3.Scene();
  this.camera = null;
};

EZ3.Screen.prototype.onKeyPress = function() {};

EZ3.Screen.prototype.onKeyDown = function() {};

EZ3.Screen.prototype.onKeyUp = function() {};

EZ3.Screen.prototype.onMousePress = function() {};

EZ3.Screen.prototype.onMouseMove = function() {};

EZ3.Screen.prototype.onMouseUp = function() {};

EZ3.Screen.prototype.onTouchPress = function() {};

EZ3.Screen.prototype.onTouchMove = function() {};

EZ3.Screen.prototype.onTouchUp = function() {};

EZ3.Screen.prototype.create = function() {};

EZ3.Screen.prototype.update = function() {};
