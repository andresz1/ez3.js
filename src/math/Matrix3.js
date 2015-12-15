/**
 * @class Matrix3
 */

EZ3.Matrix3 = function(value) {
  this.elements = null;

  if (typeof value === 'number') {
    this.elements = [
      value, 0.0, 0.0,
      0.0, value, 0.0,
      0.0, 0.0, value
    ];
  } else if (value instanceof Array && value.length === 9) {
    this.elements = [
      value[0], value[1], value[2],
      value[3], value[4], value[5],
      value[6], value[7], value[8],
    ];
  } else
    this.identity();
};

EZ3.Matrix3.prototype.constructor = EZ3.Matrix3;

EZ3.Matrix3.prototype.add = function(m1, m2) {
  var em1;
  var em2;

  if (m2 !== undefined) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  this.elements[0] = em1[0] + em2[0];
  this.elements[1] = em1[1] + em2[1];
  this.elements[2] = em1[2] + em2[2];
  this.elements[3] = em1[3] + em2[3];
  this.elements[4] = em1[4] + em2[4];
  this.elements[5] = em1[5] + em2[5];
  this.elements[6] = em1[6] + em2[6];
  this.elements[7] = em1[7] + em2[7];
  this.elements[8] = em1[8] + em2[8];

  return this;
};

EZ3.Matrix3.prototype.sub = function(m1, m2) {
  var em1;
  var em2;

  if (m2 !== undefined) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  this.elements[0] = em1[0] - em2[0];
  this.elements[1] = em1[1] - em2[1];
  this.elements[2] = em1[2] - em2[2];
  this.elements[3] = em1[3] - em2[3];
  this.elements[4] = em1[4] - em2[4];
  this.elements[5] = em1[5] - em2[5];
  this.elements[6] = em1[6] - em2[6];
  this.elements[7] = em1[7] - em2[7];
  this.elements[8] = em1[8] - em2[8];

  return this;
};

EZ3.Matrix3.prototype.scale = function(s, m) {
  var em;

  if (m !== undefined)
    em = m.elements;
  else
    em = this.elements;

  this.elements[0] = em[0] * s;
  this.elements[1] = em[1] * s;
  this.elements[2] = em[2] * s;
  this.elements[3] = em[3] * s;
  this.elements[4] = em[4] * s;
  this.elements[5] = em[5] * s;
  this.elements[6] = em[6] * s;
  this.elements[7] = em[7] * s;
  this.elements[8] = em[8] * s;

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

  return this;
};

EZ3.Matrix3.prototype.transpose = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var tmp;

  tmp = e[1];
  e[1] = e[3];
  e[3] = tmp;
  tmp = e[2];
  e[2] = e[6];
  e[6] = tmp;
  tmp = e[5];
  e[5] = e[7];
  e[7] = tmp;

  this.elements[0] = e[0];
  this.elements[1] = e[1];
  this.elements[2] = e[2];
  this.elements[3] = e[3];
  this.elements[4] = e[4];
  this.elements[5] = e[5];
  this.elements[6] = e[6];
  this.elements[7] = e[7];
  this.elements[8] = e[8];

  return this;
};

EZ3.Matrix3.prototype.setFromQuaternion = function(q) {
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

  return this;
};

EZ3.Matrix3.prototype.inverse = function(m) {
  var e = m.elements;
  var det;

  this.elements[0] = e[10] * e[5] - e[6] * e[9];
  this.elements[1] = -e[10] * e[1] + e[2] * e[9];
  this.elements[2] = e[6] * e[1] - e[2] * e[5];
  this.elements[3] = -e[10] * e[4] + e[6] * e[8];
  this.elements[4] = e[10] * e[0] - e[2] * e[8];
  this.elements[5] = -e[6] * e[0] + e[2] * e[4];
  this.elements[6] = e[9] * e[4] - e[5] * e[8];
  this.elements[7] = -e[9] * e[0] + e[1] * e[8];
  this.elements[8] = e[5] * e[0] - e[1] * e[4];

  det = e[0] * this.elements[0] + e[1] * this.elements[3] + e[2] * this.elements[6];

  if (det === 0)
    return this.identity();

  this.scale(1.0 / det);

  return this;
};

EZ3.Matrix3.prototype.normalFromMat4 = function(m) {
  this.inverse(m).transpose();
  return this;
};

EZ3.Matrix3.prototype.identity = function() {
  this.elements = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  ];

  return this;
};

EZ3.Matrix3.prototype.clone = function() {
  return new EZ3.Matrix3(this.elements);
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
    this.elements[3].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + '\n' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + '\n' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + '\n]';
};

EZ3.Matrix3.prototype.isEqual = function(m) {
  if (m !== undefined) {
    return m.elements[0] === this.elements[0] &&
      m.elements[1] === this.elements[1] &&
      m.elements[2] === this.elements[2] &&
      m.elements[3] === this.elements[3] &&
      m.elements[4] === this.elements[4] &&
      m.elements[5] === this.elements[5] &&
      m.elements[6] === this.elements[6] &&
      m.elements[7] === this.elements[7] &&
      m.elements[8] === this.elements[8];
  } else
    return false;
};

EZ3.Matrix3.prototype.isDiff = function(m) {
  if (m !== undefined) {
    return !this.isEqual(m);
  } else
    return true;
};
