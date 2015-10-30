/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this, 'mesh');

  this.emissive = new EZ3.Vector3();
  this.emissiveMap = null;
  this.diffuse = new EZ3.Vector3(0.8, 0.8, 0.8);
  this.diffuseMap = null;
  this.specular = new EZ3.Vector3(0.2, 0.2, 0.2);
  this.specularMap = null;
  this.normalMap = null;
  this.shininess = 180.0;
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

  if (this.emissiveMap instanceof EZ3.Texture)
    defines.push('EMISSIVE_MAP');

  if (this.diffuseMap instanceof EZ3.Texture)
    defines.push('DIFFUSE_MAP');

  if (this.normalMap instanceof EZ3.Texture)
    defines.push('NORMAL_MAP');

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
  this.program.loadUniformf(gl, 'uShininess', 1, this.shininess);

  if (this.emissiveMap instanceof EZ3.Texture) {
    this.emissiveMap.bind(gl, gl.TEXTURE_2D, 0, state);

    if (this.emissiveMap.dirty) {
      this.emissiveMap.update(gl, gl.TEXTURE_2D);
      this.emissiveMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uEmissiveSampler', 1, 0);
  }

  if (this.diffuseMap instanceof EZ3.Texture) {
    this.diffuseMap.bind(gl, gl.TEXTURE_2D, 1, state);

    if (this.diffuseMap.dirty) {
      this.diffuseMap.update(gl, gl.TEXTURE_2D);
      this.diffuseMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uDiffuseSampler', 1, 1);
  }

  if (this.normalMap instanceof EZ3.Texture) {
    this.normalMap.bind(gl, gl.TEXTURE_2D, 2, state);

    if (this.normalMap.dirty) {
      this.normalMap.update(gl, gl.TEXTURE_2D);
      this.normalMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uNormalSampler', 1, 2);
  }
};
