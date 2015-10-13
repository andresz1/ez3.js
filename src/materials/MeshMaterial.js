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

EZ3.MeshMaterial.prototype.update = function(gl, programs, lights) {
  var defines = [];
  var pointLights = 0;
  var prefix;
  var id;
  var vertex;
  var fragment;
  var i;

  for (i = 0; i < lights.length; i++) {
    if (lights[i] instanceof EZ3.PointLight)
      pointLights++;
  }

  defines.push('MAX_POINT_LIGHTS ' + pointLights);

  if (this.emissiveMap)
    defines.push('EMISSIVE');

  id = 'mesh@';

  if (defines.length) {
    prefix = '#define ';

    id += defines.join('.');
    prefix += defines.join('\n ' + prefix) + '\n';
  }

  if (!programs[id]) {
    vertex = EZ3.ShaderLibrary.mesh.vertex;
    fragment = EZ3.ShaderLibrary.mesh.fragment;

    this.program = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);
    programs[id] = this.program;
  } else
    this.program = programs[id];
};

EZ3.MeshMaterial.prototype.loadUniforms = function(gl) {
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
