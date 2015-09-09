/**
 * @class Puntual
 * @extends Light
 */

EZ3.Puntual = function(mesh) {
  EZ3.Light.call(this);
};

EZ3.Puntual.prototype = Object.create(EZ3.Light.prototype);
EZ3.Puntual.prototype.constructor = EZ3.Puntual;
