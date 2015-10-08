/**
 * @class ShaderMaterial
 * @extends Material
 */

EZ3.ShaderMaterial = function(name, vertex, fragment) {
  this.name = name;
  this.vertex = vertex;
  this.fragment = fragment;
};

EZ3.ShaderMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ShaderMaterial.prototype.constructor = EZ3.Material;
