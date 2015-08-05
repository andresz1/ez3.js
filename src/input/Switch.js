/**
 * @class Switch
 */

EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.processPress = function(onPress) {
  this._state = true;

  onPress.dispatch(this);
};

EZ3.Switch.prototype.processDown = function(onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp)
    onPress.dispatch(this);

  onDown.dispatch(this);
};

EZ3.Switch.prototype.processUp = function(onUp) {
  this._state = false;

  onUp.dispatch(this);
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;
