/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function(config) {
  EZ3.Light.call(this);

  this._cutoff = config.cutoff || 0.0;
  this._cutoff.dirty = true;

  this._exponent = config.exponent || 0.0;
  this._exponent.dirty = true;
  
  this._setup(config);
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

Object.defineProperty(EZ3.SpotLight.prototype, "cutoff", {
  get: function() {
    return this._cutoff;
  },
  set: function(cutoff) {
    this._cutoff.dirty = true;
    this._cutoff = cutoff;
  }
});

Object.defineProperty(EZ3.SpotLight.prototype, "exponent", {
  get: function() {
    return this._exponent;
  },
  set: function(exponent) {
    this._exponent = exponent;
    this._exponent.dirty = true;
  }
});
