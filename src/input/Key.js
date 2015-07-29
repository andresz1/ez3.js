EZ3.Key = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Key.prototype.processDown = function(context, onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.call(context, this);

  if(onDown)
    onDown.call(context, this);
};

EZ3.Key.prototype.processUp = function(context, onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.call(context, this);
};

EZ3.Key.prototype.isDown = function() {
  return this._state;
};

EZ3.Key.prototype.isUp = function() {
  return !this._state;
};
