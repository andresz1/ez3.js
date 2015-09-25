/**
 * @class Matrix3
 */

EZ3.Matrix3 = function(e00, e01, e02, e10, e11, e12, e20, e21, e22) {
  this.dirty = true;
  this._elements = [];

  this.init(
    e00 || 1, e01 || 0, e02 || 0,
    e10 || 0, e11 || 1, e12 || 0,
    e20 || 0, e21 || 0, e22 || 1
  );
};

EZ3.Matrix3.prototype.constructor = EZ3.Matrix3;

EZ3.Matrix3.prototype.init = function(e00, e01, e02, e10, e11, e12, e20, e21, e22) {
  this.elements = [
    e00, e01, e02,
    e10, e11, e12,
    e20, e21, e22
  ];

  return this;
};

EZ3.Matrix3.prototype.add = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2 = m2.elements;

  e[0] = em1[0] + em2[0];
  e[1] = em1[1] + em2[1];
  e[2] = em1[2] + em2[2];
  e[3] = em1[3] + em2[3];
  e[4] = em1[4] + em2[4];
  e[5] = em1[5] + em2[5];
  e[6] = em1[6] + em2[6];
  e[7] = em1[7] + em2[7];
  e[8] = em1[8] + em2[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.addEqual = function(m) {
  var em = m.elements;

  this.elements[0] += em[0];
  this.elements[1] += em[1];
  this.elements[2] += em[2];
  this.elements[3] += em[3];
  this.elements[4] += em[4];
  this.elements[5] += em[5];
  this.elements[6] += em[6];
  this.elements[7] += em[7];
  this.elements[8] += em[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.sub = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2 = m2.elements;

  e[0] = em1[0] - em2[0];
  e[1] = em1[1] - em2[1];
  e[2] = em1[2] - em2[2];
  e[3] = em1[3] - em2[3];
  e[4] = em1[4] - em2[4];
  e[5] = em1[5] - em2[5];
  e[6] = em1[6] - em2[6];
  e[7] = em1[7] - em2[7];
  e[8] = em1[8] - em2[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.subEqual = function(m) {
  var em = m.elements;

  this.elements[0] -= em[0];
  this.elements[1] -= em[1];
  this.elements[2] -= em[2];
  this.elements[3] -= em[3];
  this.elements[4] -= em[4];
  this.elements[5] -= em[5];
  this.elements[6] -= em[6];
  this.elements[7] -= em[7];
  this.elements[8] -= em[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.scale = function(m, s) {
  var em = m.elements;

  this.elements[0] = em[0] * s;
  this.elements[1] = em[1] * s;
  this.elements[2] = em[2] * s;
  this.elements[3] = em[3] * s;
  this.elements[4] = em[4] * s;
  this.elements[5] = em[5] * s;
  this.elements[6] = em[6] * s;
  this.elements[7] = em[7] * s;
  this.elements[8] = em[8] * s;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.scaleEqual = function(s) {
  this.elements[0] *= s;
  this.elements[1] *= s;
  this.elements[2] *= s;
  this.elements[3] *= s;
  this.elements[4] *= s;
  this.elements[5] *= s;
  this.elements[6] *= s;
  this.elements[7] *= s;
  this.elements[8] *= s;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.mul = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2;
  var a0;
  var a1;
  var a2;
  var a3;
  var a4;
  var a5;
  var a6;
  var a7;
  var a8;
  var b0;
  var b1;
  var b2;
  var b3;
  var b4;
  var b5;
  var b6;
  var b7;
  var b8;

  if (m2 !== undefined) {
    em2 = m2.elements;

    a0 = em1[0];
    a1 = em1[1];
    a2 = em1[2];
    a3 = em1[3];
    a4 = em1[4];
    a5 = em1[5];
    a6 = em1[6];
    a7 = em1[7];
    a8 = em1[8];

    b0 = em2[0];
    b1 = em2[1];
    b2 = em2[2];
    b3 = em2[3];
    b4 = em2[4];
    b5 = em2[5];
    b6 = em2[6];
    b7 = em2[7];
    b8 = em2[8];
  } else {
    a0 = e[0];
    a1 = e[1];
    a2 = e[2];
    a3 = e[3];
    a4 = e[4];
    a5 = e[5];
    a6 = e[6];
    a7 = e[7];
    a8 = e[8];

    b0 = em1[0];
    b1 = em1[1];
    b2 = em1[2];
    b3 = em1[3];
    b4 = em1[4];
    b5 = em1[5];
    b6 = em1[6];
    b7 = em1[7];
    b8 = em1[8];
  }

  this.elements[0] = a0 * b0 + a1 * b3 + a2 * b6;
  this.elements[1] = a0 * b1 + a1 * b4 + a2 * b7;
  this.elements[2] = a0 * b2 + a1 * b5 + a2 * b8;
  this.elements[3] = a3 * b0 + a4 * b3 + a5 * b6;
  this.elements[4] = a3 * b1 + a4 * b4 + a5 * b7;
  this.elements[5] = a3 * b2 + a4 * b5 + a5 * b8;
  this.elements[6] = a6 * b0 + a7 * b3 + a8 * b6;
  this.elements[7] = a6 * b1 + a7 * b4 + a8 * b7;
  this.elements[8] = a6 * b2 + a7 * b5 + a8 * b8;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.mulScale = function(m, sx, sy, sz, Prepend) {
  var em = m.elements;
  var e = this.elements;
  var prepend = Prepend || false;

  if (prepend) {
    e[0] = sx * em[0];
    e[1] = sx * em[1];
    e[2] = sx * em[2];
    e[3] = sy * em[3];
    e[4] = sy * em[4];
    e[5] = sy * em[5];
    e[6] = sz * em[6];
    e[7] = sz * em[7];
    e[8] = sz * em[8];
  } else {
    e[0] = em[0] * sx;
    e[1] = em[1] * sy;
    e[2] = em[2] * sz;
    e[3] = em[3] * sx;
    e[4] = em[4] * sy;
    e[5] = em[5] * sz;
    e[6] = em[6] * sx;
    e[7] = em[7] * sy;
    e[8] = em[8] * sz;
  }

  this.elements = e;

  return this;
};

EZ3.Matrix3.prototype.mulRotate = function(m, rad, ax, ay, az, Prepend) {
  var tm = m.elements;
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var c1 = 1 - c;
  var r00 = ax * ax * c1 + c;
  var r01 = ax * ay * c1 - az * s;
  var r02 = ax * az * c1 + ay * s;
  var r10 = ay * ax * c1 + az * s;
  var r11 = ay * ay * c1 + c;
  var r12 = ay * az * c1 - ax * s;
  var r20 = az * ax * c1 - ay * s;
  var r21 = az * ay * c1 + ax * s;
  var r22 = az * az * c1 + c;
  var a0 = tm[0];
  var a3 = tm[3];
  var a6 = tm[6];
  var a1 = tm[1];
  var a4 = tm[4];
  var a7 = tm[7];
  var a2 = tm[2];
  var a5 = tm[5];
  var a8 = tm[8];
  var prepend = Prepend || false;

  if (prepend) {
    this.elements[0] = r00 * a0 + r01 * a3 + r02 * a6;
    this.elements[1] = r00 * a1 + r01 * a4 + r02 * a7;
    this.elements[2] = r00 * a2 + r01 * a5 + r02 * a8;
    this.elements[3] = r10 * a0 + r11 * a3 + r12 * a6;
    this.elements[4] = r10 * a1 + r11 * a4 + r12 * a7;
    this.elements[5] = r10 * a2 + r11 * a5 + r12 * a8;
    this.elements[6] = r20 * a0 + r21 * a3 + r22 * a6;
    this.elements[7] = r20 * a1 + r21 * a4 + r22 * a7;
    this.elements[8] = r20 * a2 + r21 * a5 + r22 * a8;
  } else {
    this.elements[0] = a0 * r00 + a1 * r10 + a2 * r20;
    this.elements[1] = a0 * r01 + a1 * r11 + a2 * r21;
    this.elements[2] = a0 * r02 + a1 * r12 + a2 * r22;
    this.elements[3] = a3 * r00 + a4 * r10 + a5 * r20;
    this.elements[4] = a3 * r01 + a4 * r11 + a5 * r21;
    this.elements[5] = a3 * r02 + a4 * r12 + a5 * r22;
    this.elements[6] = a6 * r00 + a7 * r10 + a8 * r20;
    this.elements[7] = a6 * r01 + a7 * r11 + a8 * r21;
    this.elements[8] = a6 * r02 + a7 * r12 + a8 * r22;
  }

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.transpose = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var a0 = e[0];
  var a1 = e[1];
  var a2 = e[2];
  var a3 = e[3];
  var a4 = e[4];
  var a5 = e[5];
  var a6 = e[6];
  var a7 = e[7];
  var a8 = e[8];

  this.elements[0] = a0;
  this.elements[1] = a3;
  this.elements[2] = a6;
  this.elements[3] = a1;
  this.elements[4] = a4;
  this.elements[5] = a7;
  this.elements[6] = a2;
  this.elements[7] = a5;
  this.elements[8] = a8;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.setQuat = function(q) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var sx = q.s * x2;
  var sy = q.s * y2;
  var sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = xy + sz;
  this.elements[4] = 1 - xx - zz;
  this.elements[5] = yz - sx;
  this.elements[6] = xz - sy;
  this.elements[7] = yz + sx;
  this.elements[8] = 1 - xx - yy;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.invert = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var a0 = e[0];
  var a3 = e[3];
  var a6 = e[6];
  var a1 = e[1];
  var a4 = e[4];
  var a7 = e[7];
  var a2 = e[2];
  var a5 = e[5];
  var a8 = e[8];
  var b01 = a4 * a8 - a7 * a5;
  var b11 = a7 * a2 - a1 * a8;
  var b21 = a1 * a5 - a4 * a2;
  var dt = a0 * (b01) + a3 * (b11) + a6 * (b21);

  if (dt !== 0)
    dt = 1.0 / dt;

  this.elements[0] = dt * b01;
  this.elements[1] = dt * b11;
  this.elements[2] = dt * b21;
  this.elements[3] = dt * (a5 * a6 - a3 * a8);
  this.elements[4] = dt * (a0 * a8 - a2 * a6);
  this.elements[5] = dt * (a2 * a3 - a0 * a5);
  this.elements[6] = dt * (a3 * a7 - a4 * a6);
  this.elements[7] = dt * (a1 * a6 - a0 * a7);
  this.elements[8] = dt * (a0 * a4 - a1 * a3);

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.normalFromMat4 = function(m) {
  var em = m.elements;
  var a00 = em[0];
  var a01 = em[1];
  var a02 = em[2];
  var a03 = em[3];
  var a10 = em[4];
  var a11 = em[5];
  var a12 = em[6];
  var a13 = em[7];
  var a20 = em[8];
  var a21 = em[9];
  var a22 = em[10];
  var a23 = em[11];
  var a30 = em[12];
  var a31 = em[13];
  var a32 = em[14];
  var a33 = em[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  var det;

  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det)
    return null;

  det = 1.0 / det;

  this.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.elements[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.elements[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  this.elements[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.elements[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.elements[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  this.elements[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.elements[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.elements[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.identity = function() {
  this.elements = [
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0
  ];

  return this;
};

EZ3.Matrix3.prototype.clone = function() {
  return new EZ3.Matrix3(
    this.elements[0],
    this.elements[1],
    this.elements[2],
    this.elements[3],
    this.elements[4],
    this.elements[5],
    this.elements[6],
    this.elements[7],
    this.elements[8]
  );
};

EZ3.Matrix3.prototype.copy = function(m) {
  this.elements = m.elements;
  return this;
};

EZ3.Matrix3.prototype.toArray = function() {
  return this.elements;
};

EZ3.Matrix3.prototype.toString = function() {
  return 'Matrix3[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[2].toFixed(4) + '\n' +
    this.elements[3].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + '\n' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + '\n]';
};

EZ3.Matrix3.prototype.set = EZ3.Matrix3.prototype.init;

Object.defineProperty(EZ3.Matrix3.prototype, 'elements', {
  get: function() {
    return this._elements;
  },
  set: function(e) {
    this._elements = e;
    this.dirty = true;
  }
});
