/**
 * @class MousePointer
 * @extends Pointer
 */

EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);

  this._buttons = [];
  this.wheel = EZ3.Vec2.create();
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.prototype.processDown = function(event) {
  if(!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processDown();
};

EZ3.MousePointer.prototype.processUp = function(event) {
  this._buttons[event.button].processUp();
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
