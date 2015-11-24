/**
 * @class TargetTexture2D
 * @extends Texture2D
 */

 EZ3.TargetTexture2D = function(size, format) {
   EZ3.Texture2D.call(this, new EZ3.Image(size.x, size.y, format, null));
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 EZ3.TargetTexture2D.prototype.attachToFramebuffer = function(gl, attachment) {
   if(this._cache.attachment!== attachment) {
     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl[attachment], gl.TEXTURE_2D, this._id, 0);
     this._cache.attachment = attachment;
   }
 };
