/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthFramebuffer = function(size) {
  EZ3.Framebuffer.call(this, size);
};

EZ3.DepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.DepthFramebuffer.prototype.constructor = EZ3.DepthFramebuffer;

EZ3.DepthFramebuffer.prototype.update = function(gl) {
  if(this.size.isDiff(this._cache.size)) {
    this._cache.size = this.size.clone();

    this.texture = new EZ3.TargetTexture2D(this.size, EZ3.Image.RGBA_FORMAT, gl.COLOR_ATTACHMENT0);
    this.texture.wrapS = EZ3.Texture.CLAMP_TO_EDGE;
    this.texture.wrapT = EZ3.Texture.CLAMP_TO_EDGE;

    EZ3.Framebuffer.prototype.update.call(this, gl);
  }
};
