/**
 * @class TargetTexture2D
 * @extends Texture2D
 */

 EZ3.TargetTexture2D = function(size, format, attachment) {
   EZ3.Texture2D.call(this, new EZ3.Image(size.x, size.y, format, null), false);

   this.attachment = attachment;
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 EZ3.TargetTexture2D.prototype.attach = function(gl) {
   if(this._cache.attachment !== this.attachment) {
     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl[this.attachment], gl.TEXTURE_2D, this._id, 0);
     this._cache.attachment = this.attachment.slice();
   }
 };
