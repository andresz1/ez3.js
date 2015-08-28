/**
 * @class GouraudMaterial
 * @extends Material
 */

EZ3.GouraudMaterial = function(config) {
  EZ3.Material.call(this);

  this.diffuseTexture = null;
  this.ambient = config.ambient || null;
  this.diffuse = config.diffuse || null;
  this.specular = config.specular || null;
  this.shininess = config.shininess || null;
  this.diffuseMap = config.diffuseMap || null;
};

EZ3.GouraudMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.GouraudMaterial.prototype.constructor = EZ3.GouraudMaterial;
