/**
 * @class Spot
 * @extends Light
 */

EZ3.Spot = function(config) {
  EZ3.Light.call(this);

  this._cutoff = config.cutoff || 0.0;
  this._cutoff.dirty = true;

  this._exponent = config.exponent || 0.0;
  this._exponent.dirty = true;
};

EZ3.Spot.prototype = Object.create(EZ3.Light.prototype);
EZ3.Spot.prototype.constructor = EZ3.Spot;

Object.defineProperty(EZ3.Spot.prototype, "cutoff", {
  get: function() {
    return this._cutoff;
  },
  set: function(cutoff) {
    this._cutoff.dirty = true;
    this._cutoff = cutoff;
  }
});

Object.defineProperty(EZ3.Spot.prototype, "exponent", {
  get: function() {
    return this._exponent;
  },
  set: function(exponent) {
    this._exponent = exponent;
    this._exponent.dirty = true;
  }
});
