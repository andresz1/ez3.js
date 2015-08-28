/**
 * @class ReflectionMaterial
 * @extends Material
 */

EZ3.ReflectionMaterial = function(config) {
  EZ3.Material.call(this);

  this.environmentTexture = null;
  this.ambient = config.ambient || null;
  this.diffuse = config.diffuse || null;
  this.specular = config.specular || null;
  this.shininess = config.shininess || null;
  this.diffuseMaps = config.diffuseMaps || [];
};

EZ3.ReflectionMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ReflectionMaterial.prototype.constructor = EZ3.ReflectionMaterial;
