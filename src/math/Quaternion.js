/**
 * Representation of a quaternion.
 * @class EZ3.Quaternion
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 */

EZ3.Quaternion = function(x, y, z, w) {
  /**
   * @property {Number} x
   * @default 0
   */
  this._x = (x !== undefined) ? x : 0;

  /**
   * @property {Number} y
   * @default 0
   */
  this._y = (y !== undefined) ? y : 0;

  /**
   * @property {Number} z
   * @default 0
   */
  this._z = (z !== undefined) ? z : 0;

  /**
   * @property {Number} w
   * @default 1
   */
  this._w = (w !== undefined) ? w : 1;

  /**
   * @property {EZ3.Signal} onChange
   */
  this.onChange = new EZ3.Signal();
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

/**
 * @method EZ3.Quaternion#add
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 !== undefined) {
    this._w = q1.w + q2.w;
    this._x = q1.x + q2.x;
    this._y = q1.y + q2.y;
    this._z = q1.z + q2.z;
  } else {
    this._w += q1.w;
    this._x += q1.x;
    this._y += q1.y;
    this._z += q1.z;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#sub
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 !== undefined) {
    this._w = q1.w - q2.w;
    this._x = q1.x - q2.x;
    this._y = q1.y - q2.y;
    this._z = q1.z - q2.z;
  } else {
    this._w -= q1.w;
    this._x -= q1.x;
    this._y -= q1.y;
    this._z -= q1.z;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#scale
 * @param {Number} s
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.scale = function(s, q) {
  if (q !== undefined) {
    this._x = q.x * s;
    this._y = q.y * s;
    this._z = q.z * s;
    this._w = q.w * s;
  } else {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._w *= s;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#mul
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.mul = function(q1, q2) {
  var ax;
  var ay;
  var az;
  var aw;
  var bx;
  var by;
  var bz;
  var bw;

  ax = q1.x;
  ay = q1.y;
  az = q1.z;
  aw = q1.w;

  if (q2 !== undefined) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bw = q2.w;
  } else {
    bx = this._x;
    by = this._y;
    bz = this._z;
    bw = this._w;
  }

  this._x = ax * bw + aw * bx + ay * bz - az * by;
  this._y = ay * bw + aw * by + az * bx - ax * bz;
  this._z = az * bw + aw * bz + ax * by - ay * bx;
  this._w = aw * bw - ax * bx - ay * by - az * bz;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#normalize
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q !== undefined) {
    len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);

    if (len > 0.0) {
      len = 1.0 / len;
      q.scale(len);

      this._x = q.x;
      this._y = q.y;
      this._z = q.z;
      this._w = q.w;
    } else {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    }
  } else {
    x2 = this._x * this._x;
    y2 = this._y * this._y;
    z2 = this._z * this._z;
    s2 = this._w * this._w;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0.0) {
      len = 1.0 / len;
      this._scale(len);
    } else {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    }
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#inverse
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.inverse = function(q) {
  if (q !== undefined) {
    this._x = -q.x;
    this._y = -q.y;
    this._z = -q.z;
    this._w = q.w;
  } else {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    this._w = this._w;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#length
 * @return {Number}
 */
EZ3.Quaternion.prototype.length = function() {
  var x2 = this._x * this._x;
  var y2 = this._y * this._y;
  var z2 = this._z * this._z;
  var s2 = this._w * this._w;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

/**
 * @method EZ3.Quaternion#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.set = function(x, y, z, w) {
  this._x = x;
  this._y = y;
  this._z = z;
  this._w = w;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#copy
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.copy = function(q) {
  this._x = q.x;
  this._y = q.y;
  this._z = q.z;
  this._w = q.w;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#clone
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this._x, this._y, this._z, this._w);
};

/**
 * @method EZ3.Quaternion#isEqual
 * @param {EZ3.Quaternion} q
 * @return {Boolean}
 */
EZ3.Quaternion.prototype.isEqual = function(q) {
  if (q !== undefined)
    return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;
  else
    return false;
};

/**
 * @method EZ3.Quaternion#isDiff
 * @param {EZ3.Quaternion} q
 * @return {Boolean}
 */
EZ3.Quaternion.prototype.isDiff = function(q) {
  return !this.isEqual(q);
};

/**
 * @method EZ3.Quaternion#setFromAxisAngle
 * @param {EZ3.Vector3} axis
 * @param {Number} angle
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);

  this._x = sin2 * axis.x;
  this._y = sin2 * axis.y;
  this._z = sin2 * axis.z;
  this._w = Math.cos(0.5 * angle);

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#setFromRotationMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromRotationMatrix = function(m) {
  var te = m.elements;
  var m11 = te[0];
  var m12 = te[4];
  var m13 = te[8];
  var m21 = te[1];
  var m22 = te[5];
  var m23 = te[9];
  var m31 = te[2];
  var m32 = te[6];
  var m33 = te[10];
  var trace = m11 + m22 + m33;
  var s;

  if (trace > 0) {
    s = 0.5 / Math.sqrt(trace + 1.0);

    this._w = 0.25 / s;
    this._x = (m32 - m23) * s;
    this._y = (m13 - m31) * s;
    this._z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

    this._w = (m32 - m23) / s;
    this._x = 0.25 * s;
    this._y = (m12 + m21) / s;
    this._z = (m13 + m31) / s;
  } else if (m22 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

    this._w = (m13 - m31) / s;
    this._x = (m12 + m21) / s;
    this._y = 0.25 * s;
    this._z = (m23 + m32) / s;
  } else {
    s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

    this._w = (m21 - m12) / s;
    this._x = (m13 + m31) / s;
    this._y = (m23 + m32) / s;
    this._z = 0.25 * s;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#setFromEuler
 * @param {EZ3.Euler} euler
 * @param {Boolean} update
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromEuler = function(euler, update) {
  var c1 = Math.cos(euler.x / 2);
  var c2 = Math.cos(euler.y / 2);
  var c3 = Math.cos(euler.z / 2);
  var s1 = Math.sin(euler.x / 2);
  var s2 = Math.sin(euler.y / 2);
  var s3 = Math.sin(euler.z / 2);

  var order = euler.order;

  if (order === EZ3.Euler.XYZ) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.YXZ) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  } else if (order === EZ3.Euler.ZXY) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.ZYX) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  } else if (order === EZ3.Euler.YZX) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.XZY) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  }

  if (update)
    this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#toMatrix3
 * @param {Number} mode
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Matrix3}
 */
EZ3.Quaternion.prototype.toMatrix3 = function(mode, q) {
  var matrix = new EZ3.Matrix3();
  var yy2;
  var xy2;
  var xz2;
  var yz2;
  var zz2;
  var wz2;
  var wy2;
  var wx2;
  var xx2;

  if (q !== undefined) {
    yy2 = 2.0 * q.y * q.y;
    xy2 = 2.0 * q.x * q.y;
    xz2 = 2.0 * q.x * q.z;
    yz2 = 2.0 * q.y * q.z;
    zz2 = 2.0 * q.z * q.z;
    wz2 = 2.0 * q.w * q.z;
    wy2 = 2.0 * q.w * q.y;
    wx2 = 2.0 * q.w * q.x;
    xx2 = 2.0 * q.x * q.x;
  } else {
    yy2 = 2.0 * this._y * this._y;
    xy2 = 2.0 * this._x * this._y;
    xz2 = 2.0 * this._x * this._z;
    yz2 = 2.0 * this._y * this._z;
    zz2 = 2.0 * this._z * this._z;
    wz2 = 2.0 * this._w * this._z;
    wy2 = 2.0 * this._w * this._y;
    wx2 = 2.0 * this._w * this._x;
    xx2 = 2.0 * this._x * this._x;
  }

  matrix.elements[0] = -yy2 - zz2 + 1.0;
  matrix.elements[1] = xy2 - mode * wz2;
  matrix.elements[2] = xz2 + mode * wy2;
  matrix.elements[3] = xy2 + mode * wz2;

  matrix.elements[4] = -xx2 - zz2 + 1.0;
  matrix.elements[5] = yz2 - mode * wx2;
  matrix.elements[6] = xz2 - mode * wy2;
  matrix.elements[7] = yz2 + mode * wx2;

  matrix.elements[8] = -xx2 - yy2 + 1.0;

  return matrix;
};


/**
 * @method EZ3.Quaternion#toMatrix4
 * @param {Number} mode
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Matrix4}
 */
EZ3.Quaternion.prototype.toMatrix4 = function(mode, q) {
  var matrix = new EZ3.Matrix4();
  var yy2;
  var xy2;
  var xz2;
  var yz2;
  var zz2;
  var wz2;
  var wy2;
  var wx2;
  var xx2;

  if (q !== undefined) {
    yy2 = 2.0 * q.y * q.y;
    xy2 = 2.0 * q.x * q.y;
    xz2 = 2.0 * q.x * q.z;
    yz2 = 2.0 * q.y * q.z;
    zz2 = 2.0 * q.z * q.z;
    wz2 = 2.0 * q.w * q.z;
    wy2 = 2.0 * q.w * q.y;
    wx2 = 2.0 * q.w * q.x;
    xx2 = 2.0 * q.x * q.x;
  } else {
    yy2 = 2.0 * this._y * this._y;
    xy2 = 2.0 * this._x * this._y;
    xz2 = 2.0 * this._x * this._z;
    yz2 = 2.0 * this._y * this._z;
    zz2 = 2.0 * this._z * this._z;
    wz2 = 2.0 * this._w * this._z;
    wy2 = 2.0 * this._w * this._y;
    wx2 = 2.0 * this._w * this._x;
    xx2 = 2.0 * this._x * this._x;
  }

  matrix.elements[0] = -yy2 - zz2 + 1.0;
  matrix.elements[4] = xy2 - mode * wz2;
  matrix.elements[8] = xz2 + mode * wy2;


  matrix.elements[1] = xy2 + mode * wz2;
  matrix.elements[5] = -xx2 - zz2 + 1.0;
  matrix.elements[9] = yz2 - mode * wx2;

  matrix.elements[2] = xz2 - mode * wy2;
  matrix.elements[6] = yz2 + mode * wx2;
  matrix.elements[10] = -xx2 - yy2 + 1.0;

  return matrix;
};
/*

var n00 = te[0];
var n10 = te[1];
var n20 = te[2];
var n30 = te[3];
var n01 = te[4];
var n11 = te[5];
var n21 = te[6];
var n31 = te[7];
var n02 = te[8];
var n12 = te[9];
var n22 = te[10];
var n32 = te[11];
var n03 = te[12];
var n13 = te[13];
var n23 = te[14];
var n33 = te[15];
glm::mat4 convertQuaternionToMatrix4(glm::vec4 quat, int mode)
{
	glm::mat4 mat;
    float yy2 = 2.0f * quat[1] * quat[1];
    float xy2 = 2.0f * quat[0] * quat[1];
    float xz2 = 2.0f * quat[0] * quat[2];
    float yz2 = 2.0f * quat[1] * quat[2];
    float zz2 = 2.0f * quat[2] * quat[2];
    float wz2 = 2.0f * quat[3] * quat[2];
    float wy2 = 2.0f * quat[3] * quat[1];
    float wx2 = 2.0f * quat[3] * quat[0];
    float xx2 = 2.0f * quat[0] * quat[0];
    mat[0][0] = - yy2 - zz2 + 1.0f;
    mat[0][1] = xy2 -  mode * wz2;
    mat[0][2] = xz2 +  mode * wy2;
    mat[0][3] = 0;
    mat[1][0] = xy2 + mode * wz2;
    mat[1][1] = - xx2 - zz2 + 1.0f;
    mat[1][2] = yz2 - mode * wx2;
    mat[1][3] = 0;
    mat[2][0] = xz2 - mode * wy2;
    mat[2][1] = yz2 + mode * wx2;
    mat[2][2] = - xx2 - yy2 + 1.0f;
    mat[2][3] = 0;
    mat[3][0] = mat[3][1] = mat[3][2] = 0;
    mat[3][3] = 1;
	return mat;
}
*/
/**
 * @method EZ3.Quaternion#toString
 * @return {String}
 */
EZ3.Quaternion.prototype.toString = function() {
  var x = this._x.toFixed(4);
  var y = this._y.toFixed(4);
  var z = this._z.toFixed(4);
  var w = this._w.toFixed(4);

  return 'Quaternion[' + x + ', ' + y + ', ' + z + ', ' + w + ' ]';
};

Object.defineProperty(EZ3.Quaternion.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'w', {
  get: function() {
    return this._w;
  },
  set: function(w) {
    this._w = w;

    this.onChange.dispatch();
  }
});
