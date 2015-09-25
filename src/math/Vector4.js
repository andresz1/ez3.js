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

EZ3.Vector4.prototype.subEqual = function(v) {
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

EZ3.Vector4.prototype.scale = function(v, s) {
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
    if (!v2.hasZero()) {
      this.x = v1.x / v2.x;
      this.y = v1.y / v2.y;
      this.z = v1.z / v2.z;
      this.w = v1.w / v2.w;
    }
  } else {
    if (!v1.hasZero()) {
      this.x = this.x / v1.x;
      this.y = this.y / v1.y;
      this.z = this.z / v1.z;
      this.w = this.w / v1.w;
    }
  }
  return this;
};

EZ3.Vector4.prototype.divEqual = function(v) {
  if (!v.hasZero()) {
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
  var e = m.elements;

  this.x = o.x + v.x * e[0] + v.y * e[1] + v.z * e[2] + v.w * e[3];
  this.y = o.y + v.x * e[4] + v.y * e[5] + v.z * e[6] + v.w * e[7];
  this.z = o.z + v.x * e[8] + v.y * e[9] + v.z * e[10] + v.w * e[11];
  this.w = o.w + v.x * e[12] + v.y * e[13] + v.z * e[14] + v.w * e[15];
  return this;
};

EZ3.Vector4.prototype.mulMat = function(m, v) {
  var x, y, z, w;
  var e = m.elements;

  if (v !== undefined) {
    x = v.x;
    y = v.y;
    z = v.z;
    w = v.w;
  } else {
    x = this.x;
    y = this.y;
    z = this.z;
    w = this.w;
  }

  this.x = x * e[0] + y * e[1] + z * e[2] + w * e[3];
  this.y = x * e[4] + y * e[5] + z * e[6] + w * e[7];
  this.z = x * e[8] + y * e[9] + z * e[10] + w * e[11];
  this.w = x * e[12] + y * e[13] + z * e[14] + w * e[15];

  return this;
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
  var x = (this.x === v.x);
  var y = (this.y === v.y);
  var z = (this.z === v.z);
  var w = (this.w === v.w);

  return (x && y && z && w);
};

EZ3.Vector4.prototype.hasZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v !== undefined) {
    ex = (v.x === 0.0);
    ey = (v.y === 0.0);
    ez = (v.z === 0.0);
    ew = (v.w === 0.0);
  }else {
    ex = (this.x === 0.0);
    ey = (this.y === 0.0);
    ez = (this.z === 0.0);
    ew = (this.w === 0.0);
  }

  return (ex || ey || ez || ew);
};

EZ3.Vector4.prototype.testZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v !== undefined) {
    ex = (v.x === 0.0);
    ey = (v.y === 0.0);
    ez = (v.z === 0.0);
    ew = (v.w === 0.0);
  }else {
    ex = (this.x === 0.0);
    ey = (this.y === 0.0);
    ez = (this.z === 0.0);
    ew = (this.w === 0.0);
  }

  return (ex && ey && ez && ew);
};

EZ3.Vector4.prototype.testDiff = function(v) {
  var dx = (this.x !== v.x);
  var dy = (this.y !== v.y);
  var dz = (this.z !== v.z);
  var dw = (this.w !== v.w);

  return (dx && dy && dz && dw);
};

EZ3.Vector4.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Vector4[' + x + ', ' + y + ', ' + z + ', ' + w + ']';
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
