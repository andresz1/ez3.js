/**
* @class Framebuffer
*/

EZ3.Framebuffer = function(resolution) {
  this._id = null;
  this.texture = null;
  this.resolution = resolution;
  this.dirty = true;
};
