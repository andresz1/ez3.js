/**
 * @class ParallaxMappingMaterial
 * @extends Material
 */

EZ3.ParallaxMappingMaterial = function(config) {
  EZ3.Material.call(this);

  this.normalTexture = null;
  this.heightTexture = null;
  this.diffuseTexture = null;
  this.ambient = config.ambient || null;
  this.diffuse = config.diffuse || null;
  this.specular = config.specular || null;
  this.shininess = config.shininess || null;
  this.heightMap = config.heightMap || null;
  this.normalMap = config.normalMap || null;
  this.diffuseMap = config.diffuseMap || null;
};

EZ3.ParallaxMappingMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ParallaxMappingMaterial.prototype.constructor = EZ3.ParallaxMappingMaterial;
