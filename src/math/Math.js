/**
 * Math constants and functions.
 * @class EZ3.Math
 * @static
 */
EZ3.Math = function() {
  /**
   * @property {Number} PI
   * @final
   */
  this.PI = Math.PI;

  /**
   * @property {Number} HALF_PI
   * @final
   */
  this.HALF_PI = this.PI * 0.5;

  /**
   * @property {Number} DOUBLE_PI
   * @final
   */
  this.DOUBLE_PI = 2.0 * this.PI;

  /**
   * @property {Number} MAX_UINT
   * @final
   */
  this.MAX_UINT = Math.pow(2, 32) - 1;

  /**
   * @property {Number} MAX_USHORT
   * @final
   */
  this.MAX_USHORT = Math.pow(2, 16) - 1;
};

EZ3.Math = new EZ3.Math();

/**
 * @method EZ3.Math#isPowerOfTwo
 * @param {Number} x
 * @return {Boolean}
 */
EZ3.Math.isPowerOfTwo = function(x) {
  return (x & (x - 1)) === 0;
};

/**
 * @method EZ3.Math#toRadians
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.toRadians = function(x) {
  return x * EZ3.Math.PI / 180.0;
};

/**
 * @method EZ3.Math#toDegrees
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.toDegrees = function(x) {
  return x * 180.0 / EZ3.Math.PI;
};

/**
 * @method EZ3.Math#nextHighestPowerOfTwo
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.nextHighestPowerOfTwo = function(x) {
  --x;
  for (var i = 1; i < 32; i <<= 1)
    x = x | x >> i;

  return x + 1;
};

/**
 * @method EZ3.Math#clamp
 * @param {Number} x
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
EZ3.Math.clamp = function(x, min, max) {
  return Math.min(max, Math.max(x, min));
};
