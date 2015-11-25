/**
 * @class Framebuffer
 */

 EZ3.Framebuffer = function(size) {
  this._id = null;
  this._cache = {};
  this._renderbuffer = null;

  this.size = size;
  this.texture = null;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

EZ3.Framebuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
};

EZ3.Framebuffer.prototype.update = function(gl, textureAttachment, renderbufferAttachment) {
  this.texture.bind(gl);
  this.texture.update(gl);
  this.texture.attachToFramebuffer(gl, textureAttachment);

  this._renderbuffer.bind(gl);
  this._renderbuffer.update(gl);
  this._renderbuffer.attachToFramebuffer(gl, renderbufferAttachment);

  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    console.warn('EZ3.Framebuffer.update: update is not completed.');
};
