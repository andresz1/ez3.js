/**
 * @class EZ3.RendererExtensions
 * @constructor
 * @param {WebGLContext} gl
 */
EZ3.RendererExtensions = function(gl) {
  /**
   * @property {WebGLExtension} elementIndexUInt
   */
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  /**
   * @property {WebGLExtension} vertexArrayObject
   */
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  /**
   * @property {WebGLExtension} standardDerivates
   */
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
};
