/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);

  this.target = new EZ3.Vector3();
  this.cutoff = 0.8;
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target).normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);
  program.loadUniformf(gl, prefix + 'position', 3, this.position.toArray());
  program.loadUniformf(gl, prefix + 'direction', 3, direction.toArray());
  program.loadUniformf(gl, prefix + 'cutoff', 1, this.cutoff);
};
