/**
 * @class FlatMaterial
 * @extends Material
 */

EZ3.FlatMaterial = function(config) {
  EZ3.Material.call(this);
};

EZ3.FlatMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.FlatMaterial.prototype.constructor = EZ3.FlatMaterial;
