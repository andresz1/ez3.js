/**
 * @class Vector2
 */

EZ3.Vector2 = function(x, y) {
  if (typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
  }
};

EZ3.Vector2.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  } else {
    this.x += v1.x;
    this.y += v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
};

EZ3.Vector2.prototype.scale = function(s, v) {
  if (typeof s === 'number') {
    if (v !== undefined) {
      this.x = v.x * s;
      this.y = v.y * s;
    } else {
      this.x *= s;
      this.y *= s;
    }
  }
  return this;
};

EZ3.Vector2.prototype.dot = function(v) {
  if (v !== undefined)
    return v.x * this.x + v.y * this.y;
  else
    return -1;
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

EZ3.Vector2.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

EZ3.Vector2.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      v.scale(l);
      this.x = v.x;
      this.y = v.y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.scale(l);
    } else {
      this.x = 0;
      this.y = 0;
    }
  }
  return this;
};

EZ3.Vector2.prototype.negate = function(v) {
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

EZ3.Vector2.prototype.isEqual = function(v) {
  if (v !== undefined)
   return (this.x === v.x) && (this.y === v.y);
};

EZ3.Vector2.prototype.isDiff = function(v) {
  if (v !== undefined)
    return !this.isEqual(v);
  else
    return true;
};

EZ3.Vector2.prototype.isZeroVector = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0));
};

EZ3.Vector2.prototype.toArray = function() {
  return [this.x, this.y];
};

EZ3.Vector2.prototype.toString = function() {
  return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};
