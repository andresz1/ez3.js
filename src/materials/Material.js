/**
 * @class Material
 */

EZ3.Material = function() {
  this.dirty = true;
  this.program = null;
  this.fill = EZ3.Material.SOLID;
};

EZ3.Material.prototype.setupTexture = function(gl, map) {
  var texture;

  texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, map);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
};

EZ3.Material.prototype.constructor = EZ3.Material;

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
