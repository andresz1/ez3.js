EZ3.ShaderChunk = {};

EZ3.ShaderChunk['uv-main'] = [
  '#if defined( USE_DIFFUSE_TEXTURE ) || defined( USE_HEIGHT_TEXTURE ) || defined( USE_NORMAL_TEXTURE )',
  'vUV = uv;',
  '#endif'
].join('\n');

EZ3.ShaderChunk['uv-header'] = [
  '#if defined( USE_DIFFUSE_TEXTURE ) || defined( USE_HEIGHT_TEXTURE ) || defined( USE_NORMAL_TEXTURE )',
  'varying vec2 vUV;',
  '#endif'
].join('\n');

EZ3.ShaderChunk['color-main'] = [
  '#ifdef USE_COLOR',
  'color *= vec4(uColor, 1.0);',
  '#endif'
].join('\n');

EZ3.ShaderChunk['color-header'] = [
  '#ifdef USE_COLOR',
  'uniform vec3 uColor;',
  '#endif'
].join('\n');

EZ3.ShaderChunk['diffuse-texture-main'] = [
  '#ifdef USE_DIFFUSE_TEXTURE',
  'color *= texture2D(diffuseTexture, vUV);',
  '#endif'
].join('\n');

EZ3.ShaderChunk['diffuse-texture-header'] = [
  '#ifdef USE_DIFFUSE_TEXTURE',
  'uniform sampler2D diffuseTexture;',
  '#endif'
].join('\n');
