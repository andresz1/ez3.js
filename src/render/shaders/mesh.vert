precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

attribute vec3 morph1;
attribute vec3 morph2;

uniform mat4 uModel;
uniform mat3 uNormal;
uniform mat4 uModelView;
uniform mat4 uProjection;

#ifdef MORPH_TARGET
  uniform float uInfluence1;
  uniform float uInfluence2;
#endif

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 transformed = position;

  #ifdef MORPH_TARGET
    transformed += (morph1 - position) * uInfluence1;
    transformed += (morph2 - position) * uInfluence2;
  #endif

  vPosition = vec3(uModel * vec4(transformed, 1.0));
  vNormal = normalize(uNormal * normal);
  vUv = uv;


  gl_PointSize = 3.0;
  gl_Position = uProjection * uModelView * vec4(transformed, 1.0);
}
