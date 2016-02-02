/**
 * @class EZ3.Switch
 * @constructor
 * @param {Number} code
 */
EZ3.Switch = function(code) {
  /**
   * @property {Boolean} _state
   */
  this._state = false;

  /**
   * @property {Number} code
   */
  this.code = code;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;

/**
 * @method EZ3.Switch#processPress
 */
EZ3.Switch.prototype.processPress = function() {
  this._state = true;
};

/**
 * @method EZ3.Switch#processDown
 */
EZ3.Switch.prototype.processDown = function() {
  var isUp = this.isUp();

  this._state = true;

  return isUp;
};

/**
 * @method EZ3.Switch#processUp
 */
EZ3.Switch.prototype.processUp = function() {
  this._state = false;
};

/**
 * @method EZ3.Switch#isDown
 * @return {Boolean}
 */
EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

/**
 * @method EZ3.Switch#isUp
 * @return {Boolean}
 */
EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};
