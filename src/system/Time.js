/**
 * @class Time
 */

EZ3.Time = function() {
  this.now = 0;
  this.previous = 0;
  this.elapsed = 0;
  this.started = 0;
};

EZ3.Time.prototype.start = function() {
  this.started = this.now = Date.now();
};

EZ3.Time.prototype.update = function() {
  this.previous = this.now;
  this.now = Date.now();
  this.elapsed = (this.now - this.previous) * 0.001;
};
