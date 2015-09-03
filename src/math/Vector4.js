/**
 * @class Vec4
 */

EZ3.Vector4 = function(x, y, z, w) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._w = w || 0;
  this.dirty = true;
};

EZ3.Vector4.prototype.constructor = EZ3.Vector4;

EZ3.Vector4.prototype.init = function(x, y, z, w) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.w = w || 0;
  return this;
};

EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

EZ3.Vector4.prototype.add = function(v1, v2) {
  this.x = v1.x + v2.x;
  this.y = v1.y + v2.y;
  this.z = v1.z + v2.z;
  this.w = v1.w + v2.w;
  return this;
};

EZ3.Vector4.prototype.addEqual = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
};

EZ3.Vector4.prototype.sub = function(v1, v2) {
  this.x = v1.x - v2.x;
  this.y = v1.y - v2.y;
  this.z = v1.z - v2.z;
  this.w = v1.w - v2.w;
  return this;
};

EZ3.Vec4.prototype.subEqual = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  this.w -= v.w;
  return this;
};

EZ3.Vector4.prototype.addScale = function(v, s) {
  this.x += v.x * s;
  this.y += v.y * s;
  this.z += v.z * s;
  this.w += v.w * s;
  return this;
};

EZ3.Vector4.prototype.scale = function(s) {
  this.x = v.x * s;
  this.y = v.y * s;
  this.z = v.z * s;
  this.w = v.w * s;
  return this;
};

EZ3.Vector4.prototype.scaleEqual = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;
  this.w *= s;
  return this;
};

EZ3.Vector4.prototype.div = function(v1, v2) {
  if (v2 !== undefined) {
    if (!v2.haveZero()) {
      this.x = v1.x / v2.x;
      this.y = v1.y / v2.y;
      this.z = v1.z / v2.z;
      this.w = v1.w / v2.w;
    }
  } else {
    if (!v1.haveZero()) {
      this.x = this.x / v1.x;
      this.y = this.y / v1.y;
      this.z = this.z / v1.z;
      this.w = this.w / v1.w;
    }
  }
  return this;
};

EZ3.Vector4.prototype.divEqual = function(v) {
  if (!v.haveZero()) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
  }
  return this;
};

EZ3.Vector4.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
  else
    return this.x * v1.x + this.y * v1.y + this.z * v1.z + this.w * v1.w;
};

EZ3.Vector4.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
    this.z = (v1.z > v2.z) ? v1.z : v2.z;
    this.w = (v1.w > v2.w) ? v1.w : v2.w;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;

    if (this.z < v1.z)
      this.z = v1.z;

    if (this.w < v1.w)
      this.w = v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
    this.z = (v1.z < v2.z) ? v1.z : v2.z;
    this.w = (v1.w < v2.w) ? v1.w : v2.w;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;

    if (this.z > v1.z)
      this.z = v1.z;

    if (this.w > v1.w)
      this.w = v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.len = function() {
  return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
};

EZ3.Vector4.prototype.mul = function(o, v, m) {
  // TODO
};

EZ3.Vector4.prototype.mulMat = function(m, v) {
  // TODO
};

EZ3.Vector4.prototype.applyQuaternion = function(q) {
  // TODO
};

EZ3.Vector4.prototype.length = function(v) {
  if (v !== undefined)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector4.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {

    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x = v.x * l;
      this.y = v.y * l;
      this.z = v.z * l;
      this.w = v.w * l;
    }
  } else {

    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
  }

  return this;
};

EZ3.Vector4.prototype.invert = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
    this.w = -v.w;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
  }
  return this;
};

EZ3.Vector4.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  this.w = v.w;
  return this;
};

EZ3.Vector4.prototype.clone = function() {
  return new EZ3.Vector4(this.x, this.y, this.z, this.w);
};

EZ3.Vector4.prototype.toArray = function() {
  return [this.x, this.y, this.z, this.w];
};

EZ3.Vector4.prototype.testEqual = function(v) {
  return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z) && (this.w === v.w));
};

EZ3.Vector4.prototype.testZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0) && (v.w === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0) && (this.w === 0.0));
};

EZ3.Vector4.prototype.haveZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) || (v.y === 0.0) || (v.z === 0.0) || (v.w === 0.0));
  else
    return ((this.x === 0.0) || (this.y === 0.0) || (this.z === 0.0) || (v.w === 0.0));
};

EZ3.Vector4.prototype.testDiff = function(v) {
  return ((this.x !== v.x) && (this.y !== v.y) && (this.z !== v.z) && (this.w !== v.w));
};

EZ3.Vector4.prototype.toString = function() {
  return 'Vector4[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ', ' + this.z.toFixed(4) + ', ' + this.w.toFixed(4) + ']';
};

Object.defineProperty(EZ3.Vector4.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'w', {
  get: function() {
    return this._w;
  },
  set: function(w) {
    this._w = w;
    this.dirty = true;
  }
});
