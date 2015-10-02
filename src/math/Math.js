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
