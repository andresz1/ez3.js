/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);

  this.mesh = null;
  this.linearAttenuation = null;
  this.constantAttenuation = null;
  this.quadraticAttenuation = null;
};

EZ3.Light.prototype._setup = function(config) {
  this.mesh = config.mesh || null;
  this.linearAttenuation = config.attenuation[EZ3.Light.LINEAR_ATTENUATION] || 0.2;
  this.constantAttenuation = config.attenuation[EZ3.Light.CONSTANT_ATTENUATION] || 0.3;
  this.quadraticAttenuation = config.attenuation[EZ3.Light.QUADRATIC_ATTENUATION] || 0.5;
};

EZ3.Light.LINEAR_ATTENUATION = 0;
EZ3.Light.CONSTANT_ATTENUATION = 1;
EZ3.Light.QUADRATIC_ATTENUATION = 2;
