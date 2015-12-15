/**
 * @class Screen
 */

EZ3.Screen = function(position, size) {
  this.position = position;
  this.size = size;
  this.load = new EZ3.RequestManager();
  this.scene = new EZ3.Scene();
  this.camera = null;
};
