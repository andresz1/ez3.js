precision highp float;

vec4 packDepth(const in float depth) {
  const vec4 bitShift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
  const vec4 bitMask = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
  vec4 res = mod(depth * bitShift * vec4(255), vec4(256)) / vec4(255);
  res -= res.xxyz * bitMask;
  return res;
}

void main() {
  gl_FragData[0] = packDepth(gl_FragCoord.z);
}
