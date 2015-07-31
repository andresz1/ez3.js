EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.processDown = function(context, onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.call(context, this);

  if(onDown)
    onDown.call(context, this);
};

EZ3.Switch.prototype.processUp = function(context, onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.call(context, this);
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;

EZ3.Key = EZ3.Switch;
EZ3.Button = EZ3.Switch;
