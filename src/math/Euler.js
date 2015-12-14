/**
 * @class Euler
 */

EZ3.Euler = function(x, y, z, order) {
  this._x = (x !== undefined) ? x : 0;
  this._y = (y !== undefined) ? y : 0;
  this._z = (z !== undefined) ? z : 0;
  this._order = (order !== undefined) ? order : EZ3.Euler.XYZ;

  this.onChange = new EZ3.Signal();
};

EZ3.Euler.prototype.constructor = EZ3.Euler;

EZ3.Euler.prototype.set = function(x, y, z, order) {
  this._x = x;
  this._y = y;
  this._z = z;
  this._order = order || this._order;

  this.onChange.dispatch();

  return this;
};

EZ3.Euler.prototype.clone = function() {
  return new this.constructor(this._x, this._y, this._z, this._order);
};

EZ3.Euler.prototype.copy = function(euler) {
  this._x = euler.x;
  this._y = euler.y;
  this._z = euler.z;
  this._order = euler.order;

  this.onChange.dispatch();

  return this;
};

EZ3.Euler.prototype.setFromRotationMatrix = function(m, order, update) {
  var te = m.elements;

  var m11 = te[0];
  var m21 = te[1];
  var m31 = te[2];

  var m12 = te[4];
  var m22 = te[5];
  var m32 = te[6];

  var m13 = te[8];
  var m23 = te[9];
  var m33 = te[10];

  order = (order !== undefined) ? order : this._order;

  if (order === EZ3.Euler.XYZ) {
    this._y = Math.asin(EZ3.Math.clamp(m13, -1, 1));

    if (Math.abs(m13) < 0.99999) {
      this._x = Math.atan2(-m23, m33);
      this._z = Math.atan2(-m12, m11);
    } else {
      this._x = Math.atan2(m32, m22);
      this._z = 0;
    }
  } else if (order === EZ3.Euler.YXZ) {
    this._x = Math.asin(-EZ3.Math.clamp(m23, -1, 1));

    if (Math.abs(m23) < 0.99999) {
      this._y = Math.atan2(m13, m33);
      this._z = Math.atan2(m21, m22);
    } else {
      this._y = Math.atan2(-m31, m11);
      this._z = 0;
    }
  } else if (order === EZ3.Euler.ZXY) {
    this._x = Math.asin(EZ3.Math.clamp(m32, -1, 1));

    if (Math.abs(m32) < 0.99999) {
      this._y = Math.atan2(-m31, m33);
      this._z = Math.atan2(-m12, m22);
    } else {
      this._y = 0;
      this._z = Math.atan2(m21, m11);
    }
  } else if (order === EZ3.Euler.ZYX) {
    this._y = Math.asin(-EZ3.Math.clamp(m31, -1, 1));

    if (Math.abs(m31) < 0.99999) {
      this._x = Math.atan2(m32, m33);
      this._z = Math.atan2(m21, m11);
    } else {
      this._x = 0;
      this._z = Math.atan2(-m12, m22);
    }
  } else if (order === EZ3.Euler.YZX) {
    this._z = Math.asin(EZ3.Math.clamp(m21, -1, 1));

    if (Math.abs(m21) < 0.99999) {
      this._x = Math.atan2(-m23, m22);
      this._y = Math.atan2(-m31, m11);
    } else {
      this._x = 0;
      this._y = Math.atan2(m13, m33);
    }
  } else if (order === EZ3.Euler.XZY) {
    this._z = Math.asin(-EZ3.Math.clamp(m12, -1, 1));

    if (Math.abs(m12) < 0.99999) {
      this._x = Math.atan2(m32, m22);
      this._y = Math.atan2(m13, m11);
    } else {
      this._x = Math.atan2(-m23, m33);
      this._y = 0;
    }
  }

  if (update)
    this.onChange.dispatch();
};

EZ3.Euler.prototype.setFromQuaternion = function(q, order, update) {
  return this.setFromRotationMatrix(new EZ3.Matrix4().setFromQuaternion(q), order, update);
};

EZ3.Euler.prototype.setFromVector3 = function(v, order) {
  return this._set(v.x, v.y, v.z, order);
};

EZ3.Euler.prototype.isEqual = function(euler) {
  var x = this._x === euler.x;
  var y = this._y === euler.y;
  var z = this._z === euler.z;
  var o = this._order === euler.order;

  return x && y && z && o;
};

EZ3.Euler.prototype.toVector3 = function() {
  return new EZ3.Vector3(this._x, this._y, this._z);
};

EZ3.Euler.prototype.toArray = function() {
  return [this._x, this._y, this._z];
};

EZ3.Euler.prototype.toString = function() {
  return 'EZ3.Euler[' + this._x + ', ' + this._y + ', ' + this._z + ', ' + this._order + ']';
};

Object.defineProperty(EZ3.Euler.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'order', {
  get: function() {
    return this._order;
  },
  set: function(order) {
    this._order = order;

    this.onChange.dispatch();
  }
});

EZ3.Euler.XYZ = 1;
EZ3.Euler.YZX = 2;
EZ3.Euler.ZXY = 3;
EZ3.Euler.XZY = 4;
EZ3.Euler.YXZ = 5;
EZ3.Euler.ZYX = 6;
