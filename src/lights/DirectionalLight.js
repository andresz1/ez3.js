/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function(color, attenuation, direction) {
  EZ3.Light.call(this, color, attenuation);

  if(direction instanceof EZ3.Vector3)
    this.direction = direction;
  else
    this.direction = new EZ3.Vector3();
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;
