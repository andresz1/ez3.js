/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.normal = new EZ3.Matrix3();
  this.geometry = geometry || new EZ3.Geometry();
  this.material = material || new EZ3.MeshMaterial();

  this.shadowCaster = false;
  this.shadowReceiver = false;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.updateNormalData = function() {
  if (this.geometry.normalDataNeedUpdate) {
    this.geometry.computeNormalData();
    this.geometry.normalDataNeedUpdate = false;
  }
};

EZ3.Mesh.prototype.updateLinearData = function() {
  if (this.material.fill === EZ3.Material.WIREFRAME && this.geometry.linearDataNeedUpdate) {
    this.geometry.computeLinearData();
    this.geometry.linearDataNeedUpdate = false;
  }
};

EZ3.Mesh.prototype.updateNormal = function() {
  if (!this._cache.world.testEqual(this.world)) {
    this.normal.normalFromMat4(this.world);
    this._cache.world = this.world.clone();
  }
};

EZ3.Mesh.prototype.render = function(gl, attributes, state, extensions) {
  var mode;
  var index;
  var buffer;

  if (this.material.fill === EZ3.Material.WIREFRAME) {
    index = EZ3.IndexBuffer.LINEAR;
    buffer = this.geometry.buffers.getLinearBuffer();
    mode = gl.LINES;
  } else if (this.material.fill === EZ3.Material.POINTS) {
    buffer = this.geometry.buffers.getPositionBuffer();
    mode = gl.POINTS;
  } else {
    index = EZ3.IndexBuffer.TRIANGULAR;
    buffer = this.geometry.buffers.getTriangularBuffer();
    mode = gl.TRIANGLES;
  }

  if (index) {
    this.geometry.buffers.bind(gl, attributes, state, extensions, index);
    gl.drawElements(mode, buffer.data.length, buffer.getGLType(gl, extensions), 0);
  } else {
    this.geometry.buffers.bind(gl, attributes, state, extensions);
    gl.drawArrays(mode, 0, buffer.data.length / 3);
  }
};
