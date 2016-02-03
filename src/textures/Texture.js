/**
 * @class EZ3.Texture
 * @constructor
 * @param {Boolean} [generateMipmaps]
 */
EZ3.Texture = function(generateMipmaps) {
  /**
   * @property {WebGLId} _id
   * @private
   */
  this._id = null;
  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};

  /**
   * @property {Boolean} generateMipmaps
   * @default true
   */
  this.generateMipmaps = (generateMipmaps === undefined) ? true : generateMipmaps;
  /**
   * @property {Number} wrapS
   * @default EZ3.Texture.REPEAT
   */
  this.wrapS = EZ3.Texture.REPEAT;
  /**
   * @property {Number} wrapT
   * @default EZ3.Texture.REPEAT
   */
  this.wrapT = EZ3.Texture.REPEAT;
  /**
   * @property {Number} magFilter
   * @default EZ3.Texture.LINEAR
   */
  this.magFilter = EZ3.Texture.LINEAR;
  /**
   * @property {Number} minFilter
   * @default EZ3.Texture.LINEAR_MIPMAP_LINEAR
   */
  this.minFilter = EZ3.Texture.LINEAR_MIPMAP_LINEAR;
  /**
   * @property {Number} flipY
   * @default false
   */
  this.flipY = false;
  /**
   * @property {Number} needUpdate
   * @default true
   */
  this.needUpdate = true;
};

/**
 * @method EZ3.Texture#_getGLFilter
 * @protected
 * @param {WebGLContext} gl
 * @param {Number} filter
 * @return {Number}
 */
EZ3.Texture.prototype._getGLFilter = function(gl, filter) {
  if (filter === EZ3.Texture.LINEAR)
    return gl.LINEAR;
  else if (filter === EZ3.Texture.NEAREST)
    return gl.NEAREST;
  else if (filter === EZ3.Texture.LINEAR_MIPMAP_LINEAR)
    return gl.LINEAR_MIPMAP_LINEAR;
  else if (filter === EZ3.Texture.NEAREST_MIPMAP_NEAREST)
    return gl.NEAREST_MIPMAP_NEAREST;
  else if (filter === EZ3.Texture.NEAREST_MIPMAP_LINEAR)
    return gl.NEAREST_MIPMAP_LINEAR;
  else
    return gl.LINEAR_MIPMAP_NEAREST;
};

/**
 * @method EZ3.Texture#_getGLWrap
 * @protected
 * @param {WebGLContext} gl
 * @param {Number} wrap
 * @return {Number}
 */
EZ3.Texture.prototype._getGLWrap = function(gl, wrap) {
  if (wrap === EZ3.Texture.CLAMP_TO_EDGE)
    return gl.CLAMP_TO_EDGE;
  else if (wrap  === EZ3.Texture.REPEAT)
    return gl.REPEAT;
  else
    return gl.MIRRORED_REPEAT;
};

/**
 * @method EZ3.Texture#_updateImage
 * @protected
 * @param {WebGLContext} gl
 * @param {Number} target
 * @param {EZ3.Image} image
 */
EZ3.Texture.prototype._updateImage = function(gl, target, image) {
  var format = image.getGLFormat(gl);

  if (!EZ3.Math.isPowerOfTwo(image.width) || !EZ3.Math.isPowerOfTwo(image.height))
    image.toPowerOfTwo();

  gl.texImage2D(target, 0, format, image.width, image.height, 0, format, gl.UNSIGNED_BYTE, image.data);
};

/**
 * @method EZ3.Texture#_updateMipmaps
 * @protected
 * @param {WebGLContext} gl
 * @param {Number} target
 */
EZ3.Texture.prototype._updateMipmaps = function(gl, target) {
  if (!this.generateMipmaps) {
    this.magFilter = EZ3.Texture.LINEAR;
    this.minFilter = EZ3.Texture.LINEAR;
  } else {
    gl.generateMipmap(target);
  }
};

/**
 * @method EZ3.Texture#_updatePixelStore
 * @protected
 * @param {WebGLContext} gl
 */
EZ3.Texture.prototype._updatePixelStore = function(gl) {
  if (this._cache.flipY !== this.flipY) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    this._cache.flipY = this.flipY;
  }
};

/**
 * @method EZ3.Texture#_updateParameters
 * @protected
 * @param {WebGLContext} gl
 * @param {Number} target
 */
EZ3.Texture.prototype._updateParameters = function(gl, target) {
  if (this._cache.wrapS !== this.wrapS) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, this._getGLWrap(gl, this.wrapS));
    this._cache.wrapS = this.wrapS;
  }

  if (this._cache.wrapT !== this.wrapT) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, this._getGLWrap(gl, this.wrapT));
    this._cache.wrapT = this.wrapT;
  }

  if (this._cache.magFilter !== this.magFilter) {
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, this._getGLFilter(gl, this.magFilter));
    this._cache.magFilter = this.magFilter;
  }

  if (this._cache.minFilter !== this.minFilter) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, this._getGLFilter(gl, this.minFilter));
    this._cache.minFilter = this.minFilter;
  }
};

/**
 * @method EZ3.Texture#bind
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 * @param {Number} target
 */
EZ3.Texture.prototype.bind = function(gl, state, capabilities, target) {
  if (!this._id)
    this._id = gl.createTexture();

  if(state && capabilities) {
    if(state.usedTextureSlots < capabilities.maxTextureSlots + 1)
      state.bindTexture(target, this._id);
    else
      console.warn('EZ3.Texture.bind: not available enough texture slots.');
  } else
    gl.bindTexture(target, this._id);
};

/**
 * @property {Number} LINEAR
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.LINEAR = 1;
/**
 * @property {Number} NEAREST
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.NEAREST = 2;
/**
 * @property {Number} LINEAR_MIPMAP_LINEAR
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.LINEAR_MIPMAP_LINEAR = 3;
/**
 * @property {Number} NEAREST_MIPMAP_NEAREST
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.NEAREST_MIPMAP_NEAREST = 4;
/**
 * @property {Number} NEAREST_MIPMAP_LINEAR
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.NEAREST_MIPMAP_LINEAR = 5;
/**
 * @property {Number} LINEAR_MIPMAP_NEAREST
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.LINEAR_MIPMAP_NEAREST = 6;
/**
 * @property {Number} CLAMP_TO_EDGE
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.CLAMP_TO_EDGE = 1;
/**
 * @property {Number} REPEAT
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.REPEAT = 2;
/**
 * @property {Number} MIRRORED_REPEAT
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.MIRRORED_REPEAT = 3;
/**
 * @property {Number} COLOR_ATTACHMENT0
 * @memberof EZ3.Texture
 * @static
 * @final
 */
EZ3.Texture.COLOR_ATTACHMENT0 = 1;
