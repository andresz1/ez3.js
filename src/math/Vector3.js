/**
 * @class Vector3
 */

EZ3.Vector3 = function(x, y, z) {
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

EZ3.Vector3.prototype.add = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.sub = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

EZ3.Vector3.prototype.scale = function(s, v) {
  if (v instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3)
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  else
    return this.x * v1.x + this.y * v1.y + this.z * v1.z;
};

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

EZ3.Vector3.prototype.cross = function(v1, v2) {
  var x;
  var y;
  var z;

  if (v2 instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.mulMat3 = function(m, v) {
  var e;
  var x;
  var y;
  var z;

  if (m instanceof EZ3.Matrix3) {
    e = m.elements;

    if (v instanceof EZ3.Vector3) {
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
  } else {
    console.warn('EZ3.Vector3.mulMat3: parameter is not a EZ3.Matrix3.', m);
    return null;
  }
};

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

EZ3.Vector3.prototype.length = function(v) {
  if (v instanceof EZ3.Vector3)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector3) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;

      return this;
    }
    /*else
         console.warn('EZ3.Vector3.normalize: length is zero.', v);*/
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    }
  }
};

EZ3.Vector3.prototype.fromPositionMatrix = function(m) {
  this.x = m.elements[12];
  this.y = m.elements[13];
  this.z = m.elements[14];

  return this;
};

EZ3.Vector3.prototype.fromViewProjectionMatrix = function(m) {
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

EZ3.Vector3.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  return this;
};

EZ3.Vector3.prototype.clone = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

EZ3.Vector3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
};

EZ3.Vector3.prototype.testEqual = function(v) {
  if (v) {
    return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
  } else
    return false;
};

EZ3.Vector3.prototype.hasZero = function(v) {
  if (v instanceof EZ3.Vector3)
    return (v.x === 0.0) || (v.y === 0.0) || (v.z === 0.0);
  else
    return (this.x === 0.0) || (this.y === 0.0) || (this.z === 0.0);
};

EZ3.Vector3.prototype.testZero = function(v) {
  if (v instanceof EZ3.Vector3)
    return (v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0);
  else
    return (this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0);
};

EZ3.Vector3.prototype.testDiff = function(v) {
  return !this.testEqual(v);
};

EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);

  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

EZ3.Vector3.prototype.toVec2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector3.prototype.setPositionFromMatrix = function(m) {
  if (m instanceof EZ3.Matrix4) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];
  }
  return this;
};
