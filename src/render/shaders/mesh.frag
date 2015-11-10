precision highp float;

#extension GL_OES_standard_derivatives : enable

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

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

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
	uniform samplerCube uEnvironmentSampler;
#endif

#ifdef REFRACTION
	uniform float uRefractFactor;
#endif

#if defined(COOK_TORRANCE) && defined(OREN_NAYAR)
	uniform float uAlbedo;
	uniform float uFresnel;
	uniform float uRoughness;
#elif defined(COOK_TORRANCE)
	uniform float uFresnel;
	uniform float uRoughness;
#elif defined(OREN_NAYAR)
	uniform float uAlbedo;
	uniform float uRoughness;
#endif

#ifdef LAMBERT
float lambert(vec3 s, vec3 n)
{
	return max(dot(s, n), 0.0);
}
#endif

#ifdef OREN_NAYAR
float orenNayar(vec3 v, vec3 s, vec3 n)
{
	float PI = acos(-1.0);

	float SdotV = dot(s, v);
	float SdotN = dot(s, n);
	float NdotV = dot(n, v);

	float S = SdotV - SdotN * NdotV;
	float T = mix(1.0, max(SdotN, NdotV), step(0.0, S));
	float sigma2 = uRoughness * uRoughness;

	float A = 1.0 + sigma2 * (uAlbedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);

	return uAlbedo * max(0.0, SdotN) * (A + B * S / T) / PI;
}
#endif

#ifdef PHONG
float phong(vec3 v, vec3 s, vec3 n)
{
	vec3 r = reflect(-s, n);
	return pow(max(dot(r, v), 0.0), uShininess);
}
#endif

#ifdef BLINN_PHONG
float blinnPhong(vec3 v, vec3 s, vec3 n)
{
	vec3 h = normalize(s + v);
	return pow(max(dot(h, n), 0.0), uShininess);
}
#endif

#ifdef COOK_TORRANCE
float beckmannDistribution(float NdotH, float roughness)
{
	float PI = acos(-1.0);
	float cos2Beta = NdotH * NdotH;
	float tan2Beta = (cos2Beta - 1.0) / cos2Beta;
	float div =  PI * roughness * roughness * cos2Beta * cos2Beta;
	return exp(tan2Beta / (roughness * roughness)) / div;
}

float cookTorrance(vec3 v, vec3 s, vec3 n)
{
	vec3 h = normalize(s + v);

	float VdotN = max(dot(v, n), 0.0);
	float SdotN = max(dot(s, n), 0.0);
	float VdotH = max(dot(v, h), 0.0);
	float SdotH = max(dot(s, h), 0.0);
	float NdotH = max(dot(n, h), 0.0);

	float G1 = (2.0 * NdotH * VdotN) / VdotH;
	float G2 = (2.0 * NdotH * SdotN) / SdotH;
	float G = min(1.0, min(G1, G2));

	float D = beckmannDistribution(NdotH, uRoughness);
	float F = pow(1.0 - VdotN, uFresnel);
	float PI = acos(-1.0);

  return  G * F * D / max(PI * VdotN, 0.0);
}
#endif

#ifdef NORMAL_MAP
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

		#ifdef LAMBERT
			float q = lambert(s, n);
		#endif

		#ifdef OREN_NAYAR
			float q = orenNayar(v, s, n);
		#endif

		if (q > 0.0) {
			#ifdef BLINN_PHONG
				float w = blinnPhong(v, s, n);
			#endif

			#ifdef COOK_TORRANCE
				float w = cookTorrance(v, s, n);
			#endif

			#ifdef PHONG
				float w = phong(v, s, n);
			#endif

			diffuse += uPointLights[i].diffuse * uDiffuse * q;
			specular += uPointLights[i].specular * uSpecular * w;
		}
  }
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++)
  {
		vec3 s = uDirectionalLights[i].direction;

		#ifdef LAMBERT
			float q = lambert(s, n);
		#endif

		#ifdef OREN_NAYAR
			float q = orenNayar(v, s, n);
		#endif

		if (q > 0.0) {
			#ifdef BLINN_PHONG
				float w = blinnPhong(v, s, n);
			#endif

			#ifdef COOK_TORRANCE
				float w = cookTorrance(v, s, n);
			#endif

			#ifdef PHONG
				float w = phong(v, s, n);
			#endif

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

			s = uSpotLights[i].direction;

			#ifdef LAMBERT
				float q = lambert(s, n);
			#endif

			#ifdef OREN_NAYAR
				float q = orenNayar(v, s, n);
			#endif

			if (q > 0.0) {
				#ifdef BLINN_PHONG
					float w = blinnPhong(v, s, n);
				#endif

				#ifdef COOK_TORRANCE
					float w = cookTorrance(v, s, n);
				#endif

				#ifdef PHONG
					float w = phong(v, s, n);
				#endif

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
	diffuse *= texture2D(uDiffuseSampler, vUv, 0.0).rgb;
#endif

#ifdef SPECULAR_MAP
	specular *= vec3(texture2D(uSpecularSampler, vUv));
#endif

#ifdef REFLECTION
	vec3 reflection = reflect(-v, n);
	diffuse *= textureCube(uEnvironmentSampler, reflection, 0.0).rgb;
#endif

#ifdef REFRACTION
	vec3 refraction = refract(-v, n, uRefractFactor);
	diffuse *= textureCube(uEnvironmentSampler, refraction, 0.0).rgb;
#endif

  gl_FragColor = vec4(emissive + diffuse + specular, 1.0);
}
