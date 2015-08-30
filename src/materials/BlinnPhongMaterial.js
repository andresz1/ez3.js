/**
 * @class BlinnPhongMaterial
 * @extends Material
 */

EZ3.BlinnPhongMaterial = function(config) {
  EZ3.Material.call(this);

  this.diffuseMapTexture = null;
  this.ambient = config.ambient || null;
  this.diffuse = config.diffuse || null;
  this.specular = config.specular || null;
  this.shininess = config.shininess || null;
  this.diffuseMap = config.diffuseMap || null;
  this.linearAttenuation = config.linearAttenuation || null;
  this.constantAttenuation = config.constantAttenuation || null;
  this.quadraticAttenuation = config.quadraticAttenuation || null;
};

EZ3.BlinnPhongMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.BlinnPhongMaterial.prototype.constructor = EZ3.BlinnPhongMaterial;
