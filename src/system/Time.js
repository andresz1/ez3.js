/**
 * @class EZ3.Time
 * @constructor
 */
EZ3.Time = function() {
  /**
   * @property {Number} now
   */
  this.now = 0;
  /**
   * @property {Number} previous
   */
  this.previous = 0;
  /**
   * @property {Number} elapsed
   */
  this.elapsed = 0;
  /**
   * @property {Number} started
   */
  this.started = 0;
};

/**
 * @method EZ3.Time#start
 */
EZ3.Time.prototype.start = function() {
  this.started = this.now = Date.now();
};

/**
 * @method EZ3.Time#update
 */
EZ3.Time.prototype.update = function() {
  this.previous = this.now;
  this.now = Date.now();
  this.elapsed = (this.now - this.previous) * 0.001;
};
