/**
 * @class MeshMaterial
 */

EZ3.MeshMaterial = function() {
  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
};

EZ3.MeshMaterial.SOLID = 0;
EZ3.MeshMaterial.POINTS = 1;
EZ3.MeshMaterial.WIREFRAME = 2;
