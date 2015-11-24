precision highp float;

attribute vec3 position;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uModelView * vec4(position, 1.0);
}
