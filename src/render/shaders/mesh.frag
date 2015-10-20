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
	float exponent;
	float cutoff;
	vec3 diffuse;
	vec3 specular;
};

#if MAX_POINT_LIGHTS > 0
  uniform PointLight uPointLights[MAX_POINT_LIGHTS];
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];
#endif

#if MAX_SPOT_LIGHTS > 0
  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];
#endif

uniform vec3 uEmissiveColor;
#ifdef EMISSIVE
uniform sampler2D uEmissiveSampler;
#endif

uniform vec3 uEyePosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

#ifdef NORMAL
#extension GL_OES_standard_derivatives : enable

uniform sampler2D uNormalSampler;

mat3 cotangent_frame(vec3 normal, vec3 p, vec2 uv)
{
	// get edge vectors of the pixel triangle
	vec3 dp1 = dFdx(p);
	vec3 dp2 = dFdy(p);
	vec2 duv1 = dFdx(uv);
	vec2 duv2 = dFdy(uv);

	// solve the linear system
	vec3 dp2perp = cross(dp2, normal);
	vec3 dp1perp = cross(normal, dp1);
	vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;
	vec3 binormal = dp2perp * duv1.y + dp1perp * duv2.y;

	// construct a scale-invariant frame
	float invmax = inversesqrt(max(dot(tangent, tangent), dot(binormal, binormal)));
	return mat3(tangent * invmax, binormal * invmax, normal);
}

vec3 perturbNormal(vec3 viewDir)
{
	vec3 map = texture2D(uNormalSampler, vUv).xyz;
	map = map * 255. / 127. - 128. / 127.;
	mat3 TBN = cotangent_frame(vNormal, -viewDir, vUv);
	return normalize(TBN * map);
}

#endif

void main() {
  vec3 color = uEmissiveColor;

#ifdef EMISSIVE
  color = vec3(texture2D(uEmissiveSampler, vUv));
#endif

vec3 v = normalize(uEyePosition - vPosition);

#ifdef NORMAL
	vec3 n = perturbNormal(-v);
#else
	vec3 n = vNormal;
#endif


#if MAX_POINT_LIGHTS > 0
  for(int i = 0; i < MAX_POINT_LIGHTS; i++)
  {
    vec3 s = normalize(uPointLights[i].position - vPosition);
		vec3 r = reflect(-s, n);
		float diffuse = max(dot(s, n), 0.0);

		if (diffuse > 0.0) {
    	color += uPointLights[i].diffuse * uEmissiveColor * diffuse;
			color += uPointLights[i].specular * pow(max(dot(r, v), 0.0), 130.0);
		}
  }
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++)
  {
		vec3 r = reflect(-uDirectionalLights[i].direction, n);
		float diffuse = max(dot(uDirectionalLights[i].direction, n), 0.0);

		if (diffuse > 0.0) {
    	color += uDirectionalLights[i].diffuse * uEmissiveColor * diffuse;
			color += uDirectionalLights[i].specular * pow(max(dot(r, v), 0.0), 130.0);
		}
  }
#endif

#if MAX_SPOT_LIGHTS > 0
  for(int i = 0; i < MAX_SPOT_LIGHTS; i++)
  {
		vec3 s = normalize(uSpotLights[i].position - vPosition);
		vec3 r = reflect(-s, n);

		float angle = max(dot(s, uSpotLights[i].direction), 0.0);

		if(angle > uSpotLights[i].cutoff) {
			float diffuse = max(dot(uSpotLights[i].direction, n), 0.0);

			if (diffuse > 0.0) {
				color += uSpotLights[i].diffuse * uEmissiveColor * diffuse;
				color += uSpotLights[i].specular * pow(max(dot(r, v), 0.0), 130.0);
			}
		}
  }
#endif

  gl_FragColor = vec4(color, 1.0);
}
