/**
 * @class Cubemap
 * @extends Texture
 */

EZ3.Cubemap = function(px, nx, py, ny, pz, nz) {
  EZ3.Texture.call(this);

  this._images = [
    px,
    nx,
    py,
    ny,
    pz,
    nz
  ];
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
      EZ3.Texture.prototype.updateImage.call(this, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + k, this._images[k]);

    EZ3.Texture.prototype.updateMipmaps.call(this, gl);
  }

  EZ3.Texture.prototype.updateParameters.call(this, gl, gl.TEXTURE_CUBE_MAP);
  EZ3.Texture.prototype.updatePixelStore.call(this, gl);
};
