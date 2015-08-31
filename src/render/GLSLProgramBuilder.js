/**
 * @class GLSLProgramBuilder
 */

EZ3.GLSLProgramBuilder = function() {
  this._config = {};
  this._vertex = null;
  this._fragment = null;
};

EZ3.GLSLProgramBuilder.prototype.constructor = EZ3.ShaderBuilder;

EZ3.GLSLProgramBuilder.prototype._buildVertex = function() {
  var prefixVertex = [
    'precision highp float;',

    this._config.adsMaterial ? '#define USE_ADS_MATERIAL' : '',
    this._config.colorMaterial ? '#define USE_COLOR_MATERIAL' : '',
    this._config.heightTexture ? '#define USE_HEIGHT_TEXTURE' : '',
    this._config.normalTexture ? '#define USE_NORMAL_TEXTURE' : '',
    this._config.diffuseTexture ? '#define USE_DIFFUSE_TEXTURE' : '',

  ].join('\n');

  var suffixVertex = [
    'attribute vec2 uv;',
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
    EZ3.ShaderChunk['world-space-vertex-header'],

    EZ3.ShaderChunk['tangent-space-matrix-header'],

    'void main() {',

    EZ3.ShaderChunk['world-space-uv-main'],
    EZ3.ShaderChunk['world-space-vertex-main'],

    EZ3.ShaderChunk['tangent-space-matrix-main'],

    ' gl_Position = uMvpMatrix * vec4(vertex, 1.0);',
    '}'
  ].join('\n\n');

  this._vertex = prefixVertex + '\n\n' + suffixVertex;
};

EZ3.GLSLProgramBuilder.prototype._buildFragment = function() {
  var prefixFragment = [
    'precision highp float;',
    this._config.adsMaterial ? '#define USE_ADS_MATERIAL' : '',
    this._config.colorMaterial ? '#define USE_COLOR_MATERIAL' : '',
    this._config.heightTexture ? '#define USE_HEIGHT_TEXTURE' : '',
    this._config.normalTexture ? '#define USE_NORMAL_TEXTURE' : '',
    this._config.diffuseTexture ? '#define USE_DIFFUSE_TEXTURE' : '',
  ].join('\n');

  var suffixFragment = [
    EZ3.ShaderChunk['world-space-uv-header'],
    EZ3.ShaderChunk['world-space-vertex-header'],

    EZ3.ShaderChunk['material-header'],

    EZ3.ShaderChunk['height-texture-header'],
    EZ3.ShaderChunk['normal-texture-header'],
    EZ3.ShaderChunk['diffuse-texture-header'],

    EZ3.ShaderChunk['tangent-space-matrix-header'],

    'void main() {',
    ' vec4 color = vec4(1.0);',

    EZ3.ShaderChunk['material-ads-main'],
    EZ3.ShaderChunk['material-color-main'],

    EZ3.ShaderChunk['height-texture-main'],
    EZ3.ShaderChunk['normal-texture-main'],
    EZ3.ShaderChunk['diffuse-texture-main'],

    ' gl_FragColor = color;',
    '}'
  ].join('\n\n');

  this._fragment = prefixFragment + '\n\n' + suffixFragment;
};

EZ3.GLSLProgramBuilder.prototype._buildConfig = function(material) {

  this._config.heightTexture = material.heightTexture.map ? true : false;
  this._config.normalTexture = material.normalTexture.map ? true : false;
  this._config.diffuseTexture = material.diffuseTexture.map ? true : false;

  this._config.colorMaterial = material.color.value ? true : false;

  this._config.adsMaterial =
  ( material.ambientColor.value  &&
    material.diffuseColor.value  &&
    material.specularColor.value &&
    material.shininess ) ? true : false;

  this._buildVertex();
  this._buildFragment();
};

EZ3.GLSLProgramBuilder.prototype.buildProgram = function(gl, material) {
  this._buildConfig(material);
  return new EZ3.GLSLProgram(gl, this._vertex, this._fragment);
};
