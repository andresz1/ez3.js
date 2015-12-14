precision highp float;

struct PointLight {
	vec3 position;
	vec3 diffuse;
	vec3 specular;
	float shadowBias;
	float shadowDarkness;
};

struct DirectionalLight {
	vec3 direction;
	vec3 diffuse;
	vec3 specular;
	mat4 shadow;
	float shadowBias;
	float shadowDarkness;
};

struct SpotLight {
	vec3 position;
	vec3 direction;
	float cutoff;
	vec3 diffuse;
	vec3 specular;
	mat4 shadow;
	float shadowBias;
	float shadowDarkness;
};

uniform vec3 uEmissive;
uniform vec3 uDiffuse;
uniform vec3 uSpecular;
uniform float uShininess;
uniform float uOpacity;
uniform vec3 uEyePosition;

#if MAX_POINT_LIGHTS > 0
  uniform PointLight uPointLights[MAX_POINT_LIGHTS];

	#ifdef SHADOW_MAP
		uniform samplerCube uPointShadowSampler[MAX_POINT_LIGHTS];
	#endif
#endif

#if MAX_DIRECTIONAL_LIGHTS > 0
  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];

	#ifdef SHADOW_MAP
		uniform sampler2D uDirectionalShadowSampler[MAX_DIRECTIONAL_LIGHTS];
	#endif
#endif

#if MAX_SPOT_LIGHTS > 0
  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];

	#ifdef SHADOW_MAP
		uniform sampler2D uSpotShadowSampler[MAX_SPOT_LIGHTS];
	#endif
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
	uniform float uRefractiveIndex;
#endif

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

#ifdef LAMBERT
	float lambert(in vec3 s, in vec3 n) {
		return max(dot(s, n), 0.0);
	}
#endif

#ifdef OREN_NAYAR
	uniform float uAlbedo;
	uniform float uDiffuseRoughness;

	float orenNayar(in vec3 v, in vec3 s, in vec3 n) {
		float PI = acos(-1.0);

		float SdotV = dot(s, v);
		float SdotN = dot(s, n);
		float NdotV = dot(n, v);

		float S = SdotV - SdotN * NdotV;
		float T = mix(1.0, max(SdotN, NdotV), step(0.0, S));
		float sigma2 = uDiffuseRoughness * uDiffuseRoughness;

		float A = 1.0 + sigma2 * (uAlbedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
		float B = 0.45 * sigma2 / (sigma2 + 0.09);

		return uAlbedo * max(0.0, SdotN) * (A + B * S / T) / PI;
	}
#endif

#ifdef PHONG
	float phong(in vec3 v, in vec3 s, in vec3 n) {
		return pow(max(dot(reflect(-s, n), v), 0.0), uShininess);
	}
#endif

#ifdef BLINN_PHONG
	float blinnPhong(in vec3 v, in vec3 s, in vec3 n) {
		return pow(max(dot(normalize(s + v), n), 0.0), uShininess);
	}
#endif

#ifdef COOK_TORRANCE
	uniform float uFresnel;
	uniform float uSpecularRoughness;

	float beckmannDistribution(in float NdotH) {
		float PI = acos(-1.0);
		float cos2Beta = NdotH * NdotH;
		float tan2Beta = (cos2Beta - 1.0) / cos2Beta;
		float div =  PI * uSpecularRoughness * uSpecularRoughness * cos2Beta * cos2Beta;

		return exp(tan2Beta / (uSpecularRoughness * uSpecularRoughness)) / div;
	}

	float cookTorrance(in vec3 v, in vec3 s, in vec3 n) {
		vec3 h = normalize(s + v);

		float VdotN = max(dot(v, n), 0.000001);
		float SdotN = max(dot(s, n), 0.000001);
		float VdotH = max(dot(v, h), 0.000001);
		float SdotH = max(dot(s, h), 0.000001);
		float NdotH = max(dot(n, h), 0.000001);

		float G1 = (2.0 * NdotH * VdotN) / VdotH;
		float G2 = (2.0 * NdotH * SdotN) / SdotH;
		float G = min(1.0, min(G1, G2));

		float D = beckmannDistribution(NdotH);
		float F = pow(1.0 - VdotN, uFresnel);
		float PI = acos(-1.0);

	  return  G * F * D / max(PI * VdotN, 0.0);
	}
#endif

#ifdef NORMAL_MAP
	#extension GL_OES_standard_derivatives : enable

	uniform sampler2D uNormalSampler;

	vec3 pertubNormal(in vec3 v) {
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

#ifdef SHADOW_MAP
	bool isBounded(in float coordinate) {
		return coordinate >= 0.0 && coordinate <= 1.0;
	}

	float unpack(in vec4 color) {
		const vec4 bitShift = vec4(1.0 / (255.0 * 255.0 * 255.0), 1.0 / (255.0 * 255.0), 1.0 / 255.0, 1.0);
	  return dot(color, bitShift);
	}

	#if (MAX_POINT_LIGHTS > 0)
		float omnidirectionalShadow(in vec3 lightPosition, in float bias, in float darkness, in samplerCube sampler) {
			vec3 direction = vPosition - lightPosition;
			float vertexDepth = clamp(length(direction), 0.0, 1.0);
			float shadowMapDepth = unpack(textureCube(sampler, direction)) + bias;

			return (vertexDepth > shadowMapDepth) ? darkness : 1.0;
		}
	#endif

	#if (MAX_DIRECTIONAL_LIGHTS > 0) || (MAX_SPOT_LIGHTS > 0)
		float directionalShadow(in mat4 shadowMatrix, in float bias, in float darkness, in sampler2D sampler) {
			vec4 lightCoordinates = shadowMatrix * vec4(vPosition, 1.0);
			vec3 shadowCoordinates = lightCoordinates.xyz / lightCoordinates.w;

			if(isBounded(shadowCoordinates.x) && isBounded(shadowCoordinates.y) && isBounded(shadowCoordinates.z)) {
				float vertexDepth = shadowCoordinates.z;
				float shadowMapDepth = unpack(texture2D(sampler, shadowCoordinates.xy)) + bias;

				return (vertexDepth > shadowMapDepth) ? darkness : 1.0;
			}

			return 1.0;
		}
	#endif
#endif

float computeDiffuseReflection(in vec3 v, in vec3 s, in vec3 n) {
	float diffuse = 1.0;

	#ifdef LAMBERT
		diffuse = lambert(s, n);
	#endif

	#ifdef OREN_NAYAR
		diffuse = orenNayar(v, s, n);
	#endif

	return diffuse;
}

float computeSpecularReflection(in vec3 v, in vec3 s, in vec3 n) {
	float specular = 1.0;

	#ifdef BLINN_PHONG
		specular = blinnPhong(v, s, n);
	#endif

	#ifdef COOK_TORRANCE
		specular = cookTorrance(v, s, n);
	#endif

	#ifdef PHONG
		specular = phong(v, s, n);
	#endif

	return specular;
}

void main() {
	float shadow = 1.0;

	float diffuseReflection;
	float specularReflection;

	vec3 emissive = uEmissive;
	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);

	vec3 v = normalize(uEyePosition - vPosition);

	#ifdef FLAT
		vec3 fdx = dFdx(vPosition);
		vec3 fdy = dFdy(vPosition);
		vec3 n = normalize(cross(fdx, fdy));
	#else
		vec3 n = vNormal;
	#endif

	#ifdef NORMAL_MAP
		n = pertubNormal(-v);
	#endif

	#if MAX_POINT_LIGHTS > 0
	  for(int i = 0; i < MAX_POINT_LIGHTS; i++) {
			vec3 s = normalize(uPointLights[i].position - vPosition);

			diffuseReflection = computeDiffuseReflection(v, s, n);

			if (diffuseReflection > 0.0) {

				specularReflection = computeSpecularReflection(v, s, n);

				#ifdef SHADOW_MAP
					vec3 lightPosition = uPointLights[i].position;
					float shadowBias = uPointLights[i].shadowBias;
					float shadowDarkness = uPointLights[i].shadowDarkness;

					shadow = omnidirectionalShadow(lightPosition, shadowBias, shadowDarkness, uPointShadowSampler[i]);
				#endif

				diffuse += uPointLights[i].diffuse * uDiffuse * diffuseReflection * shadow;
				specular += uPointLights[i].specular * uSpecular * specularReflection * shadow;
			}
	  }
	#endif

	#if MAX_DIRECTIONAL_LIGHTS > 0
	  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {
			vec3 s = uDirectionalLights[i].direction;

			diffuseReflection = computeDiffuseReflection(v, s, n);

			if (diffuseReflection > 0.0) {

				specularReflection = computeSpecularReflection(v, s, n);

				#ifdef SHADOW_MAP
					mat4 shadowMatrix = uDirectionalLights[i].shadow;
					float shadowBias = uDirectionalLights[i].shadowBias;
					float shadowDarkness = uDirectionalLights[i].shadowDarkness;

					shadow = directionalShadow(shadowMatrix, shadowBias, shadowDarkness, uDirectionalShadowSampler[i]);
				#endif

				diffuse += uDirectionalLights[i].diffuse * uDiffuse * diffuseReflection * shadow;
				specular += uDirectionalLights[i].specular * uSpecular * specularReflection * shadow;
			}
	  }
	#endif

	#if MAX_SPOT_LIGHTS > 0
	  for(int i = 0; i < MAX_SPOT_LIGHTS; i++) {
			vec3 s = normalize(uSpotLights[i].position - vPosition);
			float angle = max(dot(s, uSpotLights[i].direction), 0.0);

			if(angle > uSpotLights[i].cutoff) {

				diffuseReflection = computeDiffuseReflection(v, s, n);

				if (diffuseReflection > 0.0) {

					specularReflection = computeSpecularReflection(v, s, n);

					#ifdef SHADOW_MAP
						mat4 shadowMatrix = uSpotLights[i].shadow;
						float shadowBias = uSpotLights[i].shadowBias;
						float shadowDarkness = uSpotLights[i].shadowDarkness;

						shadow = directionalShadow(shadowMatrix, shadowBias, shadowDarkness, uSpotShadowSampler[i]);
					#endif

					diffuse += uSpotLights[i].diffuse * uDiffuse * diffuseReflection * shadow;
					specular += uSpotLights[i].specular * uSpecular * specularReflection * shadow;
				}
			}
	  }
	#endif

	#ifdef EMISSIVE_MAP
	  emissive *= texture2D(uEmissiveSampler, vUv).rgb;
	#endif

	#ifdef DIFFUSE_MAP
		diffuse *= texture2D(uDiffuseSampler, vUv).rgb;
	#endif

	#ifdef SPECULAR_MAP
		specular *= texture2D(uSpecularSampler, vUv).rgb;
	#endif

	#ifdef REFLECTION
		vec3 reflection = reflect(-v, n);
		diffuse *= textureCube(uEnvironmentSampler, reflection).rgb;
	#endif

	#ifdef REFRACTION
		vec3 refraction = refract(-v, n, uRefractiveIndex);
		diffuse *= textureCube(uEnvironmentSampler, refraction).rgb;
	#endif

	gl_FragColor = vec4(emissive + diffuse + specular, uOpacity);
}
