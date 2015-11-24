/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthFramebuffer = function(size) {
  EZ3.Framebuffer.call(
    this,
    size,
    new EZ3.DepthRenderbuffer(size, 'DEPTH_COMPONENT16'),
    new EZ3.TargetTexture2D(size, 'RGBA')
  );
};

EZ3.DepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.DepthFramebuffer.prototype.constructor = EZ3.DepthFramebuffer;

EZ3.DepthFramebuffer.prototype.update = function(gl) {
  EZ3.Framebuffer.prototype.update.call(this, gl, 'COLOR_ATTACHMENT0', 'DEPTH_ATTACHMENT');
};
