/**
 * @class Renderbuffer
 */

EZ3.Renderbuffer = function(size, storage) {
  this._id = null;
  this._cache = {};
  this.size = size;
  this.storage = storage;
};

EZ3.Renderbuffer.prototype.constructor = EZ3.Renderbuffer;

EZ3.Renderbuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createRenderbuffer();

  gl.bindRenderbuffer(gl.RENDERBUFFER, this._id);
};

EZ3.Renderbuffer.prototype.update = function(gl) {
  if(this._cache.storage !== this.storage) {
    gl.renderbufferStorage(gl.RENDERBUFFER, gl[this.storage], this.size.x, this.size.y);
    this._cache.storage = this.storage.toString();
  }
};

EZ3.Renderbuffer.prototype.attachToFramebuffer = function(gl, attachment) {
  if(this._cache.attachment !== attachment) {
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl[attachment], gl.RENDERBUFFER, this._id);
    this._cache.attachment = attachment;
  }
};
