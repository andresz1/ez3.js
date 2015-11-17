/**
 * @class Renderbuffer
 */

EZ3.Renderbuffer = function(size) {
  this._id = null;
  this._cache = {};
  this.size = size;
};

EZ3.Renderbuffer.prototype.constructor = EZ3.Renderbuffer;

EZ3.Renderbuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createRenderbuffer();

  gl.bindRenderbuffer(gl.RENDERBUFFER, this._id);
};

EZ3.Renderbuffer.prototype.update = function(gl, storage) {
  if(this._cache.storage !== storage) {
    this._cache.storage = storage;
    gl.renderbufferStorage(gl.RENDERBUFFER, gl[storage], this.size.x, this.size.y);
  }
};

EZ3.Renderbuffer.prototype.attachToFramebuffer = function(gl, attachment) {
  if(this._cache.attachment !== attachment) {
    this._cache.attachment = attachment;
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl[attachment], gl.RENDERBUFFER, this._id);
  }
};
