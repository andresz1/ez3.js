/**
 * @class Spotlight
 * @extends Light
 */

EZ3.Spotlight = function(config) {
  EZ3.Light.call(this);

  this._type = EZ3.Light.SPOT;
  this._spot = config.spot || 0.0;  
  this._exponent = config.exponent || 0.0;

  this._setup(config);
};

EZ3.Spotlight.prototype = Object.create(EZ3.Light.prototype);
EZ3.Spotlight.prototype.constructor = EZ3.Spotlight;
