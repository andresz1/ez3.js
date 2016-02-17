/**
 * @class EZ3.Box
 * @constructor
 * @param {EZ3.Vector3} [min]
 * @param {EZ3.Vector3} [max]
 */
EZ3.Box = function(min, max) {
  /**
   * @property {EZ3.Vector3} min
   * @default new EZ3.Vector3(Infinity)
   */
  this.min = (min !== undefined) ? min : new EZ3.Vector3(Infinity);
  /**
   * @property {EZ3.Vector3} max
   * @default new EZ3.Vector3(-Infinity)
   */
  this.max = (max !== undefined) ? max : new EZ3.Vector3(-Infinity);
};

EZ3.Box.prototype.constructor = EZ3.Box;

/**
 * @method EZ3.Box#set
 * @param {EZ3.Vector3} min
 * @param {EZ3.Vector3} max
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.set = function(min, max) {
  this.min.copy(min);
  this.max.copy(max);

  return this;
};

/**
 * @method EZ3.Box#copy
 * @param {EZ3.Box} box
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.copy = function(box) {
  this.min.copy(box.min);
  this.max.copy(box.max);

  return this;
};

/**
 * @method EZ3.Box#clone
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.clone = function() {
  return new EZ3.Box(this.min, this.max);
};

/**
 * @method EZ3.Box#expand
 * @param {EZ3.Vector3} point
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.expand = function(point) {
  this.min.min(point);
  this.max.max(point);

  return this;
};

/**
 * @method EZ3.Box#union
 * @param {EZ3.Box} box
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.union = function(box) {
  this.min.min(box.min);
  this.max.max(box.max);

  return this;
};

/**
 * @method EZ3.Box#applyMatrix4
 * @param {EZ3.Matrix4} matrix
 * @return {EZ3.Box}
 */
EZ3.Box.prototype.applyMatrix4 = function(matrix) {
  var points = [];
  var i;

  points.push((new EZ3.Vector3(this.min.x, this.min.y, this.min.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.min.x, this.min.y, this.max.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.min.x, this.max.y, this.min.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.min.x, this.max.y, this.max.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.max.x, this.min.y, this.min.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.max.x, this.min.y, this.max.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.max.x, this.max.y, this.min.z)).mulMatrix4(matrix));
  points.push((new EZ3.Vector3(this.max.x, this.max.y, this.max.z)).mulMatrix4(matrix));

  this.min.set(Infinity);
  this.max.set(-Infinity);

  for (i = 0; i < 8; i++)
    this.expand(points[i]);

  return this;
};

/**
 * @method EZ3.Box#size
 * @return {EZ3.Vector3}
 */
EZ3.Box.prototype.size = function() {
  return new EZ3.Vector3().sub(this.max, this.min);
};

/**
 * @method EZ3.Box#getCenter
 * @return {EZ3.Vector3}
 */
EZ3.Box.prototype.center = function() {
  return new EZ3.Vector3().add(this.max, this.min).scale(0.5);
};
