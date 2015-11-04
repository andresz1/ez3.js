/**
 * @class Cubemap
 * @extends Texture
 */

EZ3.Cubemap = function(px, nx, py, ny, pz, nz) {
  EZ3.Texture.call(this);

  this._images = [];
  this._images[EZ3.Cubemap.POSITIVE_X] = px;
  this._images[EZ3.Cubemap.NEGATIVE_X] = nx;
  this._images[EZ3.Cubemap.POSITIVE_Y] = py;
  this._images[EZ3.Cubemap.NEGATIVE_Y] = ny;
  this._images[EZ3.Cubemap.POSITIVE_Z] = pz;
  this._images[EZ3.Cubemap.NEGATIVE_Z] = nz;
};

EZ3.Cubemap.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Cubemap.prototype.contructor = EZ3.Cubemap;

EZ3.Cubemap.prototype.bind = function(gl, state, unit) {
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
      type: gl.TEXTURE_CUBE_MAP
    };
    gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
  } else {
    if (state.texture[slot].id !== this._id || state.texture[slot].type !== gl.TEXTURE_CUBE_MAP) {
      state.texture[slot].id = this._id;
      state.texture[slot].type = gl.TEXTURE_CUBE_MAP;
      gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
    }
  }
};

EZ3.Cubemap.prototype.update = function(gl, internalFormat, format) {
  var image;
  var face;
  var k;

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameterf(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  for(k = 0; k < 6; k++) {
    face = gl.TEXTURE_CUBE_MAP_POSITIVE_X + k;
    image = this._images[EZ3.Cubemap.POSITIVE_X + k];
    gl.texImage2D(face, 0, internalFormat, format, gl.UNSIGNED_BYTE, image);
  }
};

EZ3.Cubemap.POSITIVE_X = 0;
EZ3.Cubemap.NEGATIVE_X = 1;
EZ3.Cubemap.POSITIVE_Y = 2;
EZ3.Cubemap.NEGATIVE_Y = 3;
EZ3.Cubemap.POSITIVE_Z = 4;
EZ3.Cubemap.NEGATIVE_Z = 5;
