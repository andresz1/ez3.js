/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this);

  this.emissive = new EZ3.Vector3();
  this.diffuse = new EZ3.Vector3(0.8, 0.8, 0.8);
  this.specular = new EZ3.Vector3(0.2, 0.2, 0.2);

  this.normalMap = null;
  this.diffuseMap = null;
  this.emissiveMap = null;
  this.specularMap = null;
  this.environmentMap = null;

  this.reflective = false;
  this.refractive = false;

  this.diffuseReflection = EZ3.MeshMaterial.LAMBERT;
  this.specularReflection = EZ3.MeshMaterial.PHONG;

  this.shadowCaster = false;
  this.shadowReceiver = false;

  this.albedoFactor = 7.0;
  this.fresnelFactor = 0.0;
  this.refractFactor = 1.0;
  this.roughnessFactor = 0.2;
  this.shininessFactor = 180.1;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, state, lights) {
  var id = EZ3.Material.MESH;
  var defines = [];
  var prefix = '#define ';

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR)
    defines.push('OREN_NAYAR');
  else
    defines.push('LAMBERT');

  if(this.specularReflection === EZ3.MeshMaterial.BLINN_PHONG)
    defines.push('BLINN_PHONG');
  else if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE)
    defines.push('COOK_TORRANCE');
  else
    defines.push('PHONG');

  if (this.emissiveMap instanceof EZ3.Texture2D)
    defines.push('EMISSIVE_MAP');

  if (this.diffuseMap instanceof EZ3.Texture2D)
    defines.push('DIFFUSE_MAP');

  if (this.normalMap instanceof EZ3.Texture2D)
    defines.push('NORMAL_MAP');

  if(this.environmentMap instanceof EZ3.Cubemap) {
    defines.push('ENVIRONMENT_MAP');

    if(this.reflective)
      defines.push('REFLECTION');

    if(this.refractive)
      defines.push('REFRACTION');
  }

  if(this.shadowReceiver)
    defines.push('SHADOW_MAP');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (this._id !== id) {
    this._id = id;

    if (!state.programs[id]) {
      this.program = new EZ3.GLSLProgram(gl, EZ3.ShaderLibrary.mesh.vertex, EZ3.ShaderLibrary.mesh.fragment, prefix);
      state.programs[id] = this.program;
    } else
      this.program = state.programs[id];
  }
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state) {
  this.program.loadUniformFloat(gl, 'uEmissive', this.emissive);
  this.program.loadUniformFloat(gl, 'uDiffuse', this.diffuse);
  this.program.loadUniformFloat(gl, 'uSpecular', this.specular);
  this.program.loadUniformFloat(gl, 'uShininess', this.shininessFactor);

  if (this.emissiveMap instanceof EZ3.Texture2D) {
    this.emissiveMap.bind(gl, state);
    this.emissiveMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEmissiveSampler', state.usedTextureSlots++);
  }

  if (this.diffuseMap instanceof EZ3.Texture2D) {
    this.diffuseMap.bind(gl, state);
    this.diffuseMap.update(gl);

    this.program.loadUniformInteger(gl, 'uDiffuseSampler', state.usedTextureSlots++);
  }

  if (this.normalMap instanceof EZ3.Texture2D) {
    this.normalMap.bind(gl, state);
    this.normalMap.update(gl);

    this.program.loadUniformInteger(gl, 'uNormalSampler', state.usedTextureSlots++);
  }

  if(this.environmentMap instanceof EZ3.Cubemap) {
    this.environmentMap.bind(gl, state);
    this.environmentMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEnvironmentSampler', state.usedTextureSlots++);
  }

  if(this.refractive)
    this.program.loadUniformFloat(gl, 'uRefractFactor', this.refractFactor);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR) {
    this.program.loadUniformFloat(gl, 'uAlbedo', this.albedoFactor);
    this.program.loadUniformFloat(gl, 'uRoughness', this.roughnessFactor);
  }

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE) {
    this.program.loadUniformFloat(gl, 'uFresnel', this.fresnelFactor);
    this.program.loadUniformFloat(gl, 'uRoughness', this.roughnessFactor);
  }
};

EZ3.MeshMaterial.LAMBERT = 0;
EZ3.MeshMaterial.OREN_NAYAR = 1;
EZ3.MeshMaterial.PHONG = 2;
EZ3.MeshMaterial.BLINN_PHONG = 3;
EZ3.MeshMaterial.COOK_TORRANCE = 4;
