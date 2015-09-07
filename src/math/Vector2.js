/**
 * @class Vector2
 */

 EZ3.Vector2 = function(x, y) {
   this._x = x || 0;
   this._y = y || 0;
   this.dirty = true;
 };

EZ3.Vector2.prototype.init = function(x, y) {
 this.x = x;
 this.y = x;
};

EZ3.Vector2.prototype.add = function(v1, v2) {
 this.x = v1.x + v2.x;
 this.y = v1.y + v2.y;
 return this;
};

EZ3.Vector2.prototype.addEqual = function(v) {
 this.x += v.x;
 this.y += v.y;
 return this;
};

EZ3.Vector2.prototype.sub = function(v1, v2) {
 this.x = v1.x - v2.x;
 this.y = v1.y - v2.y;
 return this;
};

EZ3.Vector2.prototype.subEqual = function(v) {
 this.x -= v.x;
 this.y -= v.y;
 return this;
};

EZ3.Vector2.prototype.addScale = function(v, s) {
this.x += v.x * s;
this.y += v.y * s;
return this;
};

EZ3.Vector2.prototype.scale = function(v, s) {
this.x = v.x * s;
this.y = v.y * s;
return this;
};

EZ3.Vector2.prototype.scaleEqual = function(s) {
this.x *= s;
this.y *= s;
return this;
};

EZ3.Vector2.prototype.div = function(v1, v2) {
if (!v2.haveZero()) {
  this.x = v1.x / v2.x;
  this.y = v1.y / v2.y;
}
return this;
};

EZ3.Vector2.prototype.divEqual = function(v) {
if (!v.haveZero()) {
  this.x /= v.x;
  this.y /= v.y;
  this.z /= v.z;
}
return this;
};

EZ3.Vector2.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
    return v1.x * v2.x + v1.y * v2.y;
  else
    return this.x * v1.x + this.y * v1.y;
};

EZ3.Vector2.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.length = function(v) {
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
    }
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
    }
  }
  return this;
};

EZ3.Vector2.prototype.invert = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
  } else {
    this.x = -this.x;
    this.y = -this.y;
  }
  return this;
};

EZ3.Vector2.prototype.copy = function(v) {
 this.x = v.x;
 this.y = v.y;
 return this;
};

EZ3.Vector2.prototype.clone = function() {
 return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector2.prototype.toArray = function() {
return [this.x, this.y];
};

EZ3.Vector2.prototype.testEqual = function(v) {
return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
};

EZ3.Vector2.prototype.testZero = function(v) {
if (v !== undefined)
  return ((v.x === 0.0) && (v.y === 0.0));
else
  return ((this.x === 0.0) && (this.y === 0.0));
};

EZ3.Vector2.prototype.haveZero = function(v) {
if (v !== undefined)
  return ((v.x === 0.0) || (v.y === 0.0));
else
  return ((this.x === 0.0) || (this.y === 0.0));
};

EZ3.Vector2.prototype.testDiff = function(v) {
return ((this.x !== v.x) && (this.y !== v.y));
};

EZ3.Vector2.prototype.toString = function() {
return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};

EZ3.Vector2.prototype.set = EZ3.Vector2.prototype.init;

Object.defineProperty(EZ3.Vector2.prototype, 'x', {
 get: function() {
   return this._x;
 },
 set: function(x) {
   this._x = x;
   this.dirty = true;
 }
});

Object.defineProperty(EZ3.Vector2.prototype, 'y', {
 get: function() {
   return this._y;
 },
 set: function(y) {
   this._y = y;
   this.dirty = true;
 }
});
