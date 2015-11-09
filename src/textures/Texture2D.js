/**
 * @class Texture2D
 * @extends Texture
 */

EZ3.Texture2D = function(image) {
  EZ3.Texture.call(this);
  this._image = image;
};

EZ3.Texture2D.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Texture2D.prototype.constructor = EZ3.Texture2D;

EZ3.Texture2D.prototype.bind = function(gl, state, unit) {
  EZ3.Texture.prototype.bind.call(this, gl, state, unit, gl.TEXTURE_2D);
};

EZ3.Texture2D.prototype.update = function(gl) {
  if (this.dirty) {
    EZ3.Texture.prototype.updateImage.call(this, gl, gl.TEXTURE_2D, this._image);
    EZ3.Texture.prototype.updateMipmaps.call(this, gl);
  }

  EZ3.Texture.prototype.updateParameters.call(this, gl, gl.TEXTURE_2D);
  EZ3.Texture.prototype.updatePixelStore.call(this, gl);
};
