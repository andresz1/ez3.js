/**
 * @class Screen
 */

EZ3.Screen = function(id, position, size) {
  this.id = id;
  this.position = position;
  this.size = size;
  this.requests = new EZ3.RequestManager();
  this.scene = new EZ3.Scene();
  this.camera = null;
};
