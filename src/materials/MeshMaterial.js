/**
 * @class EZ3.MeshMaterial
 * @extends EZ3.Material
 * @constructor
 */
EZ3.MeshMaterial = function() {
  EZ3.Material.call(this);

  /**
   * @property {EZ3.Vector3} emissive
   * @default new EZ3.Vector3()
   */
  this.emissive = new EZ3.Vector3();
  /**
   * @property {EZ3.Vector3} diffuse
   * @default new EZ3.Vector3(0.8, 0.8, 0.8)
   */
  this.diffuse = new EZ3.Vector3(0.8, 0.8, 0.8);
  /**
   * @property {EZ3.Vector3} specular
   * @default new EZ3.Vector3(0.2, 0.2, 0.2)
   */
  this.specular = new EZ3.Vector3(0.2, 0.2, 0.2);
  /**
   * @property {Number} shading
   * @default EZ3.MeshMaterial.SMOOTH
   */
  this.shading = EZ3.MeshMaterial.SMOOTH;
  /**
   * @property {EZ3.Texture2D} normalMap
   */
  this.normalMap = null;
  /**
   * @property {EZ3.Texture2D} diffuseMap
   */
  this.diffuseMap = null;
  /**
   * @property {EZ3.Texture2D} emissiveMap
   */
  this.emissiveMap = null;
  /**
   * @property {EZ3.Texture2D} specularMap
   */
  this.specularMap = null;
  /**
   * @property {EZ3.Cubemap} environmentMap
   */
  this.environmentMap = null;
  /**
   * @property {Boolean} reflective
   * @default false
   */
  this.reflective = false;
  /**
   * @property {Boolean} refractive
   * @default false
   */
  this.refractive = false;
  /**
   * @property {Number} diffuseReflection
   * @default EZ3.MeshMaterial.LAMBERT
   */
  this.diffuseReflection = EZ3.MeshMaterial.LAMBERT;
  /**
   * @property {Number} specularReflection
   * @default EZ3.MeshMaterial.BLINN_PHONG
   */
  this.specularReflection = EZ3.MeshMaterial.BLINN_PHONG;
  /**
   * @property {Number} albedo
   * @default 3
   */
  this.albedo = 3;
  /**
   * @property {Number} fresnel
   * @default 0
   */
  this.fresnel = 0;
  /**
   * @property {Number} opacity
   * @default 1
   */
  this.opacity = 1;
  /**
   * @property {Number} shininess
   * @default 180
   */
  this.shininess = 180;
  /**
   * @property {Number} refractiveIndex
   * @default 1
   */
  this.refractiveIndex = 1;
  /**
   * @property {Number} diffuseRoughness
   * @default 0.2
   */
  this.diffuseRoughness = 0.2;
  /**
   * @property {Number} specularRoughness
   * @default 0.2
   */
  this.specularRoughness = 0.2;

  this.morphTarget = false;
  this.tick = 0;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

/**
 * @method EZ3.MeshMaterial#updateProgram
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {Object} lights
 * @param {Boolean} shadowReceiver
 */
EZ3.MeshMaterial.prototype.updateProgram = function(gl, state, lights, shadowReceiver) {
  var id = 'MESH.';
  var defines = [];
  var prefix = '#define ';

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if(this.morphTarget)
    defines.push('MORPH_TARGET');

  if(this.shading === EZ3.MeshMaterial.FLAT)
    defines.push('FLAT');

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

  if(shadowReceiver)
    defines.push('SHADOW_MAP');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (this._id !== id) {
    this._id = id;
    this.program = state.createProgram(id, EZ3.ShaderLibrary.mesh.vertex, EZ3.ShaderLibrary.mesh.fragment, prefix);
  }
};

/**
 * @method EZ3.MeshMaterial#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 */
EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state, capabilities) {
  this.program.loadUniformFloat(gl, 'uEmissive', this.emissive);
  this.program.loadUniformFloat(gl, 'uDiffuse', this.diffuse);
  this.program.loadUniformFloat(gl, 'uSpecular', this.specular);
  this.program.loadUniformFloat(gl, 'uShininess', this.shininess);
  this.program.loadUniformFloat(gl, 'uOpacity', this.opacity);

  if (this.morphTarget) {
    this.program.loadUniformFloat(gl, 'uInfluence1', this.tick);
    this.program.loadUniformFloat(gl, 'uInfluence2', 1 - this.tick);

    this.tick += 0.01;

    if (this.tick >= 1)
      this.tick = 0;
  }

  if (this.emissiveMap instanceof EZ3.Texture2D) {
    this.emissiveMap.bind(gl, state, capabilities);
    this.emissiveMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEmissiveSampler', state.usedTextureSlots++);
  }

  if (this.diffuseMap instanceof EZ3.Texture2D) {
    this.diffuseMap.bind(gl, state, capabilities);
    this.diffuseMap.update(gl);

    this.program.loadUniformInteger(gl, 'uDiffuseSampler', state.usedTextureSlots++);
  }

  if (this.normalMap instanceof EZ3.Texture2D) {
    this.normalMap.bind(gl, state, capabilities);
    this.normalMap.update(gl);

    this.program.loadUniformInteger(gl, 'uNormalSampler', state.usedTextureSlots++);
  }

  if(this.environmentMap instanceof EZ3.Cubemap) {
    this.environmentMap.bind(gl, state, capabilities);
    this.environmentMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEnvironmentSampler', state.usedTextureSlots++);
  }

  if(this.refractive)
    this.program.loadUniformFloat(gl, 'uRefractiveIndex', this.refractiveIndex);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR) {
    this.program.loadUniformFloat(gl, 'uAlbedo', this.albedo);
    this.program.loadUniformFloat(gl, 'uDiffuseRoughness', this.diffuseRoughness);
  }

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE) {
    this.program.loadUniformFloat(gl, 'uFresnel', this.fresnel);
    this.program.loadUniformFloat(gl, 'uSpecularRoughness', this.specularRoughness);
  }
};

/**
 * @property {Number} FLAT
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.FLAT = 0;
/**
 * @property {Number} SMOOTH
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.SMOOTH = 1;
/**
 * @property {Number} LAMBERT
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.LAMBERT = 0;
/**
 * @property {Number} OREN_NAYAR
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.OREN_NAYAR = 1;
/**
 * @property {Number} PHONG
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.PHONG = 2;
/**
 * @property {Number} BLINN_PHONG
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.BLINN_PHONG = 3;
/**
 * @property {Number} COOK_TORRANCE
 * @memberof EZ3.MeshMaterial
 * @static
 * @final
 */
EZ3.MeshMaterial.COOK_TORRANCE = 4;
