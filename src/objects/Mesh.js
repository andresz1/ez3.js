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
  var name;
  var mode;
  var buffer;

  if(geometry) {

    if(material.fill === EZ3.MeshMaterial.WIREFRAME) {

      if(!geometry.buffers.get(name))
        geometry.linearize();

      mode = gl.LINES;
      name = 'line';

    } else if(material.fill === EZ3.MeshMaterial.POINTS) {

      mode = gl.POINTS;
      name = 'position';

    } else {

      mode = gl.TRIANGLES;
      name = 'triangle';

    }

    this.geometry.buffers.update(gl, program.attributes);

    this.geometry.buffers.bind(gl, program.attributes, name);

    buffer = this.geometry.buffers.get(name);

    if(buffer) {
      if(buffer instanceof EZ3.IndexBuffer)
        gl.drawElements(mode, buffer.data.length, buffer.getType(gl), 0);
      else
        gl.drawArrays(mode, 0, buffer.data.length / 3);
    }

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
