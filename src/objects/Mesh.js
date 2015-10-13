/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.geometry = geometry;
  this.material = material;
  this.mode = null;
  this.index = null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.prepare = function(gl, programs, lights) {
  if (this.material.fill === EZ3.Material.WIREFRAME) {
    this.mode = gl.LINES;
    this.index = 'line';

    if (!this.geometry.buffers.get('line'))
      this.geometry.calculateLinearIndeces();

  } else if (this.material.fill === EZ3.Material.POINTS) {
    this.mode = gl.POINTS;
    this.index = 'position';
  } else {
    this.mode = gl.TRIANGLES;
    this.index = 'triangle';
  }

  if (lights.length) {
    if (!this.geometry.buffers.get('normal'))
      this.geometry.calculateNormals();

    if (this.material.bumpMap instanceof EZ3.Texture &&
      !!this.geometry.buffers.get('tangent'))
      this.geometry.calculateTangentsAndBitangents();
  }

  if (this.material.dirty) {
    this.material.update(gl, programs, lights);
    this.material.dirty = false;
  }
};

EZ3.Mesh.prototype.render = function(gl) {
  var buffer = this.geometry.buffers.get(this.index);

  if (buffer instanceof EZ3.IndexBuffer)
    gl.drawElements(this.mode, buffer.data.length, buffer.getType(gl), 0);
  else if (buffer instanceof EZ3.VertexBuffer)
    gl.drawArrays(this._mode, 0, buffer.data.length / 3);
};
