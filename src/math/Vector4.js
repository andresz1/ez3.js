/**
 * @class EZ3.Vector4
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 */
EZ3.Vector4 = function(x, y, z, w) {
  /**
   * @property {Number} x
   * @default 0
   */

  /**
   * @property {Number} y
   * @default 0
   */

  /**
   * @property {Number} z
   * @default 0
   */

  /**
   * @property {Number} z
   * @default 0
   */

  if (x !== undefined) {
    this.x = x;
    this.y = (y !== undefined) ? y : x;
    this.z = (z !== undefined) ? z : x;
    this.w = (w !== undefined) ? w : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
  }
};

EZ3.Vector4.prototype.constructor = EZ3.Vector4;

/**
 * @method EZ3.Vector4#set
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;

  return this;
};

/**
 * @method EZ3.Vector4#copy
 * @param {EZ3.Vector4} v
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  this.w = v.w;

  return this;
};

/**
 * @method EZ3.Vector4#clone
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.clone = function() {
  return new EZ3.Vector4(this.x, this.y, this.z, this.w);
};

/**
 * @method EZ3.Vector4#add
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
    this.w = v1.w + v2.w;
  } else {
    this.x += v1.x;
    this.y += v1.y;
    this.z += v1.z;
    this.w += v1.w;
  }

  return this;
};

/**
 * @method EZ3.Vector4#sub
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
    this.w = v1.w - v2.w;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
    this.z -= v1.z;
    this.w -= v1.w;
  }

  return this;
};

/**
 * @method EZ3.Vector4#scale
 * @param {Number} s
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.scale = function(s, v) {
  if (v !== undefined) {
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
    this.w = v.w * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }

  return this;
};

/**
 * @method EZ3.Vector4#dot
 * @param {EZ3.Vector4} v
 * @return {Number}
 */
EZ3.Vector4.prototype.dot = function(v) {
  return v.x * this.x + v.y * this.y + v.z * this.z + v.w * this.w;
};

/**
 * @method EZ3.Vector4#max
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
    this.z = (v1.z > v2.z) ? v1.z : v2.z;
    this.w = (v1.w > v2.w) ? v1.w : v2.w;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;

    if (this.z < v1.z)
      this.z = v1.z;

    if (this.w < v1.w)
      this.w = v1.w;
  }

  return this;
};

/**
 * @method EZ3.Vector4#min
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
    this.z = (v1.z < v2.z) ? v1.z : v2.z;
    this.w = (v1.w < v2.w) ? v1.w : v2.w;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;

    if (this.z > v1.z)
      this.z = v1.z;

    if (this.w > v1.w)
      this.w = v1.w;
  }
  return this;
};

/**
 * @method EZ3.Vector4#mulMatrix4
 * @param {EZ3.Matrix4} m
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.mulMatrix4 = function(m, v) {
  var x;
  var y;
  var z;
  var w;
  var e;

  if (m !== undefined) {
    e = m.elements;

    if (v !== undefined) {
      x = v.x;
      y = v.y;
      z = v.z;
      w = v.w;
    } else {
      x = this.x;
      y = this.y;
      z = this.z;
      w = this.w;
    }

    this.x = x * e[0] + y * e[4] + z * e[8] + w * e[12];
    this.y = x * e[1] + y * e[5] + z * e[9] + w * e[13];
    this.z = x * e[2] + y * e[6] + z * e[10] + w * e[14];
    this.w = x * e[3] + y * e[7] + z * e[11] + w * e[15];
  } else {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }

  return this;
};

/**
 * @method EZ3.Vector4#length
 * @return {Number}
 */
EZ3.Vector4.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector4#normalize
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.normalize = function(v) {
  var l;
  var u;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      u = v.clone().scale(1.0 / l);

      this.x = u.x;
      this.y = u.y;
      this.z = u.z;
      this.w = u.w;
    }
  } else {
    l = this.length();

    if (l > 0)
      this.scale(1.0 / l);
  }

  return this;
};

/**
 * @method EZ3.Vector4#negate
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.negate = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
    this.w = -v.w;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
  }

  return this;
};

/**
 * @method EZ3.Vector4#isEqual
 * @param {EZ3.Vector4} v
 * @return {Boolean}
 */
EZ3.Vector4.prototype.isEqual = function(v) {
  if (v !== undefined)
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  else
    return false;
};

/**
 * @method EZ3.Vector4#isDiff
 * @param {EZ3.Vector4} v
 * @return {Boolean}
 */
EZ3.Vector4.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector4#toArray
 * @return {Number[]}
 */
EZ3.Vector4.prototype.toArray = function() {
  return [
    this.x,
    this.y,
    this.z,
    this.w
  ];
};

/**
 * @method EZ3.Vector4#toVector2
 * @return {EZ3.Vector2}
 */
EZ3.Vector4.prototype.toVector2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

/**
 * @method EZ3.Vector4#toVector3
 * @return {EZ3.Vector3}
 */
EZ3.Vector4.prototype.toVector3 = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};
