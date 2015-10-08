precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 uModelView;
uniform mat4 uModelViewProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat3 uNormal;
uniform mat4 uProjection;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_PointSize = 3.0;
  gl_Position = uModelViewProjection * vec4(position, 1.0);
}
