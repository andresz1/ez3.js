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

EZ3.Vector3.prototype.sum = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;

  return this;
};

EZ3.Vector3.prototype.sub = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;

  return this;
};

EZ3.Vector3.prototype.mul = function(v) {
  this.x *= v.x;
  this.y *= v.y;
  this.z *= v.z;

  return this;
};

EZ3.Vector3.prototype.div = function(v) {
  this.x /= v.x;
  this.y /= v.y;
  this.z /= v.z;

  return this;
};

EZ3.Vector3.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
};

EZ3.Vector3.prototype.max = function(v) {
  if (this.x < v.x)
    this.x = v.x;

  if (this.y < v.y)
    this.y = v.y;

  if (this.z < v.z)
    this.z = v.z;

  return this;
};

EZ3.Vector3.prototype.min = function(v) {
  if (this.x > v.x)
    this.x = v.x;

  if (this.y > v.y)
    this.y = v.y;

  if (this.z > v.z)
    this.z = v.z;

  return this;
};

EZ3.Vector3.prototype.equals = function(v) {
  return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
};

EZ3.Vector3.prototype.scale = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;

  return this;
};

EZ3.Vector3.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

EZ3.Vector3.prototype.normalize = function() {
  this.scale(1.0 / this.length());
  return this;
};

EZ3.Vector3.prototype.cross = function(v) {
  var x = this.y * v.z - this.z * v.y;
  var y = this.z * v.x - this.x * v.z;
  var z = this.x * v.y - this.y * v.x;

  this.x = x;
  this.y = y;
  this.z = z;

  return this;
};

EZ3.Vector3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
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

EZ3.Vector3.prototype.mulMatrix = function(m) {
  var x = this.x;
  var y = this.y;
  var z = this.z;

  var e = m.elements;

  this.x = x * e[0] + y * e[1] + z * e[2];
  this.y = x * e[3] + y * e[4] + z * e[5];
  this.z = x * e[6] + y * e[7] + z * e[8];

  return this;
};

EZ3.Vector3.prototype.sumVectors = function(a, b) {
  this.x = a.x + b.x;
  this.y = a.y + b.y;
  this.z = a.z + b.z;

  return this;
};

EZ3.Vector3.prototype.subVectors = function(a, b) {
  this.x = a.x - b.x;
  this.y = a.y - b.y;
  this.z = a.z - b.z;

  return this;
};

EZ3.Vector3.prototype.mulVectors = function(a, b) {
  this.x = a.x * b.x;
  this.y = a.y * b.y;
  this.z = a.z * b.z;

  return this;
};

EZ3.Vector3.prototype.divVectors = function(a, b) {
  this.x = a.x / b.x;
  this.y = a.y / b.y;
  this.z = a.z / b.z;

  return this;
};

EZ3.Vector3.prototype.dotVectors = function(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

EZ3.Vector3.prototype.maxVectors = function(a, b) {
  this.x = (a.x > b.x) ? a.x : b.x;
  this.y = (a.y > b.y) ? a.y : b.y;
  this.z = (a.z > b.z) ? a.z : b.z;

  return this;
};

EZ3.Vector3.prototype.minVectors = function(a, b) {
  this.x = (a.x < b.x) ? a.x : b.x;
  this.y = (a.y < b.y) ? a.y : b.y;
  this.z = (a.z < b.z) ? a.z : b.z;

  return this;
};

EZ3.Vector3.prototype.equalVectors = function(a, b) {
  return ((a.x === b.x) && (a.y === b.y) && (a.z === b.z));
};

EZ3.Vector3.prototype.scaleVector = function(v, s) {
  this.x = v.x * s;
  this.y = v.y * s;
  this.z = v.z * s;

  return this;
};

EZ3.Vector3.prototype.lengthVector = function(v) {
  return Math.sqrt(this.dotVectors(v, v));
};

EZ3.Vector3.prototype.normalizeVector = function(v) {
  return this.scaleVector(v, 1.0 / this.lengthVector(v));
};

EZ3.Vector3.prototype.crossVectors = function(a, b) {
  this.x = a.y * b.z - a.z * b.y;
  this.y = a.z * b.x - a.x * b.z;
  this.z = a.x * b.y - a.y * b.x;

  return this;
};

EZ3.Vector3.prototype.mulMatrixVector = function(v, m) {
  var e = m.elements;

  this.x = v.x * e[0] + v.y * e[1] + v.z * e[2];
  this.y = v.x * e[3] + v.y * e[4] + v.z * e[5];
  this.z = v.x * e[6] + v.y * e[7] + v.z * e[8];

  return this;
};

Object.defineProperty(EZ3.Vector3.prototype, "x", {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, "y", {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, "z", {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});
