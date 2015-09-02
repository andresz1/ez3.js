/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);

  this.mesh = null;
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;
