/**
 * @class TargetTexture2D
 * @extends Texture2D
 */

 EZ3.TargetTexture2D = function(resolution, format) {
   EZ3.Texture2D.call(this, new EZ3.Image(resolution.x, resolution.y, format, null), false);
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 EZ3.TargetTexture2D.prototype.attachToFramebuffer = function(gl, attachment) {
   if(this._cache.framebufferAttachment !== attachment) {
     this._cache.framebufferAttachment = attachment;
     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl[attachment], gl.TEXTURE_2D, this._id, 0);
   }
 };
