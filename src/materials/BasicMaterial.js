/**
 * @class BasicMaterial
 * @extends Material
 */

EZ3.BasicMaterial = function(config) {
  EZ3.Material.call(this);

  this.diffuseTexture = null;
  this.color = config.color || null;
  this.diffuseMap = config.diffuseMap || null;
};

EZ3.BasicMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.BasicMaterial.prototype.constructor = EZ3.BasicMaterial;
