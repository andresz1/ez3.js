/**
 * @class Spotlight
 * @extends Light
 */

EZ3.Spotlight = function(config) {
  EZ3.Light.call(this);
  this.setup(config);
};

EZ3.Spotlight.prototype = Object.create(EZ3.Light.prototype);
EZ3.Spotlight.prototype.constructor = EZ3.Spotlight;
