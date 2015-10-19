precision highp float;

struct PointLight
{
	vec3 position;
	vec3 diffuse;
	vec3 specular;
};

#if MAX_POINT_LIGHTS > 0
  uniform PointLight uPointLights[MAX_POINT_LIGHTS];
#endif

uniform vec3 uEmissiveColor;
#ifdef EMISSIVE
uniform sampler2D uEmissiveSampler;
#endif

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 color = uEmissiveColor;

#ifdef EMISSIVE
  color = vec3(texture2D(uEmissiveSampler, vUv));
#endif

#if MAX_POINT_LIGHTS > 0
  for(int i = 0; i < MAX_POINT_LIGHTS; i++)
  {
    vec3 s = normalize(uPointLights[i].position - vPosition);

    color += uPointLights[i].diffuse * max(dot(s, vNormal), 0.0);
  }
#endif

  gl_FragColor = vec4(color, 1.0);
}
