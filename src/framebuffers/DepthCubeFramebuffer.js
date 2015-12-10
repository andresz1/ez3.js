/**
 * @class DepthCubeFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthCubeFramebuffer = function(size) {
  EZ3.Framebuffer.call(this, size);
};

EZ3.DepthCubeFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.DepthCubeFramebuffer.prototype.constructor = EZ3.DepthCubeFramebuffer;

EZ3.DepthCubeFramebuffer.prototype.update = function(gl) {
  if(this.size.testDiff(this._cache.size)) {
    this._cache.size = this.size.clone();

    this.texture = new EZ3.TargetCubemap(this.size, EZ3.Image.RGBA_FORMAT, gl.COLOR_ATTACHMENT0);
    this.texture.wrapS = EZ3.Texture.CLAMP_TO_EDGE;
    this.texture.wrapT = EZ3.Texture.CLAMP_TO_EDGE;

    EZ3.Framebuffer.prototype.update.call(this, gl);
  }
};
