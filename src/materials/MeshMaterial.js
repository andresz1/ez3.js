/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this);

  this.emissiveColor = new EZ3.Vector3(0.0, 1.0, 1.0);
  this.emissiveMap = null;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.update = function(gl, programs) {
  var defines = [];
  var prefix;
  var id;
  var vertex;
  var fragment;

  if (this.dirty) {
    if (this.emissiveMap)
      defines.push('EMISSIVE');

    // TODO Lights defines

    id = 'mesh@';

    if (defines.length) {
      prefix = '#define ';

      id += defines.join('.');
      prefix += defines.join('\n ' + prefix) + '\n';
      console.log(prefix);
    }

    if (!programs[id]) {
      vertex = EZ3.ShaderLibrary.mesh.vertex;
      fragment = EZ3.ShaderLibrary.mesh.fragment;

      this.program = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);
      programs[id] = this.program;
    } else
      this.program = programs[id];

    this.dirty = false;
  }
};

EZ3.MeshMaterial.prototype.bind = function(gl) {
  this.program.loadUniformf(gl, 'uEmissiveColor', 3, this.emissiveColor.toArray());

  if (this.emissiveMap) {
    this.emissiveMap.update(gl);
    this.emissiveMap.bind(gl, 0);
    this.program.loadUniformi(gl, 'uEmissiveSampler', 1, 0);
  }
};
