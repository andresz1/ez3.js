/**
 * @class Extension
 */

EZ3.Extension = function(gl) {
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
  this.floatTextures = gl.getExtension('OES_texture_float');
  this.angleArrays = gl.getExtension('ANGLE_instanced_arrays');
  this.floatLinearTextures = gl.getExtension('OES_texture_float_linear');
};
