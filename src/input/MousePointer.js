EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);
  EZ3.Extends(this, EZ3.Pointer);

  this._buttons = [];
  this.wheel = EZ3.Vec2.create();
};

EZ3.MousePointer.prototype.processButtonDown = function(event) {
  this._states[event.button] = true;
  EZ3.Pointer.prototype.processDown.call(this, event);
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
