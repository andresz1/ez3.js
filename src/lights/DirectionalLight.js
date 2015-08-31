/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function(config) {
  EZ3.Light.call(this);

  this.type = EZ3.Light.DIRECTIONAL;
  this.direction = config.direction || null;

  this._setup(config);
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;
