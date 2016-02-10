/**
 * Representation of a 3D vector.
 * @class EZ3.Vector3
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 */
EZ3.Vector3 = function(x, y, z) {
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

  if (typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
    this.z = (typeof z === 'number') ? z : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
  }
};

EZ3.Vector3.prototype.constructor = EZ3.Vector3;

/**
 * @method EZ3.Vector3#add
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
  } else {
    this.x += v1.x;
    this.y += v1.y;
    this.z += v1.z;
  }
  return this;
};

/**
 * @method EZ3.Vector3#sub
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
    this.z -= v1.z;
  }

  return this;
};

/**
 * @method EZ3.Vector3#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = (typeof y === 'number') ? y : x;
  this.z = (typeof z === 'number') ? z : x;

  return this;
};

/**
 * @method EZ3.Vector3#scale
 * @param {Number} s
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.scale = function(s, v) {
  if (v !== undefined) {
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }

  return this;
};

/**
 * @method EZ3.Vector3#dot
 * @param {EZ3.Vector3} v
 * @return {Number}
 */
EZ3.Vector3.prototype.dot = function(v) {
  if (v !== undefined)
    return v.x * this.x + v.y * this.y + v.z * this.z;
  else
    return -1;
};

/**
 * @method EZ3.Vector3#max
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
    this.z = (v1.z > v2.z) ? v1.z : v2.z;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;

    if (this.z < v1.z)
      this.z = v1.z;
  }
  return this;
};

/**
 * @method EZ3.Vector3#min
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
    this.z = (v1.z < v2.z) ? v1.z : v2.z;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;

    if (this.z > v1.z)
      this.z = v1.z;
  }
  return this;
};

/**
 * @method EZ3.Vector3#cross
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.cross = function(v1, v2) {
  var x;
  var y;
  var z;

  if (v2 !== undefined) {
    x = v1.y * v2.z - v1.z * v2.y;
    y = v1.z * v2.x - v1.x * v2.z;
    z = v1.x * v2.y - v1.y * v2.x;
  } else {
    x = v1.y * this.z - v1.z * this.y;
    y = v1.z * this.x - v1.x * this.z;
    z = v1.x * this.y - v1.y * this.x;
  }

  this.x = x;
  this.y = y;
  this.z = z;

  return this;
};

/**
 * @method EZ3.Vector3#mulMatrix3
 * @param {EZ3.Matrix3} m
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.mulMatrix3 = function(m, v) {
  var e = m.elements;;
  var x;
  var y;
  var z;

  if (v !== undefined) {
    x = v.x;
    y = v.y;
    z = v.z;
  } else {
    x = this.x;
    y = this.y;
    z = this.z;
  }

  this.x = x * e[0] + y * e[3] + z * e[6];
  this.y = x * e[1] + y * e[4] + z * e[7];
  this.z = x * e[2] + y * e[5] + z * e[8];

  return this;
};

/**
 * @method EZ3.Vector3#mulMatrix4
 * @param {EZ3.Matrix3} m
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.mulMatrix4 = function(m, v) {
  var e = m.elements;
  var x;
  var y;
  var z;

  if (v !== undefined) {
    x = v.x;
    y = v.y;
    z = v.z;
  } else {
    x = this.x;
    y = this.y;
    z = this.z;
  }

  this.x = x * e[0] + y * e[4] + z * e[8] + e[12];
  this.y = x * e[1] + y * e[5] + z * e[9] + e[13];
  this.z = x * e[2] + y * e[6] + z * e[10] + e[14];

  return this;
};

/**
 * @method EZ3.Vector3#mulQuaternion
 * @param {EZ3.Vector3} q
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.mulQuaternion = function(q) {
  var x = this.x;
  var y = this.y;
  var z = this.z;

  var qx = q.x;
  var qy = q.y;
  var qz = q.z;
  var qw = q.w;

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return this;
};

/**
 * @method EZ3.Vector3#length
 * @return {Number}
 */
EZ3.Vector3.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector3#distance
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {Number}
 */
EZ3.Vector3.prototype.distance = function(v1, v2) {
  var dx;
  var dy;
  var dz;

  if (v2 !== undefined) {
    dx = v1.x - v2.x;
    dy = v1.y - v2.y;
    dz = v1.z - v2.z;
  } else {
    dx = this.x - v1.x;
    dy = this.y - v1.y;
    dz = this.z - v1.z;
  }

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * @method EZ3.Vector3#normalize
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    }
  }
};

/**
 * @method EZ3.Vector3#negate
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.negate = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  return this;
};

/**
 * @method EZ3.Vector3#clone
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.clone = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

/**
 * @method EZ3.Vector3#copy
 * @param {EZ3.Vector3} v
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;

  return this;
};

/**
 * @method EZ3.Vector3#setPositionFromWorldMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.setPositionFromWorldMatrix = function(m) {
  if (m !== undefined) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];
  }

  return this;
};

/**
 * @method EZ3.Vector3#setFromViewProjectionMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.setFromViewProjectionMatrix = function(m) {
  var e = m.elements;
  var x = this.x;
  var y = this.y;
  var z = this.z;
  var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
  this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
  this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

  return this;
};

/**
 * @method EZ3.Vector3#isEqual
 * @param {EZ3.Vector3} v
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isEqual = function(v) {
  if (v !== undefined)
    return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
  else
    return false;
};

/**
 * @method EZ3.Vector3#isZeroVector
 * @param {EZ3.Vector3} [v]
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isZeroVector = function(v) {
  if (v !== undefined)
    return (v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0);
  else
    return (this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0);
};

/**
 * @method EZ3.Vector3#isDiff
 * @param {EZ3.Vector3} v
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector3#toArray
 * @return {Number[]}
 */
EZ3.Vector3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
};

/**
 * @method EZ3.Vector3#toString
 * @return {String}
 */
EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);

  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

/**
 * @method EZ3.Vector3#toVector2
 * @return {EZ3.Vector2}
 */
EZ3.Vector3.prototype.toVector2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};
