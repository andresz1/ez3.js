/**
 * @class Directional
 * @extends Light
 */

EZ3.Directional = function(config) {
  EZ3.Light.call(this);

  this._direction = (config.direction instanceof EZ3.Vector3) ? config.direction : null;
};

EZ3.Directional.prototype = Object.create(EZ3.Light.prototype);
EZ3.Directional.prototype.constructor = EZ3.Directional;

Object.defineProperty(EZ3.Directional.prototype, "direction", {
  get: function() {
    return this._direction;
  },
  set: function(direction) {
    if (direction instanceof EZ3.Vector3) {
      this._direction.copy(direction);
    }
  }
});
