/**
 * @class MousePointer
 * @extends Pointer
 */

EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);

  this._buttons = [];

  this.wheel = EZ3.Vec2.create();

  EZ3.Vec2.set(this.wheel, 0, 0);
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.prototype.processPress = function(event, onPress, onMove) {
  if(!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processPress(onPress);
  EZ3.Pointer.prototype.processPress.call(this, event, onMove);
};

EZ3.MousePointer.prototype.processUp = function(event, onUp) {
  this._buttons[event.button].processUp(onUp);
};

EZ3.MousePointer.prototype.processWheel = function(event, onWheel) {
  if (event.wheelDeltaX)
    this.wheel[0] = event.wheelDeltaX;
  else
    this.wheel[1] = event.deltaX;

  if (event.wheelDeltaY)
    this.wheel[0] = event.wheelDeltaY;
  else
    this.wheel[1] = event.deltaY;

  onWheel.dispatch(this);
};

EZ3.MousePointer.prototype.getButton = function(buttonCode) {
  if(!this._buttons[buttonCode])
    this._buttons[buttonCode] = new EZ3.Switch(buttonCode);

  return this._buttons[buttonCode];
};
