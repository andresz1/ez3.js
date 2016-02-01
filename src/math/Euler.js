/**
 * Representation of a Euler angles.
 * @class EZ3.Euler
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [order]
 */
EZ3.Euler = function(x, y, z, order) {
  /**
   * @property {Number} x
   * @default 0
   */
  this._x = (x !== undefined) ? x : 0;

  /**
   * @property {Number} y
   * @default 0
   */
  this._y = (y !== undefined) ? y : 0;

  /**
   * @property {Number} z
   * @default 0
   */
  this._z = (z !== undefined) ? z : 0;

  /**
   * @property {Number} order
   * @default EZ3.Euler.XYZ
   */
  this._order = (order !== undefined) ? order : EZ3.Euler.XYZ;

  /**
   * @property {EZ3.Signal} onChange
   */
  this.onChange = new EZ3.Signal();
};

EZ3.Euler.prototype.constructor = EZ3.Euler;

/**
 * @method EZ3.Euler#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} [order]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.set = function(x, y, z, order) {
  this._x = x;
  this._y = y;
  this._z = z;
  this._order = order || this._order;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Euler#clone
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.clone = function() {
  return new this.constructor(this._x, this._y, this._z, this._order);
};

/**
 * @method EZ3.Euler#set
 * @param {EZ3.Euler} euler
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.copy = function(e) {
  this._x = e.x;
  this._y = e.y;
  this._z = e.z;
  this._order = e.order;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Euler#setFromRotationMatrix
 * @param {EZ3.Matrix3} m
 * @param {Number} [order]
 * @param {Boolean} [update]
 * @return {EZ3.Euler}
 */
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

  return this;
};

/**
 * @method EZ3.Euler#setFromQuaternion
 * @param {EZ3.Quaternion} q
 * @param {Number} [order]
 * @param {Boolean} [update]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.setFromQuaternion = function(q, order, update) {
  return this.setFromRotationMatrix(new EZ3.Matrix4().setFromQuaternion(q), order, update);
};

/**
 * @method EZ3.Euler#setFromVector3
 * @param {EZ3.Vector3} v
 * @param {Number} [order]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.setFromVector3 = function(v, order) {
  return this._set(v.x, v.y, v.z, order);
};

/**
 * @method EZ3.Euler#isEqual
 * @param {EZ3.Euler} e
 * @return {Boolean}
 */
EZ3.Euler.prototype.isEqual = function(e) {
  if (e !== undefined)
    return this._x === e.x && this._y === e.y && this._z === e.z && this._order === e.order;
  else
    return false;
};

/**
 * @method EZ3.Euler#isDiff
 * @param {EZ3.Euler} e
 * @return {Boolean}
 */
EZ3.Euler.prototype.isDiff = function(e) {
  return !this.isEqual(e);
};

/**
 * @method EZ3.Euler#toVector3
 * @return {EZ3.Vector3}
 */
EZ3.Euler.prototype.toVector3 = function() {
  return new EZ3.Vector3(this._x, this._y, this._z);
};

/**
 * @method EZ3.Euler#toString
 * @return {String}
 */
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

/**
 * @property {Number} XYZ
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.XYZ = 1;

/**
 * @property {Number} YZX
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.YZX = 2;

/**
 * @property {Number} ZXY
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.ZXY = 3;

/**
 * @property {Number} XZY
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.XZY = 4;

/**
 * @property {Number} YXZ
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.YXZ = 5;

/**
 * @property {Number} ZYX
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.ZYX = 6;
