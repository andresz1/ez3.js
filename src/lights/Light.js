/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);
  this._mesh = null;
  this._linearAttenuation = null;
  this._constantAttenuation = null;
  this._quadraticAttenuation = null;
};

EZ3.Light.prototype.setup = function(config) {
  this._mesh = config.mesh || null;
  this._linearAttenuation = config.attenuation[EZ3.Light.LINEAR_ATTENUATION] || 0.2;
  this._constantAttenuation = config.attenuation[EZ3.Light.CONSTANT_ATTENUATION] || 0.3;
  this._quadraticAttenuation = config.attenuation[EZ3.Light.QUADRATIC_ATTENUATION] || 0.5;
};

EZ3.Light.prototype.getAmbient = function() {
  return this._ambient;
};

EZ3.Light.prototype.getDiffuse = function() {
  return this._diffuse;
};

EZ3.Light.prototype.getSpecular = function() {
  return this._specular;
};

EZ3.Light.prototype.getLinearAttenuation = function() {
  return this._linearAttenuation;
};

EZ3.Light.prototype.getConstantAttenuation = function() {
  return this._constantAttenuation;
};

EZ3.Light.prototype.getQuadraticAttenuation = function() {
  return this._quadraticAttenuation;
};

EZ3.Light.prototype.setAmbient = function(ambient) {
  this._ambient = ambient;
};

EZ3.Light.prototype.setDiffuse = function(diffuse) {
  this._diffuse = diffuse;
};

EZ3.Light.prototype.setSpecular = function(specular) {
  this._specular = specular;
};

EZ3.Light.prototype.setLinearAttenuation = function(linearAttenuation) {
  this._linearAttenuation = linearAttenuation;
};

EZ3.Light.prototype.setConstantAttenuation = function(constantAttenuation) {
  this._constantAttenuation = constantAttenuation;
};

EZ3.Light.prototype.setQuadraticAttenuation = function(quadraticAttenuation) {
  this.quadraticAttenuation = quadraticAttenuation;
};

EZ3.Light.LINEAR_ATTENUATION = 0;
EZ3.Light.CONSTANT_ATTENUATION = 1;
EZ3.Light.QUADRATIC_ATTENUATION = 2;
