/**
 * @class EZ3.Mesh
 * @extends EZ3.Entity
 * @constructor
 * @param {EZ3.Geometry} [geometry]
 * @param {EZ3.Material} [material]
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);
  /**
   * @property {EZ3.Geometry} geometry
   * @default new EZ3.Geometry()
   */
  this.geometry = geometry || new EZ3.Geometry();
  /**
   * @property {EZ3.Material} material
   * @default new EZ3.MeshMaterial()
   */
  this.material = material || new EZ3.MeshMaterial();
  /**
   * @property {EZ3.Matrix3} normal
   */
  this.normal = new EZ3.Matrix3();
  /**
   * @property {Boolean} shadowCaster
   * @default false
   */
  this.shadowCaster = false;
  /**
   * @property {Boolean} shadowReceiver
   * @default false
   */
  this.shadowReceiver = false;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

/**
 * @method EZ3.Mesh#updateProgram
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {Object} lights
 */
EZ3.Mesh.prototype.updateProgram = function(gl, state, lights) {
  this.material.updateProgram(gl, state, lights, this.shadowReceiver);
};

/**
 * @method EZ3.Mesh#updateLinearData
 */
EZ3.Mesh.prototype.updateLines = function() {
  if (this.material.fill === EZ3.Material.WIREFRAME)
    this.geometry.updateLines();
};

/**
 * @method EZ3.Mesh#updateNormal
 */
EZ3.Mesh.prototype.updateNormal = function() {
  if (this.world.isDiff(this._cache.world)) {
    this.normal.normalFromMat4(this.world);
    this._cache.world = this.world.clone();
  }
};

/**
 * @method EZ3.Mesh#render
 * @param {WebGLContext} gl
 * @param {Object} attributes
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererExtensions} extensions
 */
EZ3.Mesh.prototype.render = function(gl, state, extensions, attributes) {
  var mode;
  var index;
  var buffer;

  if (this.material.fill === EZ3.Material.WIREFRAME) {
    index = EZ3.IndexBuffer.LINEAR;
    buffer = this.geometry.buffers.getLines();
    mode = gl.LINES;
  } else if (this.material.fill === EZ3.Material.POINTS) {
    buffer = this.geometry.buffers.getPositions();
    mode = gl.POINTS;
  } else {
    index = EZ3.IndexBuffer.TRIANGULAR;
    buffer = this.geometry.buffers.getTriangles();
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
