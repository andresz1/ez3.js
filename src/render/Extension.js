/**
 * @class Extension
 */

EZ3.Extension = function(gl) {
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
  this.depthTextures = gl.getExtension('WEBGL_depth_texture');
  this.shaderLOD = gl.getExtension('EXT_shader_texture_lod');
};
