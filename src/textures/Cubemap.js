/**
 * @class Cubemap
 * @extends Texture
 */

EZ3.Cubemap = function(px, nx, py, ny, pz, nz, generateMipmaps) {
  EZ3.Texture.call(this, generateMipmaps);

  this._images = [];
  this.setImage(EZ3.Cubemap.POSITIVE_X, px);
  this.setImage(EZ3.Cubemap.NEGATIVE_X, nx);
  this.setImage(EZ3.Cubemap.POSITIVE_Y, py);
  this.setImage(EZ3.Cubemap.NEGATIVE_Y, ny);
  this.setImage(EZ3.Cubemap.POSITIVE_Z, pz);
  this.setImage(EZ3.Cubemap.NEGATIVE_Z, nz);
};

EZ3.Cubemap.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Cubemap.prototype.contructor = EZ3.Cubemap;

EZ3.Cubemap.prototype.bind = function(gl, state, unit) {
  EZ3.Texture.prototype.bind.call(this, gl, state, unit, gl.TEXTURE_CUBE_MAP);
};

EZ3.Cubemap.prototype.update = function(gl) {
  var k;

  if (this.dirty) {
    for(k = 0; k < 6; k++)
      EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + k, this._images[k]);

    EZ3.Texture.prototype._updateMipmaps.call(this, gl);
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_CUBE_MAP);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

EZ3.Cubemap.prototype.setImage = function(target, image) {
  if (image instanceof EZ3.Image)
    this._images[target] = image;
};

EZ3.Cubemap.POSITIVE_X = 0;
EZ3.Cubemap.NEGATIVE_X = 1;
EZ3.Cubemap.POSITIVE_Y = 2;
EZ3.Cubemap.NEGATIVE_Y = 3;
EZ3.Cubemap.POSITIVE_Z = 4;
EZ3.Cubemap.NEGATIVE_Z = 5;
