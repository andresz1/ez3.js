/**
 * @class Vector2
 */

EZ3.Vector2 = function(x, y) {
  if(typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
  }
};

EZ3.Vector2.prototype.add = function(v1, v2) {
  if(v2 instanceof EZ3.Vector2) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  } else {
    this.x += v1.x;
    this.y += v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.sub = function(v1, v2) {
  if(v2 instanceof EZ3.Vector2) {
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
  if(s === Number(s)) {
    if(v instanceof EZ3.Vector2) {
      this.x = v.x * s;
      this.y = v.y * s;
    } else {
      this.x *= s;
      this.y *= s;
    }
  }
  return this;
};

EZ3.Vector2.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector2)
    return v1.x * v2.x + v1.y * v2.y;
  else
    return this.x * v1.x + this.y * v1.y;
};

EZ3.Vector2.prototype.max = function(v1, v2) {
  if (v2 instanceof EZ3.Vector2) {
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
  if (v2 instanceof EZ3.Vector2) {
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
  if (v instanceof EZ3.Vector2)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector2.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector2) {
    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      v.scale(l);
      this.x = v.x;
      this.y = v.y;
    } else
      console.error('EZ3.Vector2.normalize: length is zero.', v);
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.scale(l);
    } else
      console.error('EZ3.Vector2.normalize: length is zero.', this);
  }
  return this;
};

EZ3.Vector2.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector2) {
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
  if(v instanceof EZ3.Vector2)
    return (this.x === v.x) && (this.y === v.y);
  else {
    //console.error('EZ3.Vector2.testEqual: parameter is not s EZ3.Vector2.', v);
    return false;
  }
};

EZ3.Vector2.prototype.hasZero = function(v) {
  if (v instanceof EZ3.Vector2)
    return (v.x === 0.0) || (v.y === 0.0);
  else
    return (this.x === 0.0) || (this.y === 0.0);
};

EZ3.Vector2.prototype.testZero = function(v) {
  if (v instanceof EZ3.Vector2)
    return ((v.x === 0.0) && (v.y === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0));
};

EZ3.Vector2.prototype.testDiff = function(v) {
  if (v) {
    if (v instanceof EZ3.Vector2)
      return !this.testEqual(v);
    else {
      console.warn('EZ3.Vector2.testDiff: parameter is not a EZ3.Vector3.', v);
      return true;
    }
  } else
    return true;
};

EZ3.Vector2.prototype.toString = function() {
  return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};
