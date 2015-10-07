/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function(color, attenuation, cutoff, exponent) {
  EZ3.Light.call(this, color, attenuation);

  this._cutoff = cutoff || 0.0;
  this._cutoff.dirty = true;

  this._exponent = exponent || 0.0;
  this._exponent.dirty = true;
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

Object.defineProperty(EZ3.SpotLight.prototype, 'cutoff', {
  get: function() {
    return this._cutoff;
  },
  set: function(cutoff) {
    this._cutoff = cutoff;
    this._cutoff.dirty = true;
  }
});

Object.defineProperty(EZ3.SpotLight.prototype, 'exponent', {
  get: function() {
    return this._exponent;
  },
  set: function(exponent) {
    this._exponent = exponent;
    this._exponent.dirty = true;
  }
});
