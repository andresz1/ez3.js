/**
 * @class EZ3.Box
 * @constructor
 */
EZ3.Box = function(min, max) {
  this.min = (min !== undefined) ? min : new EZ3.Vector3(Infinity);
  this.max = (max !== undefined) ? max : new EZ3.Vector3(-Infinity);
};

EZ3.Box.prototype.set = function(min, max) {
  this.min.copy(min);
  this.max.copy(max);

  return this;
};

EZ3.Box.prototype.copy = function(box) {
  this.min.copy(box.min);
  this.max.copy(box.max);

  return this;
};
