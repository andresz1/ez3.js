/**
 * @class Texture
 */

EZ3.Texture = function(image) {
  this._id = null;
  this._image = image;

  this.dirty = true;
};

EZ3.Texture.prototype.update = function(gl, type) {
  if (type === gl.TEXTURE_2D) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  }
};

EZ3.Texture.prototype.bind = function(gl, type, unit, state) {
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
      type: type
    };
    gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
  } else {
    if (state.texture[slot].id !== this._id || state.texture[slot].type !== type) {
      state.texture[slot].id = this._id;
      state.texture[slot].type = type;
      gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
    }
  }
};
