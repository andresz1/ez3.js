precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 uModel;
uniform mat3 uNormal;
uniform mat4 uModelView;
uniform mat4 uProjection;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vPosition = vec3(uModel * vec4(position, 1.0));
  vNormal = normalize(uNormal * normal);
  vUv = uv;

  gl_PointSize = 3.0;
  gl_Position = uProjection * uModelView * vec4(position, 1.0);
}
