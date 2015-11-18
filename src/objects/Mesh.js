/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.normal = new EZ3.Matrix3();
  this.geometry = geometry || new EZ3.Geometry();
  this.material = material || new EZ3.MeshMaterial();
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.updatePrimitiveData = function(){
  if (this.geometry.needGenerate) {
    this.geometry.generate();
    this.geometry.linearDataNeedGenerate = true;
    this.geometry.normalDataNeedGenerate = false;
  }
};

EZ3.Mesh.prototype.updateNormalData = function() {
  if (this.geometry.normalDataNeedGenerate) {
    this.geometry.generateNormalData();
    this.geometry.normalDataNeedGenerate = false;
  }
};

EZ3.Mesh.prototype.updateLinearData = function() {
  if (this.material.fill === EZ3.Material.WIREFRAME && this.geometry.linearDataNeedGenerate) {
    this.geometry.generateLinearData();
    this.geometry.linearDataNeedGenerate = false;
  }
};

EZ3.Mesh.prototype.updateNormal = function() {
  if (!this._cache.world.testEqual(this.world)) {
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
