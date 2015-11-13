/**
 * @class Renderbuffer
 */

EZ3.Renderbuffer = function(resolution, storage) {
  this._id = null;
  this._cache = {};
  this.storage = storage;
  this.resolution = resolution;
};

EZ3.Renderbuffer.prototype.constructor = EZ3.Renderbuffer;

EZ3.Renderbuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createRenderbuffer();

  gl.bindRenderbuffer(gl.RENDERBUFFER, this._id);
};

EZ3.Renderbuffer.prototype.update = function(gl) {
  gl.renderbufferStorage(gl.RENDERBUFFER, gl[this.storage], this.resolution.x, this.resolution.y);
};

EZ3.Renderbuffer.prototype.attachToFramebuffer = function(gl, attachment) {
  if(this._cache.framebufferAttachment !== attachment) {
    this._cache.framebufferAttachment = attachment;
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl[attachment], gl.RENDERBUFFER, this._id);
  }
};
