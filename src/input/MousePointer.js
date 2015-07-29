EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);

  this._states = {};
  this._states[EZ3.MousePointer.LEFT_BUTTON] = false;
  this._states[EZ3.MousePointer.RIGHT_BUTTON] = false;
  this._states[EZ3.MousePointer.MIDDLE_BUTTON] = false;
  this._states[EZ3.MousePointer.BACK_BUTTON] = false;
  this._states[EZ3.MousePointer.FORWARD_BUTTON] = false;
  this.wheel = EZ3.Vector2.create();
};

EZ3.MousePointer.prototype.processDown = function(event) {
  this._states[event.button] = true;
  EZ3.Pointer.prototype.processDown.call(this, event);
};

EZ3.MousePointer.prototype.processMove = function(event) {
  EZ3.Pointer.prototype.processMove.call(this, event);
};

EZ3.MousePointer.prototype.processUp = function(event) {
  this._states[event.button] = false;
  //EZ3.Pointer.prototype.processUp.call(this, event);
};

EZ3.MousePointer.prototype.processWheel = function(event) {
  if (event.wheelDeltaX)
    this.wheel[0] = event.wheelDeltaX;
  else
    this.wheel[1] = event.deltaX;

  if (event.wheelDeltaY)
    this.wheel[0] = event.wheelDeltaY;
  else
    this.wheel[1] = event.deltaY;
};

EZ3.MousePointer.prototype.isDown = function(button) {
  return this._states[button];
};

EZ3.MousePointer.prototype.isUp = function(button) {
  return !this._states[button];
};

EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.LEFT_BUTTON = 0;
EZ3.MousePointer.RIGHT_BUTTON = 1;
EZ3.MousePointer.MIDDLE_BUTTON = 2;
EZ3.MousePointer.BACK_BUTTON = 3;
EZ3.MousePointer.FORWARD_BUTTON = 4;
