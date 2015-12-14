precision highp float;

vec4 pack(const in float depth) {
  const vec4 bitShift = vec4(255.0 * 255.0 * 255.0, 255.0 * 255.0, 255.0, 1.0);
	const vec4 bitMask = vec4(0.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);

	vec4 res = fract(depth * bitShift);
	res -= res.xxyz * bitMask;

	return res;
}

void main() {
  gl_FragColor = pack(gl_FragCoord.z);
}
