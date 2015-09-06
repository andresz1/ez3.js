/**
 * @class Matrix4
 */

EZ3.Matrix4 = function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
  this._elements = [];
  this._dirty = true;

  this.init(
    e00 || 1, e01 || 0, e02 || 0, e03 || 0,
    e10 || 0, e11 || 1, e12 || 0, e13 || 0,
    e20 || 0, e21 || 0, e22 || 1, e23 || 0,
    e30 || 0, e31 || 0, e32 || 0, e33 || 1
  );
};

EZ3.Matrix4.prototype.constructor = EZ3.Matrix4;

EZ3.Matrix4.prototype.init = function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
  this.elements = [
    e00, e01, e02, e03,
    e10, e11, e12, e13,
    e20, e21, e22, e23,
    e30, e31, e32, e33
  ];
  return this;
};

EZ3.Matrix4.prototype.transpose = function(m) {
  var em;

  if (m !== undefined) {
    var e01, e02, e03, e12, e13, e23;

    em = m.elements;

    e01 = em[1];
    e02 = em[2];
    e03 = em[3];
    e12 = em[6];
    e13 = em[7];
    e23 = em[11];

    this.elements[1] = em[4];
    this.elements[2] = em[8];
    this.elements[3] = em[12];
    this.elements[4] = a01;
    this.elements[6] = em[9];
    this.elements[7] = em[13];
    this.elements[8] = e02;
    this.elements[9] = e12;
    this.elements[11] = em[14];
    this.elements[12] = e03;
    this.elements[13] = e13;
    this.elements[14] = e23;
  } else {
    em = this.elements;

    this.elements[0] = em[0];
    this.elements[1] = em[4];
    this.elements[2] = em[8];
    this.elements[3] = em[12];
    this.elements[4] = em[1];
    this.elements[5] = em[5];
    this.elements[6] = em[9];
    this.elements[7] = em[13];
    this.elements[8] = em[2];
    this.elements[9] = em[6];
    this.elements[10] = em[10];
    this.elements[11] = em[14];
    this.elements[12] = em[3];
    this.elements[13] = em[7];
    this.elements[14] = em[11];
    this.elements[15] = em[15];
  }

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.invert = function(m) {
  var det;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var a30, a31, a32, a33;
  var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11;

  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  a30 = a[12];
  a31 = a[13];
  a32 = a[14];
  a33 = a[15];

  b00 = a00 * a11 - a01 * a10;
  b01 = a00 * a12 - a02 * a10;
  b02 = a00 * a13 - a03 * a10;
  b03 = a01 * a12 - a02 * a11;
  b04 = a01 * a13 - a03 * a11;
  b05 = a02 * a13 - a03 * a12;
  b06 = a20 * a31 - a21 * a30;
  b07 = a20 * a32 - a22 * a30;
  b08 = a20 * a33 - a23 * a30;
  b09 = a21 * a32 - a22 * a31;
  b10 = a21 * a33 - a23 * a31;
  b11 = a22 * a33 - a23 * a32;

  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det)
    return null;

  det = 1.0 / det;

  this.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.elements[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.elements[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.elements[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  this.elements[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.elements[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.elements[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.elements[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  this.elements[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  this.elements[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  this.elements[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  this.elements[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  this.elements[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  this.elements[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  this.elements[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  this.elements[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return this;
};

EZ3.Matrix4.prototype.mul = function(m1, m2) {
  var em1, em2;

  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var a30, a31, a32, a33;

  var b00, b01, b02, b03;
  var b10, b11, b12, b13;
  var b20, b21, b22, b23;
  var b30, b31, b32, b33;

  if (m2 !== undefined) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  a00 = em1[0];
  a01 = em1[1];
  a02 = em1[2];
  a03 = em1[3];
  a10 = em1[4];
  a11 = em1[5];
  a12 = em1[6];
  a13 = em1[7];
  a20 = em1[8];
  a21 = em1[9];
  a22 = em1[10];
  a23 = em1[11];
  a30 = em1[12];
  a31 = em1[13];
  a32 = em1[14];
  a33 = em1[15];

  b00 = em2[0];
  b01 = em2[1];
  b02 = em2[2];
  b03 = em2[3];
  b10 = em2[4];
  b11 = em2[5];
  b12 = em2[6];
  b13 = em2[7];
  b20 = em2[8];
  b21 = em2[9];
  b22 = em2[10];
  b23 = em2[11];
  b30 = em2[12];
  b31 = em2[13];
  b32 = em2[14];
  b33 = em2[15];

  this.elements[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  this.elements[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  this.elements[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  this.elements[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

  this.elements[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  this.elements[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  this.elements[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  this.elements[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

  this.elements[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  this.elements[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  this.elements[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  this.elements[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

  this.elements[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  this.elements[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  this.elements[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  this.elements[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

  return this;
};

EZ3.Matrix4.prototype.translate = function(m, v) {
  var em;
  var x, y, z;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var a30, a31, a32, a33;

  em = m.elements;

  a00 = em[0];
  a01 = em[1];
  a02 = em[2];
  a03 = em[3];
  a10 = em[0];
  a11 = em[1];
  a12 = em[2];
  a13 = em[3];
  a20 = em[0];
  a21 = em[1];
  a22 = em[2];
  a23 = em[3];

  this.elements[0] = a00;
  this.elements[1] = a01;
  this.elements[2] = a02;
  this.elements[3] = a03;
  this.elements[4] = a10;
  this.elements[5] = a11;
  this.elements[6] = a12;
  this.elements[7] = a13;
  this.elements[8] = a20;
  this.elements[9] = a21;
  this.elements[10] = a22;
  this.elements[11] = a23;
  this.elements[12] = a00 * x + a10 * y + a20 * z + this.elements[12];
  this.elements[13] = a01 * x + a11 * y + a21 * z + this.elements[13];
  this.elements[14] = a02 * x + a12 * y + a22 * z + this.elements[14];
  this.elements[15] = a03 * x + a13 * y + a23 * z + this.elements[15];

  return this;
};

EZ3.Matrix4.prototype.scale = function(m, s) {
  var em;
  var x, y, z;

  x = s.x;
  y = s.y;
  z = s.z;

  em = m.elements;

  this.elements[0] = em[0] * x;
  this.elements[1] = em[1] * x;
  this.elements[2] = em[2] * x;
  this.elements[3] = em[3] * x;

  this.elements[4] = em[4] * y;
  this.elements[5] = em[5] * y;
  this.elements[6] = em[6] * y;
  this.elements[7] = em[7] * y;

  this.elements[8] = em[8] * z;
  this.elements[9] = em[9] * z;
  this.elements[10] = em[10] * z;
  this.elements[11] = em[11] * z;

  this.elements[12] = em[12];
  this.elements[13] = em[13];
  this.elements[14] = em[14];
  this.elements[15] = em[15];

  return this;
};

EZ3.Matrix4.prototype.setQuat = function(q) {
  var x2, y2, z2;
  var sx, sy, sz;
  var xx, xy, xz, yy, yz, zz;

  x2 = 2 * q.x;
  y2 = 2 * q.y;
  z2 = 2 * q.z;

  xx = q.x * x2;
  yy = q.y * y2;
  zz = q.z * z2;
  xy = q.x * y2;
  yz = q.y * z2;
  xz = q.x * z2;

  sx = q.s * x2;
  sy = q.s * y2;
  sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = 0;

  this.elements[4] = xy + sz;
  this.elements[5] = 1 - xx - zz;
  this.elements[6] = yz - sx;
  this.elements[7] = 0;

  this.elements[8] = xz - sy;
  this.elements[9] = yz + sx;
  this.elements[10] = 1 - xx - yy;
  this.elements[11] = 0;

  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = 0;
  this.elements[15] = 1;

  return this;
};

EZ3.Matrix4.prototype.fromRotationTranslation = function(m, q, v) {
  var x2, y2, z2;
  var sx, sy, sz;
  var xx, xy, xz, yy, yz, zz;

  x2 = 2 * q.x;
  y2 = 2 * q.y;
  z2 = 2 * q.z;

  xx = q.x * x2;
  yy = q.y * y2;
  zz = q.z * z2;
  xy = q.x * y2;
  yz = q.y * z2;
  xz = q.x * z2;

  sx = q.s * x2;
  sy = q.s * y2;
  sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = 0;

  this.elements[4] = xy + sz;
  this.elements[5] = 1 - xx - zz;
  this.elements[6] = yz - sx;
  this.elements[7] = 0;

  this.elements[8] = xz - sy;
  this.elements[9] = yz + sx;
  this.elements[10] = 1 - xx - yy;
  this.elements[11] = 0;

  this.elements[12] = v.x;
  this.elements[13] = v.y;
  this.elements[14] = v.z;
  this.elements[15] = 1;

  return this;
};

EZ3.Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2.0);
  var nf = 1.0 / (near - far);

  this.elements[0] = f / aspect;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;

  this.elements[4] = 0;
  this.elements[5] = f;
  this.elements[6] = 0;
  this.elements[7] = 0;

  this.elements[8] = 0;
  this.elements[9] = 0;
  this.elements[10] = (far + near) * nf;
  this.elements[11] = -1;

  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = (2 * far * near) * nf;
  this.elements[15] = 0;

  return this;
};

EZ3.Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);

  this.elements[0] = (near * 2) * rl;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;

  this.elements[4] = 0;
  this.elements[5] = (near * 2) * tb;
  this.elements[6] = 0;
  this.elements[7] = 0;

  this.elements[8] = (right + left) * rl;
  this.elements[9] = (top + bottom) * tb;
  this.elements[10] = (far + near) * nf;
  this.elements[11] = -1;

  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = (far * near * 2) * nf;
  this.elements[15] = 0;

  return this;
};

EZ3.Matrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);

  this.elements[0] = -2 * lr;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;

  this.elements[4] = 0;
  this.elements[5] = -2 * bt;
  this.elements[6] = 0;
  this.elements[7] = 0;

  this.elements[8] = 0;
  this.elements[9] = 0;
  this.elements[10] = 2 * nf;
  this.elements[11] = 0;

  this.elements[12] = (left + right) * lr;
  this.elements[13] = (top + bottom) * bt;
  this.elements[14] = (far + near) * nf;
  this.elements[15] = 1;

  return this;
};

EZ3.Matrix4.prototype.lookAt = function(eye, center, up) {
  var len;
  var x0, x1, x2;
  var y0, y1, y2;
  var z0, z1, z2;
  var upx, upy, upz;
  var eyex, eyey, eyez;
  var centerx, centery, centerz;

  upx = up.x;
  upy = up.y;
  upz = up.z;

  eyex = eye.x;
  eyey = eye.y;
  eyez = eye.z;

  centerx = center.x;
  centery = center.y;
  centerz = center.z;

  if (Math.abs(eyex - centerx) < 0.000001 &&
    Math.abs(eyey - centery) < 0.000001 &&
    Math.abs(eyez - centerz) < 0.000001) {
    return this.identity();
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);

  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;

  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  this.elements[0] = x0;
  this.elements[1] = y0;
  this.elements[2] = z0;
  this.elements[3] = 0;
  this.elements[4] = x1;
  this.elements[5] = y1;
  this.elements[6] = z1;
  this.elements[7] = 0;
  this.elements[8] = x2;
  this.elements[9] = y2;
  this.elements[10] = z2;
  this.elements[11] = 0;
  this.elements[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  this.elements[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  this.elements[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  this.elements[15] = 1;

  return this;
};

EZ3.Matrix4.prototype.identity = function() {
  this.elements = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  return this;
};

EZ3.Matrix4.prototype.clone = function() {
  return new EZ3.Matrix4(
    this.elements[0], this.elements[1], this.elements[2], this.elements[3],
    this.elements[4], this.elements[5], this.elements[6], this.elements[7],
    this.elements[8], this.elements[9], this.elements[10], this.elements[11],
    this.elements[12], this.elements[13], this.elements[14], this.elements[15]
  );
};

EZ3.Matrix4.prototype.copy = function(m) {
  this.elements = m.elements;
  return this;
};

EZ3.Matrix4.prototype.toArray = function() {
  return this.elements;
};

EZ3.Matrix4.prototype.toString = function() {
  return 'Matrix4[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[3].toFixed(4) + '\n' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + '\n' +
    this.elements[8].toFixed(4) + ', ' +
    this.elements[9].toFixed(4) + ', ' +
    this.elements[10].toFixed(4) + ', ' +
    this.elements[11].toFixed(4) + '\n' +
    this.elements[12].toFixed(4) + ', ' +
    this.elements[13].toFixed(4) + ', ' +
    this.elements[14].toFixed(4) + ', ' +
    this.elements[15].toFixed(4) + '\n]';
};

EZ3.Matrix4.prototype.set = EZ3.Matrix4.prototype.init;

Object.defineProperty(EZ3.Matrix4.prototype, 'elements', {
  get: function() {
    return this._elements;
  },
  set: function(e) {
    this._elements = e;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Matrix4.prototype, 'dirty', {
  get: function() {
    return this._dirty;
  },
  set: function(dirty) {
    this._dirty = dirty;
  }
});
