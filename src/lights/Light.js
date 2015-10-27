/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);

  this.diffuse = new EZ3.Vector3(1.0, 1.0, 1.0);
  this.specular = new EZ3.Vector3(1.0, 1.0, 1.0);
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;

EZ3.Light.prototype.updateUniforms = function(gl, program, prefix) {
  program.loadUniformf(gl, prefix + 'diffuse', 3, this.diffuse);
  program.loadUniformf(gl, prefix + 'specular', 3, this.specular);
};
