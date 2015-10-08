precision highp float;

uniform vec3 uEmissiveColor;

#ifdef EMISSIVE
uniform sampler2D uEmissiveSampler;
#endif

varying vec2 vUv;

void main() {
  vec3 color = uEmissiveColor;

#ifdef EMISSIVE
  color = vec3(texture2D(uEmissiveSampler, vUv));
#endif

  gl_FragColor = vec4(color, 1.0);
}
