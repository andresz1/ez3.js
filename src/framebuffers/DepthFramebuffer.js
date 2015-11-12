/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

 EZ3.DepthFramebuffer = function(resolution) {
   EZ3.Framebuffer.call(this, resolution, new EZ3.TargetTexture2D(resolution, 'DEPTH_COMPONENT'));
 };

 EZ3.DepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
 EZ3.DepthFramebuffer.prototype.constructor = EZ3.DepthFramebuffer;

 EZ3.DepthFramebuffer.prototype.update = function(gl) {
   EZ3.Framebuffer.prototype.update.call(gl, 'DEPTH_ATTACHMENT');
 };
