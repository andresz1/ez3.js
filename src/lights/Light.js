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
  program.loadUniformFloat(gl, prefix + 'diffuse', this.diffuse);
  program.loadUniformFloat(gl, prefix + 'specular', this.specular);
};
