/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this, 'mesh');

  this.emissiveColor = new EZ3.Vector3(1.0, 1.0, 1.0);
  this.emissiveMap = null;
  this.dirty = true;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, programs, lights) {
  var id = this._name;
  var defines = [];
  var prefix = '#define ';
  var vertex;
  var fragment;

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if (this.emissiveMap)
    defines.push('EMISSIVE');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (!programs[id]) {
    vertex = EZ3.ShaderLibrary.mesh.vertex;
    fragment = EZ3.ShaderLibrary.mesh.fragment;

    this.program = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);
    programs[id] = this.program;
  } else
    this.program = programs[id];
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl) {
  this.program.loadUniformf(gl, 'uEmissiveColor', 3, this.emissiveColor.toArray());

  if (this.emissiveMap instanceof EZ3.Texture) {
    this.emissiveMap.bind(gl, 0);

    if (this.emissiveMap.dirty) {
      this.emissiveMap.update(gl);
      this.emissiveMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uEmissiveSampler', 1, 0);
  }
};
