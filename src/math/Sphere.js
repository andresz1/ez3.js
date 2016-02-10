/**
 * @class EZ3.Sphere
 * @constructor
 * @param {EZ3.Vector3} [center]
 * @param {Number} [radius]
 */
EZ3.Sphere = function(center, radius) {
  this.center = (center !== undefined) ? center : new EZ3.Vector3();
  this.radius = (radius !== undefined) ? radius : 0;
};

EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.applyMatrix4 = function(matrix) {
  this.center.mulMatrix4(matrix);
  this.radius = this.radius * matrix.getMaxScaleOnAxis();

  return this;
};

EZ3.Sphere.prototype.set = function(center, radius) {
  this.center.copy(center);
  this.radius = radius;

  return this;
};

EZ3.Sphere.prototype.copy = function(sphere) {
  this.center.copy(sphere.center);
  this.radius = sphere.radius;

  return this;
};

EZ3.Sphere.prototype.clone = function() {
  return new EZ3.Sphere(this.center, this.radius);
};
