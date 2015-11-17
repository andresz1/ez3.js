/**
 * @class DepthRenderbuffer
 * @extends Renderbuffer
 */

 EZ3.DepthRenderbuffer = function(size) {
   EZ3.Renderbuffer.call(this, size);
 };

 EZ3.DepthRenderbuffer.prototype = Object.create(EZ3.Renderbuffer.prototype);
 EZ3.DepthRenderbuffer.prototype.constructor = EZ3.DepthRenderbuffer;

 EZ3.DepthRenderbuffer.prototype.update = function(gl) {
   EZ3.Renderbuffer.prototype.update.call(this, gl, 'DEPTH_COMPONENT16');
 };

 EZ3.DepthRenderbuffer.prototype.attachToFramebuffer = function(gl) {
   EZ3.Renderbuffer.prototype.attachToFramebuffer.call(this, gl, 'DEPTH_ATTACHMENT');
 };
