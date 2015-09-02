/**
 * @class Spot
 * @extends Light
 */

EZ3.Spot = function(config) {
  EZ3.Light.call(this);

  this.cutoff = {};
  this.cutoff.dirty = true;
  this.cutoff.value = config.cutoff || 0.0;

  this.exponent = {};
  this.exponent.dirty = true;
  this.exponent.value = config.exponent || 0.0;
};

EZ3.Spot.prototype = Object.create(EZ3.Light.prototype);
EZ3.Spot.prototype.constructor = EZ3.Spot;
