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

EZ3.Texture2D.prototype.bind  = function(gl, state, unit) {
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
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, gl.UNSIGNED_BYTE, this._image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
};
