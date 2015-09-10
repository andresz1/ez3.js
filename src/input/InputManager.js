/**
 * @class InputManager
 */

EZ3.InputManager = function(canvas) {
  this.keyboard = new EZ3.Keyboard();
  this.mouse = new EZ3.Mouse(canvas);
  this.touch = new EZ3.Touch(canvas);
};
