/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this._geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
  this._material = (material instanceof EZ3.MeshMaterial) ? material : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.render = function(gl) {
  var geometry = this.geometry;
  var material = this.material;
  var program = material.program;
  var index;
  var mode;

  if(geometry) {

    if(material.fill === EZ3.MeshMaterial.WIREFRAME) {
      mode = gl.LINES;
      index = 'line';

      if(!geometry.buffers.get(index))
        geometry.linearize();

    } else {
      mode = gl.TRIANGLES;
      index = 'triangle';
    }

    this.geometry.buffers.update(gl, program.attributes);
    this.geometry.buffers.bind(gl, program.attributes);
    this.geometry.buffers.render(gl, mode, index);
    this.geometry.buffers.unbind(gl);
  }
};

Object.defineProperty(EZ3.Mesh.prototype, 'material', {
  get: function() {
    return this._material;
  },
  set: function(material) {
    if (material instanceof EZ3.MeshMaterial)
      this._material = material;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'geometry', {
  get: function() {
    return this._geometry;
  },
  set: function(geometry) {
    if (geometry instanceof EZ3.Geometry)
      this._geometry = geometry;
  }
});
