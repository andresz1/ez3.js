/**
 * @class DepthRenderbuffer
 * @extends Renderbuffer
 */

 EZ3.DepthRenderbuffer = function(size, storage) {
   EZ3.Renderbuffer.call(this, size, storage);
 };

 EZ3.DepthRenderbuffer.prototype = Object.create(EZ3.Renderbuffer.prototype);
 EZ3.DepthRenderbuffer.prototype.constructor = EZ3.DepthRenderbuffer;

 EZ3.DepthRenderbuffer.prototype.update = function(gl) {
   EZ3.Renderbuffer.prototype.update.call(this, gl);
 };

 EZ3.DepthRenderbuffer.prototype.attachToFramebuffer = function(gl, attachment) {
   EZ3.Renderbuffer.prototype.attachToFramebuffer.call(this, gl, attachment);
 };
