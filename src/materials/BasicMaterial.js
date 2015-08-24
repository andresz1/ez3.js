/**
 * @class BasicMaterial
 * @extends Material
 */

EZ3.BasicMaterial = function(parameters){
  EZ3.Material.call(this);
  this.name = 'basic';
  this.color = vec3.create();
  this.color = vec3.set(this.color, parameters.color[0], parameters.color[1], parameters.color[2]);
};

EZ3.BasicMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.BasicMaterial.prototype.constructor = EZ3.BasicMaterial;
