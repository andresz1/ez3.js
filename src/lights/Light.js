/**
 * @class Light
 */

EZ3.Light = function(color, attenuation) {
  EZ3.Entity.call(this);

  if(color instanceof EZ3.Vector3)
    this.color = color;
  else
    this.color = new EZ3.Vector3(1,1,1);

  if(attenuation instanceof EZ3.Vector3)
    this.attenuation = attenuation;
  else
    this.attenuation = new EZ3.Vector3(1.0,0.0,0.0);
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;
