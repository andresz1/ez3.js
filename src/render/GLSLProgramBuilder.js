/**
 * @class ShaderBuilder
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
    this._config.diffuseTexture ? '#define USE_DIFFUSE_TEXTURE' : '',

  ].join('\n\n');

  var suffixVertex = [

    'attribute vec2 uv;',
    'attribute vec3 normal;',
    'attribute vec3 vertex;',
    'attribute vec4 tangent;',
    'attribute vec3 bitangent;',

    'uniform mat4 mvpMatrix;',

    EZ3.ShaderChunk['uv-header'],

    'void main() {',

      EZ3.ShaderChunk['uv-main'],

      'gl_Position = mvpMatrix * vec4(vertex, 1.0);',
    '}'

  ].join('\n');

  this._vertex = prefixVertex + '\n\n' + suffixVertex;
};

EZ3.GLSLProgramBuilder.prototype._buildFragment = function() {
  var prefixFragment = [

    'precision highp float;',

    this._config.color ? '#define USE_COLOR' : '',
    this._config.diffuseTexture ? '#define USE_DIFFUSE_TEXTURE' : '',

  ].join('\n\n');

  var suffixFragment = [

    EZ3.ShaderChunk['uv-header'],
    EZ3.ShaderChunk['color-header'],
    EZ3.ShaderChunk['diffuse-texture-header'],

    'void main() {',
      'vec4 color = vec4(1.0);',

      EZ3.ShaderChunk['color-main'],
      EZ3.ShaderChunk['diffuse-texture-main'],

      'gl_FragColor = color;',
    '}'

  ].join('\n');

  this._fragment = prefixFragment + '\n' + suffixFragment;
};

EZ3.GLSLProgramBuilder.prototype._buildConfig = function(material) {
  this._config.color = material.color ? true : false;
  this._config.diffuseTexture = material.diffuseMap ? true : false;

  this._buildVertex();
  this._buildFragment();
};

EZ3.GLSLProgramBuilder.prototype.buildProgram = function(gl, material) {
  this._buildConfig(material);
  return new EZ3.GLSLProgram(gl, this._vertex, this._fragment);
};
