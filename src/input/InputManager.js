/**
 * @class InputManager
 */

EZ3.InputManager = function(canvas, bounds) {
  this.keyboard = new EZ3.Keyboard();
  this.mouse = new EZ3.Mouse(canvas, bounds);
  this.touch = new EZ3.Touch(canvas, bounds);

  this.enable();
};

EZ3.InputManager.prototype.enable = function() {
  this.keyboard.enable();
  this.mouse.enable();
  this.touch.enable();
};

EZ3.InputManager.prototype.disable = function() {
  this.keyboard.disable();
  this.mouse.disable();
  this.touch.disable();
};
