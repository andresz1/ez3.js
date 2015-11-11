/**
 * @class CubeDepthFramebuffer
 * @extends Framebuffer
 */

EZ3.CubeDepthFramebuffer = function(resolution) {
  EZ3.Framebuffer.call(this, resolution, new EZ3.TargetCubemap(resolution, 'DEPTH_COMPONENT'));
};

EZ3.CubeDepthFramebuffer.prototype.constructor = EZ3.CubeDepthFramebuffer;

EZ3.CubeDepthFramebuffer.prototype.update = function(gl) {
  EZ3.Framebuffer.prototype.update.call(gl, 'DEPTH_ATTACHMENT');
};
