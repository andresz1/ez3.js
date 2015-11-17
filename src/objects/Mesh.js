/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.normal = new EZ3.Matrix3();
  this.shadow = new EZ3.Matrix4();

  this.geometry = geometry;
  this.material = material;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.updateEssentialBuffers = function() {
  if (this.geometry.dirty) {
    this.geometry.generate();
    this.geometry.dirty = false;
  }

  if (this.material.fill === EZ3.Material.WIREFRAME && !this.geometry.buffers.get('line'))
    this.geometry.processLinearIndices();
};

EZ3.Mesh.prototype.updateIlluminationBuffers = function() {
  if (!this.geometry.buffers.get('normal'))
    this.geometry.processNormals();

  if (this.material.bumpMap instanceof EZ3.Texture && !this.geometry.buffers.get('tangent'))
    this.geometry.processTangentsAndBitangents();
};

EZ3.Mesh.prototype.updateNormal = function() {
  if (this._cache.world.testDiff(this.world)) {
    this.normal.normalFromMat4(this.world);
    this._cache.world = this.world.clone();
  }
};

EZ3.Mesh.prototype.render = function(gl, attributes, state, extension) {
  var mode;
  var buffer;

  if (this.material.fill === EZ3.Material.WIREFRAME) {
    buffer = this.geometry.buffers.get('line');
    mode = gl.LINES;
  } else if (this.material.fill === EZ3.Material.POINTS) {
    buffer = this.geometry.buffers.get('position');
    mode = gl.POINTS;
  } else {
    buffer = this.geometry.buffers.get('triangle');
    mode = gl.TRIANGLES;
  }

  if (buffer instanceof EZ3.IndexBuffer) {
    this.geometry.buffers.bind(gl, attributes, state, extension, buffer);
    gl.drawElements(mode, buffer.data.length, buffer.getType(gl, extension), 0);
  } else if (buffer instanceof EZ3.VertexBuffer) {
    this.geometry.buffers.bind(gl, attributes, state, extension);
    gl.drawArrays(mode, 0, buffer.data.length / 3);
  }
};
