/**
 * @class Material
 */

EZ3.Material = function(config) {
  this.dirty = true;
  this.program = null;
  this.fill = config.fill || EZ3.Material.SOLID;

  this.spots = 0;
  this.puntuals = 0;
  this.directionals = 0;

  this.shininess = {};
  this.shininess.dirty = true;
  this.shininess.value = config.shininess || null;

  this.color = {};
  this.color.dirty = true;
  this.color.value = config.color || null;

  this.ambientColor = {};
  this.ambientColor.dirty = true;
  this.ambientColor.value = config.ambientColor || null;

  this.diffuseColor = {};
  this.diffuseColor.dirty = true;
  this.diffuseColor.value = config.diffuseColor || null;

  this.specularColor = {};
  this.specularColor.dirty = true;
  this.specularColor.value = config.specularColor || null;

  this.envTexture = {};
  this.envTexture.dirty = true;
  this.envTexture.value = null;
  this.envTexture.map = config.envMap || null;

  this.depthTexture = {};
  this.depthTexture.map = null;
  this.depthTexture.dirty = true;
  this.depthTexture.value = null;

  this.heightTexture = {};
  this.heightTexture.dirty = true;
  this.heightTexture.value = null;
  this.heightTexture.map = config.heightMap || null;

  this.normalTexture = {};
  this.normalTexture.dirty = true;
  this.normalTexture.value = null;
  this.normalTexture.map = config.normalMap || null;

  this.diffuseTexture = {};
  this.diffuseTexture.value = null;
  this.diffuseTexture.dirty = true;
  this.diffuseTexture.map = config.diffuseMap || null;
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
