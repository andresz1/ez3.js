/**
 * @class GLSLProgramBuilder
 */

EZ3.GLSLProgramBuilder = function() {
  this._config = {};
  this._vertex = null;
  this._fragment = null;
};

EZ3.GLSLProgramBuilder.prototype.constructor = EZ3.ShaderBuilder;

EZ3.GLSLProgramBuilder.prototype._buildVertex = function(prefix) {
  var suffix = [
    'attribute vec2 uv;',
    'attribute vec3 color;',
    'attribute vec3 normal;',
    'attribute vec3 vertex;',
    'attribute vec4 tangent;',
    'attribute vec3 bitangent;',

    'uniform mat4 uMvMatrix;',
    'uniform mat4 uMvpMatrix;',
    'uniform mat4 uViewMatrix;',
    'uniform mat4 uModelMatrix;',
    'uniform mat3 uNormalMatrix;',
    'uniform mat4 uProjectionMatrix;',

    EZ3.ShaderChunk['world-space-uv-header'],

    'void main() {',

    EZ3.ShaderChunk['world-space-uv-main'],

    ' gl_Position = uMvpMatrix * vec4(vertex, 1.0);',
    '}'
  ].join('\n\n');

  this._vertex = prefix + '\n\n' + suffix;
};

EZ3.GLSLProgramBuilder.prototype._buildFragment = function(prefix) {
  var suffix = [
    EZ3.ShaderChunk['material-header'],
    EZ3.ShaderChunk['world-space-uv-header'],
    EZ3.ShaderChunk['diffuse-texture-header'],
    EZ3.ShaderChunk['eye-position-fragment-header'],

    EZ3.ShaderChunk['phong-shading-spot-header'],
    EZ3.ShaderChunk['phong-shading-puntual-header'],
    EZ3.ShaderChunk['phong-shading-directional-header'],
    EZ3.ShaderChunk['phong-shading-header'],

    'void main() {',
    ' vec4 color = vec4(1.0);',

    EZ3.ShaderChunk['material-ads-main'],
    EZ3.ShaderChunk['material-color-main'],
    EZ3.ShaderChunk['diffuse-texture-main'],
    EZ3.ShaderChunk['phong-shading-main'],

    ' gl_FragColor = color;',
    '}'
  ].join('\n\n');

  this._fragment = prefix + '\n\n' + suffix;
};

EZ3.GLSLProgramBuilder.prototype._buildConfig = function(material) {

  var prefix = [
    'precision highp float;',

    '#define SPOT_LIGHTS ' + material.spots,
    '#define PUNTUAL_LIGHTS ' + material.puntuals,
    '#define DIRECTIONAL_LIGHTS ' + material.directionals,

    (material.color.value) ? '#define USE_COLOR_MATERIAL' : '',
    (material.diffuseTexture.map) ? '#define USE_DIFFUSE_TEXTURE' : '',
    (material.ambientColor.value && material.diffuseColor.value && material.specularColor.value && material.shininess.value) ? '#define USE_ADS_MATERIAL' : '',
  ].join('\n\n');

  this._buildVertex(prefix);
  this._buildFragment(prefix);
};

EZ3.GLSLProgramBuilder.prototype.buildProgram = function(gl, material) {
  this._buildConfig(material);
  return new EZ3.GLSLProgram(gl, this._vertex, this._fragment);
};
