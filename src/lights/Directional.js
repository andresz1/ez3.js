/**
 * @class Directional
 * @extends Light
 */

EZ3.Directional = function(direction) {
  EZ3.Light.call(this);

  this.direction = {};
  this.direction.dirty = true;
  this.direction.value = config.direction || null;
};

EZ3.Directional.prototype = Object.create(EZ3.Light.prototype);
EZ3.Directional.prototype.constructor = EZ3.Directional;
