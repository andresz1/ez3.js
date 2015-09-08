/**
 * @class MeshMaterial
 */

EZ3.MeshMaterial = function(config) {
  this.dirty = true;
  this._program = null;
  this._fill = config.fill || EZ3.MeshMaterial.SOLID;
};

Object.defineProperty(EZ3.MeshMaterial.prototype, 'program', {
  get: function() {
    return this._program;
  },
  set: function(program) {
    this._program = program;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.MeshMaterial.prototype, 'fill', {
  get: function() {
    return this._fill;
  },
  set: function(fill) {
    this._fill = fill;
  }
});

EZ3.MeshMaterial.SOLID = 0;
EZ3.MeshMaterial.POINTS = 1;
EZ3.MeshMaterial.WIREFRAME = 2;
