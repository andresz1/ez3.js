/**
 * @class Material
 */

EZ3.Material = function() {
  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
  this.backFaceCulling = true;
  this.depthTest = true;
  this.dirty = true;
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
