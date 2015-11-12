/**
 * @class Vec4
 */

EZ3.Vector4 = function(x, y, z, w) {
  if (typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
    this.z = (typeof z === 'number') ? z : x;
    this.w = (typeof w === 'number') ? w : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
  }
};

EZ3.Vector4.prototype.constructor = EZ3.Vector4;

EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

EZ3.Vector4.prototype.add = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
    this.w = v1.w + v2.w;
  } else {
    this.x += v1.x;
    this.y += v1.y;
    this.z += v1.z;
    this.w += v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.sub = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
    this.w = v1.w - v2.w;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
    this.z -= v1.z;
    this.w -= v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.scale = function(s, v) {
  if (v instanceof EZ3.Vector4) {
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
    this.w = v.w * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }
  return this;
};

EZ3.Vector4.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    if(v1 instanceof EZ3.Vector4)
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    else
      console.error('EZ3.Vector4.dot: not EZ3.Vector4 given.', v1);
  } else {
    if(v1 instanceof EZ3.Vector4)
      return this.x * v1.x + this.y * v1.y + this.z * v1.z + this.w * v1.w;
    else
      console.error('EZ3.Vector4.dot: not EZ3.Vector4 given.', v1);
  }
};

EZ3.Vector4.prototype.max = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
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
  if (v2 instanceof EZ3.Vector4) {
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

EZ3.Vector4.prototype.mulMat4 = function(m, v) {
  var x;
  var y;
  var z;
  var w;
  var e;

  if(m instanceof EZ3.Matrix4) {
    e = m.elements;

    if (v instanceof EZ3.Vector4) {
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

    this.x = x * e[0] + y * e[4] + z * e[8] + w * e[12];
    this.y = x * e[1] + y * e[5] + z * e[9] + w * e[13];
    this.z = x * e[2] + y * e[6] + z * e[10] + w * e[14];
    this.w = x * e[3] + y * e[7] + z * e[11] + w * e[15];

    return this;
  } else {
    console.error('EZ3.Vector4.mulMat4: first parameter is not a EZ3.Matrix4.', m);
    return null;
  }
};

EZ3.Vector4.prototype.length = function(v) {
  if (v instanceof EZ3.Vector4)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector4.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector4) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;

      return this;
    } else
      console.warn('EZ3.Vector4.normalize: vector length is zero.', v);
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    } else
      console.warn('EZ3.Vector4.normalize: vector length is zero.', this);
  }
};

EZ3.Vector4.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector4) {
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
  var x;
  var y;
  var z;
  var w;

  if (v instanceof EZ3.Vector4) {
    x = this.x === v.x;
    y = this.y === v.y;
    z = this.z === v.z;
    w = this.w === v.w;

    return x && y && z && w;
  } else{
    console.warn('EZ3.Vector4.testEqual: parameter is not s EZ3.Vector4.', v);
    return false;
  }
};

EZ3.Vector4.prototype.hasZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v instanceof EZ3.Vector4) {
    ex = v.x === 0.0;
    ey = v.y === 0.0;
    ez = v.z === 0.0;
    ew = v.w === 0.0;
  } else {
    ex = this.x === 0.0;
    ey = this.y === 0.0;
    ez = this.z === 0.0;
    ew = this.w === 0.0;
  }

  return ex || ey || ez || ew;
};

EZ3.Vector4.prototype.testZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v instanceof EZ3.Vector4) {
    ex = v.x === 0.0;
    ey = v.y === 0.0;
    ez = v.z === 0.0;
    ew = v.w === 0.0;
  } else {
    ex = this.x === 0.0;
    ey = this.y === 0.0;
    ez = this.z === 0.0;
    ew = this.w === 0.0;
  }

  return ex && ey && ez && ew;
};

EZ3.Vector4.prototype.testDiff = function(v) {
  if(v) {
    if(v instanceof EZ3.Vector4)
      return !this.testEqual(v);
    else {
      console.warn('EZ3.Vector4.testDiff: parameter is not a EZ3.Vector4.', v);
      return false;
    }
  } else
    return true;
};

EZ3.Vector4.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Vector4[' + x + ', ' + y + ', ' + z + ', ' + w + ']';
};

EZ3.Vector4.prototype.toVec2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector4.prototype.toVec3 = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};
