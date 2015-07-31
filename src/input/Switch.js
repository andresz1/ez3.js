EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.processDown = function(onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.dispatch(this);

  if(onDown)
    onDown.dispatch(this);
};

EZ3.Switch.prototype.processUp = function(onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.dispatch(this);
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;
