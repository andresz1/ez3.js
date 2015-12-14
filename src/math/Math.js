/**
 * @class Math
 */

EZ3.Math = function() {
  this.PI = Math.PI;
  this.HALF_PI = this.PI * 0.5;
  this.DOUBLE_PI = 2.0 * this.PI;
  this.MAX_UINT = Math.pow(2, 32) - 1;
  this.MAX_USHORT = Math.pow(2, 16) - 1;
};

EZ3.Math = new EZ3.Math();

EZ3.Math.isPowerOfTwo = function(x) {
  return (x & (x - 1)) === 0;
};

EZ3.Math.toRadians = function(x) {
  return x * EZ3.Math.PI / 180.0;
};

EZ3.Math.toDegrees = function(x) {
  return x * 180.0 / EZ3.Math.PI;
};

EZ3.Math.nextHighestPowerOfTwo = function(x) {
  --x;
  for (var i = 1; i < 32; i <<= 1)
    x = x | x >> i;

  return x + 1;
};

EZ3.Math.clamp = function(x, min, max) {
  return Math.min(max, Math.max(x, min));
};
