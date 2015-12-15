/**
 * @class Matrix4
 */

EZ3.Matrix4 = function(value) {
  this.elements = null;

  if (typeof value === 'number') {
    this.elements = [
      value, 0.0, 0.0, 0.0,
      0.0, value, 0.0, 0.0,
      0.0, 0.0, value, 0.0,
      0.0, 0.0, 0.0, value
    ];
  } else if (value instanceof Array && value.length === 16) {
    this.elements = [
      value[0], value[1], value[2], value[3],
      value[4], value[5], value[6], value[7],
      value[8], value[9], value[10], value[11],
      value[12], value[13], value[14], value[15]
    ];
  } else
    this.identity();
};

EZ3.Matrix4.prototype.constructor = EZ3.Matrix4;

EZ3.Matrix4.prototype.transpose = function(m) {
  var e01;
  var e02;
  var e03;
  var e12;
  var e13;
  var e23;
  var em;

  if (m !== undefined) {
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
    this.elements[4] = e01;

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

  return this;
};

EZ3.Matrix4.prototype.inverse = function(m) {
  var te = this.elements;
  var me = (m !== undefined) ? m.elements : this.elements;

  var n11 = me[0];
  var n12 = me[4];
  var n13 = me[8];
  var n14 = me[12];
  var n21 = me[1];
  var n22 = me[5];
  var n23 = me[9];
  var n24 = me[13];
  var n31 = me[2];
  var n32 = me[6];
  var n33 = me[10];
  var n34 = me[14];
  var n41 = me[3];
  var n42 = me[7];
  var n43 = me[11];
  var n44 = me[15];

  te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
  te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
  te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
  te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

  te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
  te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
  te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
  te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;

  te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
  te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
  te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
  te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;

  te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
  te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
  te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
  te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

  var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

  if (!det)
    return this.identity;

  this.multiplyScalar(1 / det);

  return this;
};

EZ3.Matrix4.prototype.multiplyScalar = function(s) {
  var te = this.elements;

  te[0] *= s;
  te[4] *= s;
  te[8] *= s;
  te[12] *= s;

  te[1] *= s;
  te[5] *= s;
  te[9] *= s;
  te[13] *= s;

  te[2] *= s;
  te[6] *= s;
  te[10] *= s;
  te[14] *= s;

  te[3] *= s;
  te[7] *= s;
  te[11] *= s;
  te[15] *= s;

  return this;
};

EZ3.Matrix4.prototype.mul = function(m2, m1) {
  var em1;
  var em2;
  var a00;
  var a01;
  var a02;
  var a03;
  var a10;
  var a11;
  var a12;
  var a13;
  var a20;
  var a21;
  var a22;
  var a23;
  var a30;
  var a31;
  var a32;
  var a33;
  var b00;
  var b01;
  var b02;
  var b03;
  var b10;
  var b11;
  var b12;
  var b13;
  var b20;
  var b21;
  var b22;
  var b23;
  var b30;
  var b31;
  var b32;
  var b33;

  if (m1 !== undefined) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = m2.elements;
    em2 = this.elements;
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

EZ3.Matrix4.prototype.setPosition = function(v, m) {
  var em = (m !== undefined) ? m.elements : this.elements;
  var x = v.x;
  var y = v.y;
  var z = v.z;

  em[12] = x;
  em[13] = y;
  em[14] = z;

  return this;
};

EZ3.Matrix4.prototype.translate = function(v, m) {
  var em = (m !== undefined) ? m.elements : this.elements;
  var x = v.x;
  var y = v.y;
  var z = v.z;

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

EZ3.Matrix4.prototype.scale = function(s, m) {
  var x = s.x;
  var y = s.y;
  var z = s.z;
  var em = (m !== undefined) ? m.elements : this.elements;

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

EZ3.Matrix4.prototype.setFromQuaternion = function(q) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var wx = q.w * x2;
  var wy = q.w * y2;
  var wz = q.w * z2;

  this.elements[0] = 1.0 - yy - zz;
  this.elements[1] = xy - wz;
  this.elements[2] = xz + wy;
  this.elements[3] = 0.0;

  this.elements[4] = xy + wz;
  this.elements[5] = 1.0 - xx - zz;
  this.elements[6] = yz - wx;
  this.elements[7] = 0.0;

  this.elements[8] = xz - wy;
  this.elements[9] = yz + wx;
  this.elements[10] = 1.0 - xx - yy;
  this.elements[11] = 0.0;

  this.elements[12] = 0.0;
  this.elements[13] = 0.0;
  this.elements[14] = 0.0;
  this.elements[15] = 1.0;

  return this;
};

EZ3.Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
  var te = this.elements;
	var x = 2.0 * near / (right - left);
	var y = 2.0 * near / (top - bottom);

	var a = (right + left) / (right - left);
	var b = (top + bottom) / (top - bottom);
	var c = -(far + near) / (far - near);
	var d = -2.0 * far * near / (far - near);

	te[0] = x;
	te[1] = 0;
	te[2] = 0;
	te[3] = 0;

  te[4] = 0;
  te[5] = y;
  te[6] = 0;
  te[7] = 0;

  te[8] = a;
  te[9] = b;
  te[10] = c;
  te[11] = -1;

  te[12] = 0;
  te[13] = 0;
  te[14] = d;
  te[15] = 0;

	return this;
};

EZ3.Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  var ymax = near * Math.tan(EZ3.Math.toRadians(fovy * 0.5));
  var ymin = -ymax;
  var xmax = ymax * aspect;
  var xmin = ymin * aspect;

  return this.frustum(xmin, xmax, ymin, ymax, near, far);
};

EZ3.Matrix4.prototype.orthographic = function(left, right, top, bottom, near, far) {
  var w = right - left;
  var h = top - bottom;
  var p = far - near;

  var x = (right + left) / w;
  var y = (top + bottom) / h;
  var z = (far + near) / p;

  this.elements[0] = 2.0 / w;
  this.elements[1] = 0.0;
  this.elements[2] = 0.0;
  this.elements[3] = 0.0;

  this.elements[4] = 0.0;
  this.elements[5] = 2.0 / h;
  this.elements[6] = 0.0;
  this.elements[7] = 0.0;

  this.elements[8] = 0.0;
  this.elements[9] = 0.0;
  this.elements[10] = -2.0 / p;
  this.elements[11] = 0.0;

  this.elements[12] = -x;
  this.elements[13] = -y;
  this.elements[14] = -z;
  this.elements[15] = 1.0;

  return this;
};

EZ3.Matrix4.prototype.lookAt = function(eye, center, up) {
  var te = this.elements;
  var x = new EZ3.Vector3();
  var y = new EZ3.Vector3();
  var z = new EZ3.Vector3();

  z.sub(eye, center).normalize();

  if (z.length() === 0)
    z.z = 1;

  x.cross(up, z).normalize();

  if (x.length() === 0) {
    z.x += 0.0001;
    x.cross(up, z).normalize();
  }

  y.cross(z, x);

  te[0] = x.x;
  te[1] = y.x;
  te[2] = z.x;
  te[3] = 0.0;

  te[4] = x.y;
  te[5] = y.y;
  te[6] = z.y;
  te[7] = 0.0;

  te[8] = x.z;
  te[9] = y.z;
  te[10] = z.z;
  te[11] = 0.0;

  te[12] = -x.dot(eye);
  te[13] = -y.dot(eye);
  te[14] = -z.dot(eye);
  te[15] = 1.0;

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

EZ3.Matrix4.prototype.yawPitchRoll = function(yaw, pitch, roll) {
  var cosYaw = Math.cos(yaw);
  var sinYaw = Math.sin(yaw);
  var cosRoll = Math.cos(roll);
  var sinRoll = Math.sin(roll);
  var cosPitch = Math.cos(pitch);
  var sinPitch = Math.sin(pitch);

  this.elements[0] = cosYaw * cosRoll + sinYaw * sinPitch * sinRoll;
  this.elements[1] = sinRoll * cosPitch;
  this.elements[2] = -sinYaw * cosRoll + cosYaw * sinPitch * sinRoll;
  this.elements[3] = 0.0;

  this.elements[4] = -cosYaw * sinRoll + sinYaw * sinPitch * cosRoll;
  this.elements[5] = cosRoll * cosPitch;
  this.elements[6] = sinRoll * sinYaw + cosYaw * sinPitch * cosRoll;
  this.elements[7] = 0.0;

  this.elements[8] = sinYaw * cosPitch;
  this.elements[9] = -sinPitch;
  this.elements[10] = cosYaw * cosPitch;
  this.elements[11] = 0.0;

  this.elements[12] = 0.0;
  this.elements[13] = 0.0;
  this.elements[14] = 0.0;
  this.elements[15] = 1.0;

  return this;
};

EZ3.Matrix4.prototype.determinant = function() {
  var te = this.elements;
  var n11 = te[0];
	var n21 = te[1];
  var n31 = te[2];
  var n41 = te[3];
  var n12 = te[4];
  var n22 = te[5];
  var n32 = te[6];
  var n42 = te[7];
  var n13 = te[8];
  var n23 = te[9];
  var n33 = te[10];
  var n43 = te[11];
  var n14 = te[12];
  var n24 = te[13];
  var n34 = te[14];
  var n44 = te[15];

  return (
    n41 * (n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
		n42 * (n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
		n43 * (n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
		n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
  );
};

EZ3.Matrix4.prototype.compose = function(position, rotation, scale) {
  this.setFromQuaternion(rotation);
  this.setPosition(position);
  this.scale(scale);

  return this;
};

EZ3.Matrix4.prototype.getPosition = function() {
  var te = this.elements;
  var position = new EZ3.Vector3(te[12], te[13], te[14]);

  return position;
};

EZ3.Matrix4.prototype.getRotation = function() {
  var scale = this.getScale();
  var matrix = new EZ3.Matrix4(this.elements);
  var iSX;
  var iSY;
  var iSZ;

  if(this.determinant() < 0.0)
    scale.x = -scale.x;

  iSX = 1.0 / scale.x;
  iSY = 1.0 / scale.y;
  iSZ = 1.0 / scale.z;

  matrix.elements[0] *= iSX;
  matrix.elements[1] *= iSX;
  matrix.elements[2] *= iSX;

  matrix.elements[4] *= iSY;
  matrix.elements[5] *= iSY;
  matrix.elements[6] *= iSY;

  matrix.elements[8] *= iSZ;
  matrix.elements[9] *= iSZ;
  matrix.elements[10] *= iSZ;

  return new EZ3.Quaternion().setFromRotationMatrix(matrix);
};

EZ3.Matrix4.prototype.getScale = function() {
  var te = this.elements;
  var scale = new EZ3.Vector3();
  var vector = new EZ3.Vector3();

  scale.x = vector.set(te[0], te[1], te[2]).length();
  scale.y = vector.set(te[4], te[5], te[6]).length();
  scale.z = vector.set(te[8], te[9], te[10]).length();

  return scale;
};

EZ3.Matrix4.prototype.clone = function() {
  return new EZ3.Matrix4(this.toArray());
};

EZ3.Matrix4.prototype.copy = function(m) {
  this.elements[0] = m.elements[0];
  this.elements[1] = m.elements[1];
  this.elements[2] = m.elements[2];
  this.elements[3] = m.elements[3];

  this.elements[4] = m.elements[4];
  this.elements[5] = m.elements[5];
  this.elements[6] = m.elements[6];
  this.elements[7] = m.elements[7];

  this.elements[8] = m.elements[8];
  this.elements[9] = m.elements[9];
  this.elements[10] = m.elements[10];
  this.elements[11] = m.elements[11];

  this.elements[12] = m.elements[12];
  this.elements[13] = m.elements[13];
  this.elements[14] = m.elements[14];
  this.elements[15] = m.elements[15];

  return this;
};

EZ3.Matrix4.prototype.toArray = function() {
  return this.elements;
};

EZ3.Matrix4.prototype.toString = function() {
  return 'Matrix4[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + ', ' +
    this.elements[12].toFixed(4) + '\n' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[9].toFixed(4) + ', ' +
    this.elements[13].toFixed(4) + '\n' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[10].toFixed(4) + ', ' +
    this.elements[14].toFixed(4) + '\n' +
    this.elements[3].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + ', ' +
    this.elements[11].toFixed(4) + ', ' +
    this.elements[15].toFixed(4) + '\n]';
};

EZ3.Matrix4.prototype.toMat3 = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var matrix = new EZ3.Matrix3();

  matrix.elements = [
    e[0], e[3], e[6],
    e[1], e[4], e[7],
    e[2], e[5], e[8]
  ];

  return matrix;
};

EZ3.Matrix4.prototype.isEqual = function(m) {
  if (m) {
    if (m !== undefined) {
      return m.elements[0] === this.elements[0] &&
        m.elements[1] === this.elements[1] &&
        m.elements[2] === this.elements[2] &&
        m.elements[3] === this.elements[3] &&
        m.elements[4] === this.elements[4] &&
        m.elements[5] === this.elements[5] &&
        m.elements[6] === this.elements[6] &&
        m.elements[7] === this.elements[7] &&
        m.elements[8] === this.elements[8] &&
        m.elements[9] === this.elements[9] &&
        m.elements[10] === this.elements[10] &&
        m.elements[11] === this.elements[11] &&
        m.elements[12] === this.elements[12] &&
        m.elements[13] === this.elements[13] &&
        m.elements[14] === this.elements[14] &&
        m.elements[15] === this.elements[15];
    } else
      return false;
  } else
    return false;
};

EZ3.Matrix4.prototype.isDiff = function(m) {
  if (m) {
    if (m !== undefined) {
      return !this.isEqual(m);
    } else
      return false;
  } else
    return true;
};
