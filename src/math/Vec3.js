/**
 * @class Vec3
 */

EZ3.Vec3 = function(x, y, z) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._dirty = false;
};

EZ3.Vec3.prototype.constructor = EZ3.Vec3;

EZ3.Vec3.prototype.sum = function(b) {
  this.x += b.x;
  this.y += b.y;
  this.z += b.z;

  return this;
};

EZ3.Vec3.prototype.sub = function(b) {
  this.x -= b.x;
  this.y -= b.y;
  this.z -= b.z;

  return this;
};

EZ3.Vec3.prototype.dot = function(b) {
  var a = this;
  return a.x * a.x + a.y * b.y + a.z * b.z;
};

EZ3.Vec3.prototype.max = function(v) {
  if(this.x < v.x)
    this.x = v.x;

  if(this.y < v.y)
    this.y = v.y;

  if(this.z < v.z)
    this.z = v.z;

  return this;
};

EZ3.Vec3.prototype.min = function(v) {
  if(this.x > v.x)
    this.x = v.x;

  if(this.y > v.y)
    this.y = v.y;

  if(this.z > v.z)
    this.z = v.z;

  return this;
};

EZ3.Vec3.prototype.equals = function(v) {
  return ((this.x === v.x ) && (this.y === v.y) && (this.z === v.z));
};

EZ3.Vec3.prototype.scale = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;

  return this;
};

EZ3.Vec3.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

EZ3.Vec3.prototype.normalize = function() {
  var l = this.length();

  this.x /= l;
  this.y /= l;
  this.z /= l;

  return this;
};

EZ3.Vec3.prototype.cross = function(b) {
  var x, y, z;
  var a = this;

  x = a.y * b.z - a.z * b.y;
  y = a.z * b.x - a.x * b.z;
  z = a.x * b.y - a.y * b.x;

  this.x = x;
  this.y = y;
  this.z = z;

  return this;
};

EZ3.Vec3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
};

EZ3.Vec3.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;

  return this;
};

EZ3.Vec3.prototype.clone = function() {
  return new EZ3.Vec3(this.x, this.y, this.z);
};

Object.defineProperty(EZ3.Vec3.prototype, "x", {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this._dirty = true;
  }
});

Object.defineProperty(EZ3.Vec3.prototype, "y", {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this._dirty = true;
  }
});

Object.defineProperty(EZ3.Vec3.prototype, "z", {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this._dirty = true;
  }
});

Object.defineProperty(EZ3.Vec3.prototype, "dirty", {
  get: function() {
    return this._dirty;
  },
  set: function(dirty) {
    this._dirty = dirty;
  }
});
