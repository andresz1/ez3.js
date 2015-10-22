/**
 * @class Quaternion
 */

EZ3.Quaternion = function(s, x, y, z) {
  this.s = (s !== undefined) ? s : 1;
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.dirty = true;
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

EZ3.Quaternion.prototype.init = function(s, x, y, z) {
  this.s = (s !== undefined) ? s : 1;
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

  return this;
};

EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 !== undefined) {
    this.s = q1.s + q2.s;
    this.x = q1.x + q2.x;
    this.y = q1.y + q2.y;
    this.z = q1.z + q2.z;
  } else {
    this.s += q1.s;
    this.x += q1.x;
    this.y += q1.y;
    this.z += q1.z;
  }

  return this;
};

EZ3.Quaternion.prototype.addTime = function(v, t) {
  var x;
  var y;
  var z;
  var qs;
  var qx;
  var qy;
  var qz;
  var ns;
  var nx;
  var ny;
  var nz;
  var s;

  x = v.x;
  y = v.y;
  z = v.z;

  qs = this.s;
  qx = this.x;
  qy = this.y;
  qz = this.z;

  t *= 0.5;

  ns = (-x * qx - y * qy - z * qz) * t;
  nx = (x * qs + y * qz - z * qy) * t;
  ny = (-x * qz + y * qs + z * qx) * t;
  nz = (x * qy - y * qx + z * qs) * t;

  qs += ns;
  qx += nx;
  qy += ny;
  qz += nz;

  s = 1 / Math.sqrt(qs * qs + qx * qx + qy * qy + qz * qz);

  this.s = qs * s;
  this.x = qx * s;
  this.y = qy * s;
  this.z = qz * s;

  return this;
};

EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 !== undefined) {
    this.s = q1.s - q2.s;
    this.x = q1.x - q2.x;
    this.y = q1.y - q2.y;
    this.z = q1.z - q2.z;
  } else {
    this.s -= q1.s;
    this.x -= q1.x;
    this.y -= q1.y;
    this.z -= q1.z;
  }

  this.dirty = true;

  return this;
};

EZ3.Quaternion.prototype.scale = function(q, s) {
  this.s = q.s * s;
  this.x = q.x * s;
  this.y = q.y * s;
  this.z = q.z * s;

  return this;
};

EZ3.Quaternion.prototype.mul = function(q1, q2) {
  var ax;
  var ay;
  var az;
  var as;
  var bx;
  var by;
  var bz;
  var bs;

  ax = q1.x;
  ay = q1.y;
  az = q1.z;
  as = q1.s;

  if (q2 !== undefined) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bs = q2.s;
  } else {
    bx = this.x;
    by = this.y;
    bz = this.z;
    bs = this.s;
  }

  this.s = as * bs - ax * bx - ay * by - az * bz;
  this.x = ax * bs + as * bx + ay * bz - az * by;
  this.y = ay * bs + as * by + az * bx - ax * bz;
  this.z = az * bs + as * bz + ax * by - ay * bx;

  return this;
};

EZ3.Quaternion.prototype.arc = function(v1, v2) {
  var x1;
  var y1;
  var z1;
  var x2;
  var y2;
  var z2;
  var cx;
  var cy;
  var cz;
  var d;

  x1 = v1.x;
  y1 = v1.y;
  z1 = v1.z;

  x2 = v2.x;
  y2 = v2.y;
  z2 = v2.z;

  d = x1 * x2 + y1 * y2 + z1 * z2;

  if (d === -1) {
    x2 = y1 * x1 - z1 * z1;
    y2 = -z1 * y1 - x1 * x1;
    z2 = x1 * z1 + y1 * y1;

    d = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);

    this.s = 0;
    this.x = x2 * d;
    this.y = y2 * d;
    this.z = z2 * d;
  } else {
    cx = y1 * z2 - z1 * y2;
    cy = z1 * x2 - x1 * z2;
    cz = x1 * y2 - y1 * x2;

    this.s = Math.sqrt((1 + d) * 0.5);

    d = 0.5 / this.s;

    this.x = cx * d;
    this.y = cy * d;
    this.z = cz * d;
  }

  return this;
};

EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q !== undefined) {
    len = Math.sqrt(q.s * q.s + q.x * q.x + q.y * q.y + q.z * q.z);

    if (len > 0)
      len = 1.0 / len;

    this.s = q.s * len;
    this.x = q.x * len;
    this.y = q.y * len;
    this.z = q.z * len;
  } else {

    s2 = this.s * this.s;
    x2 = this.x * this.x;
    y2 = this.y * this.y;
    z2 = this.z * this.z;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0)
      len = 1.0 / len;

    this.s = this.s * len;
    this.x = this.x * len;
    this.y = this.y * len;
    this.z = this.z * len;
  }
  return this;
};

EZ3.Quaternion.prototype.invert = function(q) {
  if(q !== undefined) {
    this.s = q.s;
    this.x = -q.x;
    this.y = -q.y;
    this.z = -q.z;
  } else {
    this.s = +this.s;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }
  return this;
};

EZ3.Quaternion.prototype.length = function() {
  var s2 = this.s * this.s;
  var x2 = this.x * this.x;
  var y2 = this.y * this.y;
  var z2 = this.z * this.z;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

EZ3.Quaternion.prototype.testDiff = function(q) {
  var ds = (this.s !== q.s);
  var dx = (this.x !== q.x);
  var dy = (this.y !== q.y);
  var dz = (this.z !== q.z);

  return (ds || dx || dy || dz);
};

EZ3.Quaternion.prototype.fromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);
  this.x = sin2 * axis.x;
  this.y = sin2 * axis.y;
  this.z = sin2 * axis.z;
  this.s = Math.cos(0.5 * angle);

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

  if(q) {
    yy2 = 2.0 * q.y * q.y;
    xy2 = 2.0 * q.x * q.y;
    xz2 = 2.0 * q.x * q.z;
    yz2 = 2.0 * q.y * q.z;
    zz2 = 2.0 * q.z * q.z;
    wz2 = 2.0 * q.s * q.z;
    wy2 = 2.0 * q.s * q.y;
    wx2 = 2.0 * q.s * q.x;
    xx2 = 2.0 * q.x * q.x;
  } else {
    yy2 = 2.0 * this.y * this.y;
    xy2 = 2.0 * this.x * this.y;
    xz2 = 2.0 * this.x * this.z;
    yz2 = 2.0 * this.y * this.z;
    zz2 = 2.0 * this.z * this.z;
    wz2 = 2.0 * this.s * this.z;
    wy2 = 2.0 * this.s * this.y;
    wx2 = 2.0 * this.s * this.x;
    xx2 = 2.0 * this.x * this.x;
  }

  matrix.elements[0] = - yy2 - zz2 + 1.0;
  matrix.elements[1] = xy2 - mode * wz2;
  matrix.elements[2] = xz2 + mode * wy2;

  matrix.elements[3] = xy2 + mode * wz2;
  matrix.elements[4] = - xx2 - zz2 + 1.0;
  matrix.elements[5] = yz2 - mode * wx2;

  matrix.elements[6] = xz2 - mode * wy2;
  matrix.elements[7] = yz2 + mode * wx2;
  matrix.elements[8] = - xx2 - yy2 + 1.0;

  return matrix;
};

EZ3.Quaternion.prototype.copy = function(q) {
  this.s = q.s;
  this.x = q.x;
  this.y = q.y;
  this.z = q.z;
  return this;
};

EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this.s, this.x, this.y, this.z);
};

EZ3.Quaternion.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var s = this.s.toFixed(4);

  return 'Quaternion[' + s + ', ' + x + ', ' + y + ', ' + z + ' ]';
};

Object.defineProperty(EZ3.Quaternion.prototype, 's', {
  get: function() {
    return this._s;
  },
  set: function(s) {
    this._s = s;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});

EZ3.Quaternion.NORMAL = 1.0;
EZ3.Quaternion.INVERSE = -1.0;
