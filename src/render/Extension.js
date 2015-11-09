/**
 * @class Extension
 */

EZ3.Extension = function(gl) {
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
  this.xx =  gl.getExtension('OES_half_float_linear');

  console.log(this.xx);
};
