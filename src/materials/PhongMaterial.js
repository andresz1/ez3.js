/**
 * @class PhongMaterial
 * @extends Material
 */

EZ3.PhongMaterial = function(config) {
  EZ3.Material.call(this);

  this.diffuseTexture = null;
  this.shininess = config.shininess || null;
  this.diffuseMap = config.diffuseMap || null;
  this.ambientColor = config.ambientColor || null;
  this.diffuseColor = config.diffuseColor || null;
  this.specularColor = config.specularColor || null;
};

EZ3.PhongMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.PhongMaterial.prototype.constructor = EZ3.PhongMaterial;
