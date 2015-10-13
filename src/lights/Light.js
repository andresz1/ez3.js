/**
 * @class Light
 */

EZ3.Light = function(color) {
  EZ3.Entity.call(this);

  this.color = new EZ3.Vector3(1, 1, 1);
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;


EZ3.Light.prototype.loadUniforms = function(gl, program, i) {
  program.loadUniformf(gl, 'uPointLights[' + i + '].position', 3, this.position.toArray());
};
