precision highp float;

struct PointLight
{
	vec3 position;
	vec3 diffuse;
	vec3 specular;
};

struct DirectionalLight
{
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
};

struct SpotLight
{
	vec3 position;
	vec3 direction;
	float cutoff;
	vec3 diffuse;
	vec3 specular;
};

uniform vec3 uEmissive;
uniform vec3 uDiffuse;
uniform vec3 uSpecular;
uniform float uShininess;

uniform vec3 uEyePosition;

#if MAX_POINT_LIGHTS > 0
  uniform PointLight uPointLights[MAX_POINT_LIGHTS];
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];
#endif

#if MAX_SPOT_LIGHTS > 0
  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];
#endif

#ifdef EMISSIVE_MAP
	uniform sampler2D uEmissiveSampler;
#endif

#ifdef DIFFUSE_MAP
	uniform sampler2D uDiffuseSampler;
#endif

#ifdef SPECULAR_MAP
	uniform sampler2D uSpecularSampler;
#endif

#ifdef ENVIRONMENT_MAP
	uniform float reflectFactor;
	uniform samplerCube uEnvironmentSampler;
#endif

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

#ifdef NORMAL_MAP
#extension GL_OES_standard_derivatives : enable

uniform sampler2D uNormalSampler;

vec3 pertubNormal(vec3 v) {
	vec3 q0 = dFdx(v);
	vec3 q1 = dFdy(v);

	vec2 st0 = dFdx(vUv);
	vec2 st1 = dFdy(vUv);

	vec3 s = normalize(q0 * st1.t - q1 * st0.t);
	vec3 t = normalize(-q0 * st1.s + q1 * st0.s);
	vec3 n = normalize(vNormal);

	vec3 d = texture2D(uNormalSampler, vUv).xyz * 2.0 - 1.0;

	return normalize(mat3(s, t, n) * d);
}
#endif

void main() {
	vec3 emissive = uEmissive;
	vec3 diffuse = vec3(0.0, 0.0, 0.0);
	vec3 specular = vec3(0.0, 0.0, 0.0);

	vec3 v = normalize(uEyePosition - vPosition);

#ifdef NORMAL_MAP
	vec3 n = pertubNormal(-v);
#else
	vec3 n = vNormal;
#endif

#if MAX_POINT_LIGHTS > 0
  for(int i = 0; i < MAX_POINT_LIGHTS; i++)
  {
    vec3 s = normalize(uPointLights[i].position - vPosition);
		float q = max(dot(s, n), 0.0);

		if (q > 0.0) {
			vec3 r = reflect(-s, n);
			float w = pow(max(dot(r, v), 0.0), uShininess);

    	diffuse += uPointLights[i].diffuse * uDiffuse * q;
			specular += uPointLights[i].specular * uSpecular * w;
		}
  }
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++)
  {
		float q = max(dot(uDirectionalLights[i].direction, n), 0.0);

		if (q > 0.0) {
			vec3 r = reflect(-uDirectionalLights[i].direction, n);
			float w = pow(max(dot(r, v), 0.0), uShininess);

    	diffuse += uDirectionalLights[i].diffuse * uDiffuse * q;
			specular += uDirectionalLights[i].specular * uSpecular * w;
		}
  }
#endif

#if MAX_SPOT_LIGHTS > 0
  for(int i = 0; i < MAX_SPOT_LIGHTS; i++)
  {
		vec3 s = normalize(uSpotLights[i].position - vPosition);
		float angle = max(dot(s, uSpotLights[i].direction), 0.0);

		if(angle > uSpotLights[i].cutoff) {
			float q = max(dot(uSpotLights[i].direction, n), 0.0);

			if (q > 0.0) {
				vec3 r = reflect(-s, n);
				float w = pow(max(dot(r, v), 0.0), uShininess);

				diffuse += uSpotLights[i].diffuse * uDiffuse * q;
				specular += uSpotLights[i].specular * uSpecular * w;
			}
		}
  }
#endif

#ifdef EMISSIVE_MAP
  emissive *= vec3(texture2D(uEmissiveSampler, vUv));
#endif

#ifdef DIFFUSE_MAP
	diffuse *= vec3(texture2D(uDiffuseSampler, vUv));
#endif

#ifdef SPECULAR_MAP
	specular *= vec3(texture2D(uSpecularSampler, vUv))
#endif

#ifdef ENVIRONMENT_MAP
#ifdef REFLECTION
vec3 r = reflect(-v, n);
diffuse = textureCube(uEnvironmentSampler, r).rgb;
#endif
#endif

  gl_FragColor = vec4(emissive + diffuse + specular, 1.0);
}
