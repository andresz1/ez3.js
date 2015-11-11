/**
 * @class Framebuffer
 */

 EZ3.Framebuffer = function(texture) {
  this._id = null;
  this._cache = {};
  this.texture = texture;
  this.dirty = true;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

EZ3.Framebuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
};

EZ3.Framebuffer.prototype.update = function(gl, attachment) {
  if(this.dirty) {
    this.texture.bind(gl);

    if(this.texture.dirty) {
      this.texture.update(gl);
      this.texture.dirty = false;
    }
  }

  this.texture.attachToFramebuffer(gl, attachment);
};
