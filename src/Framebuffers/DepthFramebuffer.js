/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthFramebuffer = function(resolution) {
  EZ3.Framebuffer.call(this, resolution);
};

EZ3.DepthFramebuffer.bind = function(gl) {
  if(!this._id) {

  }

  if(!this.texture) {

  }
};

EZ3.DepthFramebuffer.unbind = function(gl) {

};
