/**
 * @class EZ3.Cubemap
 * @extends EZ3.Texture
 * @constructor
 * @param {EZ3.Image} px
 * @param {EZ3.Image} nx
 * @param {EZ3.Image} py
 * @param {EZ3.Image} ny
 * @param {EZ3.Image} pz
 * @param {EZ3.Image} nz
 * @param {Boolean} [generateMipmaps]
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

/**
 * @method EZ3.Cubemap#bind
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @return {EZ3.RendererCapabilities} capabilities
 */
EZ3.Cubemap.prototype.bind = function(gl, state, capabilities) {
  EZ3.Texture.prototype.bind.call(this, gl,  state, capabilities, gl.TEXTURE_CUBE_MAP);
};

/**
 * @method EZ3.Cubemap#update
 * @param {WebGLContext} gl
 */
EZ3.Cubemap.prototype.update = function(gl) {
  var k;

  if (this.needUpdate) {
    for(k = 0; k < 6; k++)
      EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + k, this._images[k]);

    EZ3.Texture.prototype._updateMipmaps.call(this, gl, gl.TEXTURE_CUBE_MAP);

    this.needUpdate = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_CUBE_MAP);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

/**
 * @method EZ3.Cubemap#setImage
 * @param {Number} face
 * @param {EZ3.Image} image
 */
EZ3.Cubemap.prototype.setImage = function(face, image) {
  this._images[face] = image;
};

/**
 * @property {Number} POSITIVE_X
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.POSITIVE_X = 0;
/**
 * @property {Number} NEGATIVE_X
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.NEGATIVE_X = 1;
/**
 * @property {Number} POSITIVE_Y
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.POSITIVE_Y = 2;
/**
 * @property {Number} NEGATIVE_Y
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.NEGATIVE_Y = 3;
/**
 * @property {Number} POSITIVE_Z
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.POSITIVE_Z = 4;
/**
 * @property {Number} NEGATIVE_Z
 * @memberof EZ3.Cubemap
 * @static
 * @final
 */
EZ3.Cubemap.NEGATIVE_Z = 5;
