/**
 * @class Material
 */

EZ3.Material = function() {
  this._fill = -1;
  this.dirty = true;
  this.vertex = null;
  this.program = null;
  this.fragment = null;
};

EZ3.Material.prototype.createTexture = function(textureData) {

};

EZ3.Material.prototype.constructor = EZ3.Material;

EZ3.Material.Solid = 0;
EZ3.Material.Points = 1;
EZ3.Material.Wireframe = 2;
