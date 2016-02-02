/**
 * @class EZ3.InputManager
 * @constructor
 * @param {HTMLElement} canvas
 * @param {HTMLRect} bounds
 */
EZ3.InputManager = function(canvas, bounds) {
  /**
   * @property {EZ3.Keyboard} keyboard
   */
  this.keyboard = new EZ3.Keyboard();
  /**
   * @property {EZ3.Mouse} mouse
   */
  this.mouse = new EZ3.Mouse(canvas, bounds);
  /**
   * @property {EZ3.Touch} touch
   */
  this.touch = new EZ3.Touch(canvas, bounds);

  this.enable();
};

/**
 * @method EZ3.InputManager#enable
 */
EZ3.InputManager.prototype.enable = function() {
  this.keyboard.enable();
  this.mouse.enable();
  this.touch.enable();
};

/**
 * @method EZ3.InputManager#disable
 */
EZ3.InputManager.prototype.disable = function() {
  this.keyboard.disable();
  this.mouse.disable();
  this.touch.disable();
};
