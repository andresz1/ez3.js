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

EZ3.Framebuffer.prototype.bind = function(gl, state) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
  state.viewport(new EZ3.Vector2(), this.size);
};

EZ3.Framebuffer.prototype.update = function(gl) {
  this.texture.bind(gl);
  this.texture.update(gl);
  this.texture.attach(gl);

  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    console.warn('EZ3.Framebuffer.update: update is not completed.');
};

EZ3.Framebuffer.unbind = function(gl) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
