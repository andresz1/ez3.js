/**
 * @class Framebuffer
 */

 EZ3.Framebuffer = function(resolution, renderbuffer, texture) {
  this._id = null;
  this._cache = {};
  this._renderbuffer = renderbuffer;
  this.resolution = resolution;
  this.texture = texture;
  this.dirty = true;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

EZ3.Framebuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
};

EZ3.Framebuffer.prototype.update = function(gl, textureAttachment, renderbufferAttachment) {
  if(this.dirty) {
    this.texture.bind(gl);
    this.texture.update(gl);
    this.texture.attachToFramebuffer(gl, textureAttachment);

    this._renderbuffer.bind(gl);
    this._renderbuffer.update(gl);
    this._renderbuffer.attachToFramebuffer(gl, renderbufferAttachment);

    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      console.warn('EZ3.Framebuffer.update: update is not completed.');

    this.dirty = false;
  }
};
