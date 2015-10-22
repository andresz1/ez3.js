/**
 * @class Texture
 */

EZ3.Texture = function(image) {
  this._id = null;
  this._image = image;

  this.dirty = true;
};

EZ3.Texture.prototype.update = function(gl) {
  gl.bindTexture(gl.TEXTURE_2D, this._id);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
};

EZ3.Texture.prototype.bind = function(gl, unit) {
  if (!this._id)
    this._id = gl.createTexture();

  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, this._id);
};
