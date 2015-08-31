/**
 * @class Material
 */

EZ3.Material = function(config) {
  this.dirty = true;
  this.vertex = null;
  this.program = null;
  this.fragment = null;
  this.fill = config.fill || EZ3.Material.SOLID;

  this.envMap = config.envMap || null;
  this.heightMap = config.heightMap || null;
  this.normalMap = config.normalMap || null;
  this.diffuseMap = config.diffuseMap || null;

  this.color = config.color || null;
  this.ambientColor = config.ambientColor || null;
  this.diffuseColor = config.diffuseColor || null;
  this.specularColor = config.specularColor || null;

  this.envTexture = null;
  this.depthTexture = null;
  this.heightTexture = null;
  this.normalTexture = null;
  this.diffuseTexture = null;
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

EZ3.Material.ENV_POSITIVE_X = 0;
EZ3.Material.ENV_NEGATIVE_X = 1;
EZ3.Material.ENV_POSITIVE_Y = 2;
EZ3.Material.ENV_NEGATIVE_Y = 3;
EZ3.Material.ENV_POSITIVE_Z = 4;
EZ3.Material.ENV_NEGATIVE_Z = 5;
