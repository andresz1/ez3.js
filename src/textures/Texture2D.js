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
  var slot = gl.TEXTURE0 + unit;

  if (!this._id)
    this._id = gl.createTexture();

  if (state.currentTextureSlot !== slot) {
    gl.activeTexture(slot);
    state.currentTextureSlot = slot;
  }

  if (!state.texture[slot]) {
    state.texture[slot] = {
      id: this._id,
      type: gl.TEXTURE_2D
    };
    gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
  } else {
    if (state.texture[slot].id !== this._id || state.texture[slot].type !== gl.TEXTURE_2D) {
      state.texture[slot].id = this._id;
      state.texture[slot].type = gl.TEXTURE_2D;
      gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
    }
  }
};

EZ3.Texture2D.prototype.update = function(gl, internalFormat, format) {
  var canvas;
  var ctx;

  function isPowerOfTwo(x) {
    return (x & (x - 1)) === 0;
  }

  function nextHighestPowerOfTwo(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
      x = x | x >> i;
    }
    return x + 1;
  }

  if (!isPowerOfTwo(this._image.width) || !isPowerOfTwo(this._image.height)) {
    // Scale up the texture to the next highest power of two dimensions.
    canvas = document.createElement('canvas');
    canvas.width = nextHighestPowerOfTwo(this._image.width);
    canvas.height = nextHighestPowerOfTwo(this._image.height);
    ctx = canvas.getContext('2d');
    ctx.drawImage(this._image, 0, 0, this._image.width, this._image.height, 0, 0, canvas.width, canvas.height);
    this._image = canvas;
  }

  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, gl.UNSIGNED_BYTE, this._image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.generateMipmap(gl.TEXTURE_2D);
};
