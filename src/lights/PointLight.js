/**
 * @class PointLight
 * @extends Light
 */

EZ3.PointLight = function() {
  EZ3.Light.call(this);
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;
