EZ3.Key = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Key.prototype.processDown = function(onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.call(this, this.code);

  if(onDown)
    onDown.call(this, this.code);
};

EZ3.Key.prototype.processUp = function(onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.call(this, this.code);
};

EZ3.Key.prototype.isDown = function() {
  return this._state;
};

EZ3.Key.prototype.isUp = function() {
  return !this._state;
};
