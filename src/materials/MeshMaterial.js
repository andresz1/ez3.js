/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this, 'mesh');

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

  this.albedoFactor = 7.0;
  this.fresnelFactor = 0.0;
  this.refractFactor = 1.0;
  this.roughnessFactor = 0.2;
  this.shininessFactor = 180.0;

  this.dirty = true;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, lights, state) {
  var id = this._name;
  var defines = [];
  var prefix = '#define ';
  var vertex;
  var fragment;

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

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

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR)
    defines.push('OREN_NAYAR');
  else
    defines.push('LAMBERT');

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE)
    defines.push('COOK_TORRANCE');
  else if(this.specularReflection === EZ3.MeshMaterial.PHONG)
    defines.push('PHONG');
  else
    defines.push('BLINN_PHONG');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (!state.program[id]) {
    vertex = EZ3.ShaderLibrary.mesh.vertex;
    fragment = EZ3.ShaderLibrary.mesh.fragment;

    this.program = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);
    state.program[id] = this.program;
  } else
    this.program = state.program[id];
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state) {
  this.program.loadUniformf(gl, 'uEmissive', 3, this.emissive);
  this.program.loadUniformf(gl, 'uDiffuse', 3, this.diffuse);
  this.program.loadUniformf(gl, 'uSpecular', 3, this.specular);
  this.program.loadUniformf(gl, 'uShininess', 1, this.shininessFactor);

  if (this.emissiveMap instanceof EZ3.Texture2D) {
    this.emissiveMap.bind(gl, state, 0);

    if (this.emissiveMap.dirty) {
      this.emissiveMap.update(gl, gl.RGBA, gl.RGBA);
      this.emissiveMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uEmissiveSampler', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }

  if (this.diffuseMap instanceof EZ3.Texture2D) {
    this.diffuseMap.bind(gl, state, 1);

    if (this.diffuseMap.dirty) {
      this.diffuseMap.update(gl, gl.RGBA, gl.RGBA);
      this.diffuseMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uDiffuseSampler', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 1);
  }

  if (this.normalMap instanceof EZ3.Texture2D) {
    this.normalMap.bind(gl, state, 2);

    if (this.normalMap.dirty) {
      this.normalMap.update(gl, gl.RGBA, gl.RGBA);
      this.normalMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uNormalSampler', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 2);
  }

  if(this.environmentMap instanceof EZ3.Cubemap) {
    this.environmentMap.bind(gl, state, 3);

    if(this.environmentMap.dirty) {
      this.environmentMap.update(gl, gl.RGBA, gl.RGBA);
      this.environmentMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uEnvironmentSampler', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 3);
  }

  if(this.refractive)
    this.program.loadUniformf(gl, 'uRefractFactor', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this.refractFactor);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR) {
    this.program.loadUniformf(gl, 'uAlbedo', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this.albedoFactor);
    this.program.loadUniformf(gl, 'uRoughness', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this.roughnessFactor);
  }

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE) {
    this.program.loadUniformf(gl, 'uFresnel', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this.fresnelFactor);
    this.program.loadUniformf(gl, 'uRoughness', EZ3.GLSLProgram.UNIFORM_SIZE_1D, this.roughnessFactor);
  }
};

EZ3.MeshMaterial.LAMBERT = 0;
EZ3.MeshMaterial.OREN_NAYAR = 1;
EZ3.MeshMaterial.PHONG = 2;
EZ3.MeshMaterial.BLINN_PHONG = 3;
EZ3.MeshMaterial.COOK_TORRANCE = 4;
