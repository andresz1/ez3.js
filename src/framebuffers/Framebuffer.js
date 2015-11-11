/**
 * @class Framebuffer
 */

 EZ3.Framebuffer = function(resolution, texture) {
  this._id = null;
  this._cache = {};

  if(resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = null;

  if(texture instanceof EZ3.TargetTexture2D || texture instanceof EZ3.TargetCubemap)
    this.texture = texture;
  else
    this.texture = null;

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
