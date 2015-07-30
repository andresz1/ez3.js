EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);

  this._buttons = [];
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

EZ3.MousePointer.prototype.getButton = function(buttonCode) {
  if(!this._buttons[buttonCode])
    this._buttons[buttonCode] = new EZ3.Button(buttonCode);
};

EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;
