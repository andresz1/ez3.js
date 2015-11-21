/**
 * @class Quaternion
 */

EZ3.Quaternion = function(x, y, z, w) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.w = (w !== undefined) ? w : 1.0;
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 instanceof EZ3.Quaternion) {
    this.w = q1.w + q2.w;
    this.x = q1.x + q2.x;
    this.y = q1.y + q2.y;
    this.z = q1.z + q2.z;
  } else {
    this.w += q1.w;
    this.x += q1.x;
    this.y += q1.y;
    this.z += q1.z;
  }
  return this;
};

EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 instanceof EZ3.Quaternion) {
    this.w = q1.w - q2.w;
    this.x = q1.x - q2.x;
    this.y = q1.y - q2.y;
    this.z = q1.z - q2.z;
  } else {
    this.w -= q1.w;
    this.x -= q1.x;
    this.y -= q1.y;
    this.z -= q1.z;
  }
  return this;
};

EZ3.Quaternion.prototype.scale = function(s, q) {
  if (q instanceof EZ3.Quaternion) {
    this.x = q.x * s;
    this.y = q.y * s;
    this.z = q.z * s;
    this.w = q.w * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }
  return this;
};

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

  if (q2 instanceof EZ3.Quaternion) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bw = q2.w;
  } else {
    bx = this.x;
    by = this.y;
    bz = this.z;
    bw = this.w;
  }

  this.x = ax * bw + aw * bx + ay * bz - az * by;
  this.y = ay * bw + aw * by + az * bx - ax * bz;
  this.z = az * bw + aw * bz + ax * by - ay * bx;
  this.w = aw * bw - ax * bx - ay * by - az * bz;

  return this;
};

EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q instanceof EZ3.Quaternion) {
    len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);

    if (len > 0.0) {
      len = 1.0 / len;
      q.scale(len);

      this.x = q.x;
      this.y = q.y;
      this.z = q.z;
      this.w = q.w;
    } else
      console.log('EZ3.Quaterion Error: Quaternion Length is Zero\n\n');

  } else {
    x2 = this.x * this.x;
    y2 = this.y * this.y;
    z2 = this.z * this.z;
    s2 = this.w * this.w;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0.0) {
      len = 1.0 / len;
      this.scale(len);
    } else
      console.log('EZ3.Quaterion Error: Quaternion Length is Zero\n\n');
  }
  return this;
};

EZ3.Quaternion.prototype.invert = function(q) {
  if (q instanceof EZ3.Quaternion) {
    this.x = -q.x;
    this.y = -q.y;
    this.z = -q.z;
    this.w = q.w;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = this.w;
  }
  return this;
};

EZ3.Quaternion.prototype.length = function() {
  var x2 = this.x * this.x;
  var y2 = this.y * this.y;
  var z2 = this.z * this.z;
  var s2 = this.w * this.w;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

EZ3.Quaternion.prototype.testDiff = function(q) {
  var dx = (this.x !== q.x);
  var dy = (this.y !== q.y);
  var dz = (this.z !== q.z);
  var dw = (this.w !== q.w);

  return (dx || dy || dz || dw);
};

EZ3.Quaternion.prototype.fromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);

  this.x = sin2 * axis.x;
  this.y = sin2 * axis.y;
  this.z = sin2 * axis.z;
  this.w = Math.cos(0.5 * angle);

  return this;
};

EZ3.Quaternion.prototype.fromRotationMatrix = function(m) {
  var te = m.elements;
  var  m11 = te[0];
  var  m12 = te[4];
  var  m13 = te[8];
  var  m21 = te[1];
  var  m22 = te[5];
  var  m23 = te[9];
  var  m31 = te[2];
  var  m32 = te[6];
  var  m33 = te[10];
  var trace = m11 + m22 + m33;
  var s;

  if (trace > 0) {
    s = 0.5 / Math.sqrt(trace + 1.0);

    this.w = 0.25 / s;
    this.x = (m32 - m23) * s;
    this.y = (m13 - m31) * s;
    this.z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

    this.w = (m32 - m23) / s;
    this.x = 0.25 * s;
    this.y = (m12 + m21) / s;
    this.z = (m13 + m31) / s;
  } else if (m22 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

    this.w = (m13 - m31) / s;
    this.x = (m12 + m21) / s;
    this.y = 0.25 * s;
    this.z = (m23 + m32) / s;
  } else {
    s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

    this.w = (m21 - m12) / s;
    this.x = (m13 + m31) / s;
    this.y = (m23 + m32) / s;
    this.z = 0.25 * s;
  }

  return this;
};

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

  if (q instanceof EZ3.Quaternion) {
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
    yy2 = 2.0 * this.y * this.y;
    xy2 = 2.0 * this.x * this.y;
    xz2 = 2.0 * this.x * this.z;
    yz2 = 2.0 * this.y * this.z;
    zz2 = 2.0 * this.z * this.z;
    wz2 = 2.0 * this.w * this.z;
    wy2 = 2.0 * this.w * this.y;
    wx2 = 2.0 * this.w * this.x;
    xx2 = 2.0 * this.x * this.x;
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

EZ3.Quaternion.prototype.copy = function(q) {
  this.x = q.x;
  this.y = q.y;
  this.z = q.z;
  this.w = q.w;
  return this;
};

EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this.w, this.x, this.y, this.z);
};

EZ3.Quaternion.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Quaternion[' + x + ', ' + y + ', ' + z + ', ' + w + ' ]';
};

EZ3.Quaternion.NORMAL = 1.0;
EZ3.Quaternion.INVERSE = -1.0;
