/**
 * @class Material
 */

EZ3.Material = function(name) {
  this._name = name;

  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
  this.transparent = false;
  this.backFaceCulling = true;
  this.depthTest = true;
};

EZ3.Material.prototype.updateStates = function(gl) {
  if (this.depthTest) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  } else
    gl.disable(gl.DEPTH_TEST);

  if (this.backFaceCulling) {
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  } else
    gl.disable(gl.CULL_FACE);
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
