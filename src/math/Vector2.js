/**
 * @class EZ3.Vector2
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 */
EZ3.Vector2 = function(x, y) {
  /**
   * @property {Number} x
   * @default 0
   */

  /**
   * @property {Number} y
   * @default 0
   */

  if (x !== undefined) {
    this.x = x;
    this.y = (y !== undefined) ? y : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
  }
};

EZ3.Vector2.prototype.constructor = EZ3.Vector2;

/**
 * @method EZ3.Vector2#set
 * @param {Number} x
 * @param {Number} y
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;

  return this;
};

/**
 * @method EZ3.Vector2#copy
 * @param {EZ3.Vector2} v
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;

  return this;
};

/**
 * @method EZ3.Vector2#clone
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.clone = function() {
  return new EZ3.Vector2(this.x, this.y);
};

/**
 * @method EZ3.Vector2#add
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  } else {
    this.x += v1.x;
    this.y += v1.y;
  }

  return this;
};

/**
 * @method EZ3.Vector2#sub
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
  }
  return this;
};

/**
 * @method EZ3.Vector2#scale
 * @param {Number} s
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.scale = function(s, v) {
  if (v !== undefined) {
    this.x = v.x * s;
    this.y = v.y * s;
  } else {
    this.x *= s;
    this.y *= s;
  }

  return this;
};

/**
 * @method EZ3.Vector2#dot
 * @param {EZ3.Vector2} [v]
 * @return {Number}
 */
EZ3.Vector2.prototype.dot = function(v) {
  return v.x * this.x + v.y * this.y;
};

/**
 * @method EZ3.Vector2#max
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;
  }
  return this;
};

/**
 * @method EZ3.Vector2#min
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;
  }
  return this;
};

/**
 * @method EZ3.Vector2#length
 * @return {Number}
 */
EZ3.Vector2.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector2#normalize
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.normalize = function(v) {
  var l;
  var u;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      u = v.clone().scale(1.0 / l);

      this.x = u.x;
      this.y = u.y;
    }
  } else {
    l = this.length();

    if (l > 0)
      this.scale(1.0 / l);
  }

  return this;
};

/**
 * @method EZ3.Vector2#negate
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.negate = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
  } else {
    this.x = -this.x;
    this.y = -this.y;
  }

  return this;
};

/**
 * @method EZ3.Vector2#isEqual
 * @param {EZ3.Vector2} v
 * @return {Boolean}
 */
EZ3.Vector2.prototype.isEqual = function(v) {
  if (v !== undefined)
    return (this.x === v.x) && (this.y === v.y);
  else
    return false;
};

/**
 * @method EZ3.Vector2#isDiff
 * @param {EZ3.Vector2} v
 * @return {Boolean}
 */
EZ3.Vector2.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector2#toArray
 * @return {Number[]}
 */
EZ3.Vector2.prototype.toArray = function() {
  return [
    this.x,
    this.y
  ];
};
