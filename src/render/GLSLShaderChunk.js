EZ3.ShaderChunk = {};

EZ3.ShaderChunk['world-space-uv-main'] = [
'#if defined( USE_DIFFUSE_TEXTURE )',
' vUV = uv;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['world-space-uv-header'] = [
'#if defined( USE_DIFFUSE_TEXTURE )',
' varying vec2 vUV;',
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

EZ3.ShaderChunk['material-color-main'] = [
'#ifdef USE_COLOR_MATERIAL',
' color *= vec4(uMaterial.color, 1.0);',
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

EZ3.ShaderChunk['eye-position-fragment-header'] = [
'#if defined( USE_PHONG_SHADING ) || defined( USE_BLINN_PHONG_SHADING ) || defined( NORMAL_MAPPING ) || defined( PARALLAX_MAPPING )',
' uniform vec3 uEyePosition;',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['phong-shading-spot-header'] = [
'#if defined( USE_PHONG_SHADING ) && (SPOT_LIGHTS > 0)',
' vec3 spotPhong() {',
' ',
' ',
' ',
' ',
' }',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['phong-shading-puntual-header'] = [
'#if defined( USE_PHONG_SHADING ) && (PUNTUAL_LIGHTS > 0)',
' vec3 puntualPhong() {',
' ',
' ',
' ',
' ',
' }',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['phong-shading-directional-header'] = [
'#if defined( USE_PHONG_SHADING ) && (DIRECTIONAL_LIGHTS > 0)',
' vec3 directionalPhong() {',
' ',
' ',
' ',
' ',
' }',
'#endif'
].join('\n\n');

EZ3.ShaderChunk['phong-shading-header'] = [

].join('\n\n');

EZ3.ShaderChunk['phong-shading-main'] = [
'#if defined(USE_PHONG_SHADING) && defined( USE_ADS_MATERIAL )',
'#endif'
].join('\n\n');
