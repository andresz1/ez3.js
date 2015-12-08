/**
 * @class Texture2D
 * @extends Texture
 */

EZ3.Texture2D = function(image, generateMipmaps) {
  EZ3.Texture.call(this, generateMipmaps);

  this.image = image;
};

EZ3.Texture2D.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Texture2D.prototype.constructor = EZ3.Texture2D;

EZ3.Texture2D.prototype.bind = function(gl, state) {
  EZ3.Texture.prototype.bind.call(this, gl, gl.TEXTURE_2D, state);
};

EZ3.Texture2D.prototype.update = function(gl) {
  if (this.dirty) {
    EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_2D, this.image);
    EZ3.Texture.prototype._updateMipmaps.call(this, gl, gl.TEXTURE_2D);

    this.dirty = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_2D);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};
