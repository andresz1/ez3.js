/**
 * @class TargetCubemap
 * @extends Cubemap
 */

 EZ3.TargetCubemap = function(size, format, attachment) {
   EZ3.Cubemap.call(this,
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     false
   );

   this.attachment = attachment;
 };

 EZ3.TargetCubemap.prototype = Object.create(EZ3.Cubemap.prototype);
 EZ3.TargetCubemap.prototype.constructor = EZ3.TargetCubemap;

 EZ3.TargetCubemap.prototype.attach = function(gl, face) {
   var index = face || 0;

   gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, this._id, 0);
 };
