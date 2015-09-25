/**
 * @class Vector3
 */

EZ3.Vector3 = function(x, y, z) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this.dirty = true;
};

EZ3.Vector3.prototype.constructor = EZ3.Vector3;

EZ3.Vector3.prototype.init = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  return this;
};

EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

EZ3.Vector3.prototype.add = function(v1, v2) {
  this.x = v1.x + v2.x;
  this.y = v1.y + v2.y;
  this.z = v1.z + v2.z;
  return this;
};

EZ3.Vector3.prototype.addEqual = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  return this;
};

EZ3.Vector3.prototype.sub = function(v1, v2) {
  this.x = v1.x - v2.x;
  this.y = v1.y - v2.y;
  this.z = v1.z - v2.z;
  return this;
};

EZ3.Vector3.prototype.subEqual = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  return this;
};

EZ3.Vector3.prototype.addScale = function(v, s) {
  this.x += v.x * s;
  this.y += v.y * s;
  this.z += v.z * s;
};

EZ3.Vector3.prototype.scale = function(v, s) {
  this.x = v.x * s;
  this.y = v.y * s;
  this.z = v.z * s;
  return this;
};

EZ3.Vector3.prototype.scaleEqual = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;
  return this;
};

EZ3.Vector3.prototype.div = function(v1, v2) {
  if (v2 !== undefined) {
    if (!v2.hasZero()) {
      this.x = v1.x / v2.x;
      this.y = v1.y / v2.y;
      this.z = v1.z / v2.z;
    }
  } else {
    if (!v1.hasZero()) {
      this.x = this.x / v1.x;
      this.y = this.y / v1.y;
      this.z = this.z / v1.z;
    }
  }
  return this;
};

EZ3.Vector3.prototype.divEqual = function(v) {
  if (!v.hasZero()) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
  }
  return this;
};

EZ3.Vector3.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
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

EZ3.Vector3.prototype.len = function() {
  return this.x * this.x + this.y * this.y + this.z * this.z;
};

EZ3.Vector3.prototype.mul = function(o, v, m) {
  var e = m.elements;
  this.x = o.x + v.x * e[0] + v.y * e[1] + v.z * e[2];
  this.y = o.y + v.x * e[3] + v.y * e[4] + v.z * e[5];
  this.z = o.z + v.x * e[6] + v.y * e[7] + v.z * e[8];
  return this;
};

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

EZ3.Vector3.prototype.mulMat = function(m, v) {
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

  this.x = x * e[0] + y * e[1] + z * e[2];
  this.y = x * e[3] + y * e[4] + z * e[5];
  this.z = x * e[6] + y * e[7] + z * e[8];

  return this;
};

EZ3.Vector3.prototype.applyQuaternion = function(q) {
  var x = this.x;
  var y = this.y;
  var z = this.z;
  var qx = q.x;
  var qy = q.y;
  var qz = q.z;
  var qs = q.s;
  var ix = qs * x + qy * z - qz * y;
  var iy = qs * y + qz * x - qx * z;
  var iz = qs * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  this.x = ix * qs + iw * -qx + iy * -qz - iz * -qy;
  this.y = iy * qs + iw * -qy + iz * -qx - ix * -qz;
  this.z = iz * qs + iw * -qz + ix * -qy - iy * -qx;

  return this;
};

EZ3.Vector3.prototype.length = function(v) {
  if (v !== undefined)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {

    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x = v.x * l;
      this.y = v.y * l;
      this.z = v.z * l;
    }
  } else {

    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
    }
  }

  return this;
};

EZ3.Vector3.prototype.invert = function(v) {
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
  return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
};

EZ3.Vector3.prototype.hasZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) || (v.y === 0.0) || (v.z === 0.0));
  else
    return ((this.x === 0.0) || (this.y === 0.0) || (this.z === 0.0));
};

EZ3.Vector3.prototype.testZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0));
};

EZ3.Vector3.prototype.testDiff = function(v) {
  return ((this.x !== v.x) && (this.y !== v.y) && (this.z !== v.z));
};

EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  
  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

EZ3.Vector3.prototype.set = EZ3.Vector3.prototype.init;

Object.defineProperty(EZ3.Vector3.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});
