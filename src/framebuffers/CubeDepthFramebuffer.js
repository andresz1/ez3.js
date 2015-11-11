/**
 * @class CubeDepthFramebuffer
 * @extends Framebuffer
 */

EZ3.CubeDepthFramebuffer = function(resolution) {
  EZ3.Framebuffer.call(this, new EZ3.TargetCubemap(resolution, 'DEPTH_COMPONENT'));
};

EZ3.CubeDepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.CubeDepthFramebuffer.prototype.constructor = EZ3.CubeDepthFramebuffer;

EZ3.CubeDepthFramebuffer.prototype.update = function(gl) {
  // TODO
};
