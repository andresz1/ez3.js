/**
 * @class EZ3.Sphere
 * @constructor
 * @param {EZ3.Vector3} [center]
 * @param {Number} [radius]
 */
EZ3.Sphere = function(center, radius) {
  /**
   * @property {EZ3.Vector3} center
   * @default new EZ3.Vector3()
   */
  this.center = (center !== undefined) ? center : new EZ3.Vector3();
  /**
   * @property {Number} radius
   * @default 0
   */
  this.radius = (radius !== undefined) ? radius : 0;
};

EZ3.Sphere.prototype.constructor = EZ3.Sphere;

/**
 * @method EZ3.Sphere#set
 * @param {EZ3.Vector3} center
 * @param {Number} radius
 * @return {EZ3.Sphere}
 */
EZ3.Sphere.prototype.set = function(center, radius) {
  this.center.copy(center);
  this.radius = radius;

  return this;
};

/**
 * @method EZ3.Sphere#copy
 * @param {EZ3.Sphere} sphere
 * @return {EZ3.Sphere}
 */
EZ3.Sphere.prototype.copy = function(sphere) {
  this.center.copy(sphere.center);
  this.radius = sphere.radius;

  return this;
};

/**
 * @method EZ3.Sphere#clone
 * @return {EZ3.Sphere}
 */
EZ3.Sphere.prototype.clone = function() {
  return new EZ3.Sphere(this.center, this.radius);
};

/**
 * @method EZ3.Sphere#applyMatrix4
 * @param {EZ3.Matrix4} matrix
 * @return {EZ3.Sphere}
 */
EZ3.Sphere.prototype.applyMatrix4 = function(matrix) {
  this.center.mulMatrix4(matrix);
  this.radius = this.radius * matrix.getMaxScaleOnAxis();

  return this;
};
