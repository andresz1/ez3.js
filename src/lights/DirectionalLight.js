/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function(config) {
  EZ3.Light.call(this);

  this._direction = (config.direction instanceof EZ3.Vector3) ? config.direction : new EZ3.Vector3(-1,-1,-1);
  this._setup(config);
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

Object.defineProperty(EZ3.DirectionalLight.prototype, "direction", {
  get: function() {
    return this._direction;
  },
  set: function(direction) {
    this._direction.copy(direction);
  }
});
