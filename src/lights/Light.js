/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);

  this._ambientColor = null;
  this._diffuseColor = null;
  this._specularColor = null;

  this._linearAttenuation = 0;
  this._linearAttenuation.dirty = true;

  this._constantAttenuation = 0;
  this._constantAttenuation.dirty = true;

  this._quadraticAttenuation = 0;
  this._quadraticAttenuation = true;
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;

EZ3.Light.prototype._setup = function(config) {
  this.linearAttenuation = config.constantAttenuation || 0.2;
  this.constantAttenuation = config.constantAttenuation || 0.3;
  this.quadraticAttenuation = config.constantAttenuation || 0.5;
  this.ambientColor  = (config.ambientColor instanceof EZ3.Vector3) ? config.ambientColor : new EZ3.Vector3();
  this.diffuseColor  = (config.diffuseColor instanceof EZ3.Vector3) ? config.diffuseColor : new EZ3.Vector3(1,1,1);
  this.specularColor = (config.specularColor instanceof EZ3.Vector3) ? config.specularColor : new EZ3.Vector3(1,1,1);
};

Object.defineProperty(EZ3.Light.prototype, 'ambientColor', {
  get: function() {
    return this._ambientColor;
  },
  set: function(ambientColor) {
    this._ambientColor.copy(ambientColor);
  }
});

Object.defineProperty(EZ3.Light.prototype, 'diffuseColor', {
  get: function() {
    return this._diffuseColor;
  },
  set: function(diffuseColor) {
    this._diffuseColor.copy(diffuseColor);
  }
});

Object.defineProperty(EZ3.Light.prototype, 'specularColor', {
  get: function() {
    return this._specularColor;
  },
  set: function(specularColor) {
    this._specularColor.copy(specularColor);
  }
});

Object.defineProperty(EZ3.Light.prototype, 'linearAttenuation', {
  get: function() {
    return this._linearAttenuation;
  },
  set: function(linearAttenuation) {
    this._linearAttenuation = linearAttenuation;
    this._linearAttenuation.dirty = true;
  }
});

Object.defineProperty(EZ3.Light.prototype, 'constantAttenuation', {
  get: function() {
    return this._constantAttenuation;
  },
  set: function(constantAttenuation) {
    this._constantAttenuation = constantAttenuation;
    this._constantAttenuation.dirty = true;
  }
});

Object.defineProperty(EZ3.Light.prototype, 'quadraticAttenuation', {
  get: function() {
    return this._quadraticAttenuation;
  },
  set: function(quadraticAttenuation) {
    this._quadraticAttenuation = quadraticAttenuation;
    this._quadraticAttenuation.dirty = true;
  }
});
