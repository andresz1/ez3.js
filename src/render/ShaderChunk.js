EZ3.ShaderChunk = {};

EZ3.ShaderChunk['world-space-uv-main'] = [
'#if defined( USE_DIFFUSE_TEXTURE ) || defined( USE_HEIGHT_TEXTURE ) || defined( USE_NORMAL_TEXTURE )',
' vUV = uv;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['world-space-uv-header'] = [
'#if defined( USE_DIFFUSE_TEXTURE ) || defined( USE_HEIGHT_TEXTURE ) || defined( USE_NORMAL_TEXTURE )',
' varying vec2 vUV;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['world-space-vertex-main'] = [
'#ifdef USE_WORLD_SPACE_VERTEX',
' vVertex = uModelMatrix * vec4(vertex, 1.0);',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['world-space-vertex-header'] = [
'#ifdef USE_WORLD_SPACE_VERTEX',
' varying vec3 vVertex;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['material-header'] = [
'#if defined( USE_ADS_MATERIAL ) && defined( USE_COLOR_MATERIAL )',
' struct sMaterial {',
'   vec3 color;',
'   vec3 ambient;',
'   vec3 diffuse;',
'   vec3 specular;',
'   float shininess;',
' };',
' uniform sMaterial uMaterial;',
'#elif defined( USE_ADS_MATERIAL )',
' struct sMaterial {',
'   vec3 ambient;',
'   vec3 diffuse;',
'   vec3 specular;',
'   float shininess;',
' };',
' uniform sMaterial uMaterial;',
'#else',
' struct sMaterial {',
'   vec3 color;',
' };',
' uniform sMaterial uMaterial;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['material-ads-main'] = [
'#ifdef USE_ADS_MATERIAL',
'',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['material-color-main'] = [
'#ifdef USE_COLOR_MATERIAL',
' color *= vec4(uMaterial.color, 1.0);',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['height-texture-main'] = [
'#ifdef USE_HEIGHT_TEXTURE',
' float height = texture2D(uHeightTexture, vUV).r;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['height-texture-header'] = [
'#ifdef USE_HEIGHT_TEXTURE',
' uniform sampler2D uHeightTexture;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['normal-texture-main'] = [
'#ifdef USE_NORMAL_TEXTURE',
' vec3 tsNormal = texture2D(uNormalTexture, vUV).rgb;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['normal-texture-header'] = [
'#ifdef USE_NORMAL_TEXTURE',
' uniform sampler2D uNormalTexture;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['diffuse-texture-main'] = [
'#ifdef USE_DIFFUSE_TEXTURE',
' color *= texture2D(uDiffuseTexture, vUV);',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['diffuse-texture-header'] = [
'#ifdef USE_DIFFUSE_TEXTURE',
' uniform sampler2D uDiffuseTexture;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['tangent-space-matrix-main'] = [
'#ifdef USE_TANGENT_SPACE_MATRIX',
' vec3 nNormal = uNormalMatrix * normal;',
' vec3 nBitangent = uNormalMatrix * binormal;',
' vec3 nTangent = uNormalMatrix * tangent.rgb;',
' vTBNMatrix = transpose(mat3(nTangent, nBitangent, nNormal));',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['tangent-space-matrix-header'] = [
'#ifdef USE_TANGENT_SPACE_MATRIX',
' varying mat3 vTBNMatrix;',
'#endif'
].join('\n\n');
