EZ3.inputManager = function(device, canvas) {
  this.keyboard = new EZ3.Keyboard(canvas);
  this.mouse = new EZ3.Mouse(canvas);
  this.touch = new EZ3.Touch(device, canvas);
};
