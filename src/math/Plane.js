/**
 * @class EZ3.Plane
 * @constructor
 * @param {EZ3.Vector3} [normal]
 * @param {Number} [constant]
 */
EZ3.Plane = function(normal, constant) {
  /**
   * @property {EZ3.Vector3} normal
   * @default new EZ3.Vector3(1, 0, 0)
   */
  this.normal = (normal !== undefined) ? normal : new EZ3.Vector3(1, 0, 0);
  /**
   * @property {Number} constant
   * @default 0
   */
  this.constant = (constant !== undefined) ? constant : 0;
};

EZ3.Plane.prototype.constructor = EZ3.Plane;

/**
 * @method EZ3.Plane#set
 * @param {EZ3.Vector3} normal
 * @param {Number} constant
 * @return {EZ3.Plane}
 */
EZ3.Plane.prototype.set = function(normal, constant) {
  this.normal.copy(normal);
  this.constant = constant;

  return this;
};

/**
 * @method EZ3.Plane#copy
 * @param {EZ3.Plane} plane
 * @return {EZ3.Plane}
 */
EZ3.Plane.prototype.copy = function(plane) {
  this.normal.copy(plane.normal);
  this.constant = plane.constant;

  return this;
};

/**
 * @method EZ3.Plane#clone
 * @return {EZ3.Plane}
 */
EZ3.Plane.prototype.clone = function() {
  return new EZ3.Plane(this.normal, this.constant);
};

/**
 * @method EZ3.Plane#distanceToPoint
 * @param {EZ3.Vector3} point
 * @return {Number}
 */
EZ3.Plane.prototype.distanceToPoint = function(point) {
  return this.normal.dot(point) + this.constant;
};

/**
 * @method EZ3.Plane#normalize
 * @return {EZ3.Plane}
 */
EZ3.Plane.prototype.normalize = function() {
  var inverseNormalLength = 1.0 / this.normal.length();

  this.normal.scale(inverseNormalLength);
  this.constant *= inverseNormalLength;

  return this;
};
