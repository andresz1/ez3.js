/**
 * @class EZ3.TargetTexture2D
 * @extends EZ3.Texture2D
 * @constructor
 * @param {EZ3.Vector2} size
 * @param {Number} format
 * @param {Number} attachment
 */
 EZ3.TargetTexture2D = function(size, format, attachment) {
   EZ3.Texture2D.call(this, new EZ3.Image(size.x, size.y, format, null), false);

   /**
    * @property {Number} attachment
    */
   this.attachment = attachment;
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 /**
  * @method EZ3.TargetTexture2D#attach
  * @param {WebGLContext} gl
  */
 EZ3.TargetTexture2D.prototype.attach = function(gl) {
   gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachment, gl.TEXTURE_2D, this._id, 0);
 };
