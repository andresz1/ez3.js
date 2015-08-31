/**
 * @class PointLight
 * @extends Light
 */

EZ3.PointLight = function(config) {
  EZ3.Light.call(this);

  this.type = EZ3.Light.POINT;

  this._setup(config);
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;
