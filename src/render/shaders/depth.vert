precision highp float;

attribute vec3 position;

uniform mat4 uLightWVP;

void main() {
  gl_Position = uLightWVP * vec4(position, 1.0);
}
