/**
 * @class EZ3.Plane
 * @constructor
 */
EZ3.Plane = function(normal, constant) {
  this.normal = (normal !== undefined) ? normal : new EZ3.Vector3(1, 0, 0);
  this.constant = (constant !== undefined) ? constant : 0;
};

EZ3.Plane.prototype.constructor = EZ3.Plane;

EZ3.Plane.prototype.distanceToPoint = function(point) {
  return this.normal.dot(point) + this.constant;
};

EZ3.Plane.prototype.normalize = function() {
  var inverseNormalLength = 1.0 / this.normal.length();

  this.normal.scale(inverseNormalLength);
  this.constant *= inverseNormalLength;

  return this;
};

EZ3.Plane.prototype.set = function(normal, constant) {
  this.normal.copy(normal);
  this.constant = constant;

  return this;
};

EZ3.Plane.prototype.copy = function(plane) {
  this.normal.copy(plane.normal);
  this.constant = plane.constant;

  return this;
};
