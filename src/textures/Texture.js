/**
 * @class Texture
 */

EZ3.Texture = function(generateMipmaps) {
  this._id = null;
  this._cache = {};

  this.generateMipmaps = (generateMipmaps === undefined)? true : generateMipmaps;
  this.wrapS = EZ3.Texture.REPEAT;
  this.wrapT = EZ3.Texture.REPEAT;
  this.magFilter = EZ3.Texture.LINEAR;
  this.minFilter = EZ3.Texture.LINEAR_MIPMAP_LINEAR;
  this.flipY = false;
  this.dirty = true;
};

EZ3.Texture.prototype._updateImage = function(gl, target, image) {
  var format = gl[image.format];

  if (!EZ3.Math.isPowerOfTwo(image.width) || !EZ3.Math.isPowerOfTwo(image.height))
    image.toPowerOfTwo();

  gl.texImage2D(target, 0, format, image.width, image.height, 0, format, gl.UNSIGNED_BYTE, image.data);
};

EZ3.Texture.prototype._updateMipmaps = function(gl) {
  if (!this.generateMipmaps) {
    this.magFilter = EZ3.Texture.LINEAR;
    this.minFilter = EZ3.Texture.LINEAR;
  } else
    gl.generateMipmap(gl.TEXTURE_2D);
};

EZ3.Texture.prototype._updatePixelStore = function(gl) {
  if (this._cache.flipY !== this.flipY) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    this._cache.flipY = this.flipY;
  }
};

EZ3.Texture.prototype._updateParameters = function(gl, target) {
  if (this._cache.wrapS !== this.wrapS) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
    this._cache.wrapS = this.wrapS;
  }

  if (this._cache.wrapT !== this.wrapT) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
    this._cache.wrapT = this.wrapT;
  }

  if (this._cache.magFilter !== this.magFilter) {
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
    this._cache.magFilter = this.magFilter;
  }

  if (this._cache.minFilter !== this.minFilter) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
    this._cache.minFilter = this.minFilter;
  }
};

EZ3.Texture.prototype.bind = function(gl, target, state) {
  var slot;
  var maxSlots;

  if (!this._id)
    this._id = gl.createTexture();

  if(state instanceof EZ3.State) {
    maxSlots = state.maxTextureSlots;

    if(state.usedTextureSlots < maxSlots + 1) {

      slot = gl.TEXTURE0 + state.usedTextureSlots;

      if (state.currentTextureSlot !== slot) {
        gl.activeTexture(slot);
        state.currentTextureSlot = slot;
      }

      if (!state.texture[slot]) {
        state.texture[slot] = {
          id: this._id,
          target: target
        };
        gl.bindTexture(state.texture[slot].target, state.texture[slot].id);
      } else {
        if (state.texture[slot].id !== this._id || state.texture[slot].target !== target) {
          state.texture[slot].id = this._id;
          state.texture[slot].target = target;
          gl.bindTexture(state.texture[slot].target, state.texture[slot].id);
        }
      }
    } else
      console.warn('EZ3.Texture.bind: not available enough texture slots. Max slots available: ', maxSlots + 1);
  } else
    gl.bindTexture(target, this._id);
};

EZ3.Texture.LINEAR = 'LINEAR';
EZ3.Texture.NEAREST = 'NEAREST';
EZ3.Texture.LINEAR_MIPMAP_LINEAR = 'LINEAR_MIPMAP_LINEAR';
EZ3.Texture.NEAREST_MIPMAP_NEAREST = 'NEAREST_MIPMAP_NEAREST';
EZ3.Texture.NEAREST_MIPMAP_LINEAR = 'NEAREST_MIPMAP_LINEAR';
EZ3.Texture.LINEAR_MIPMAP_NEAREST = 'LINEAR_MIPMAP_NEAREST';
EZ3.Texture.CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
EZ3.Texture.REPEAT = 'REPEAT';
EZ3.Texture.MIRRORED_REPEAT = 'MIRRORED_REPEAT';
