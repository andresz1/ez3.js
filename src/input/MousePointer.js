/**
 * @class EZ3.MousePointer
 * @extends EZ3.Pointer
 * @constructor
 */
EZ3.MousePointer = function() {
  EZ3.Pointer.call(this);

  /**
   * @property {EZ3.Switch[]} _buttons
   * @private
   */
  this._buttons = [];

  /**
   * @property {EZ3.Vector2} wheel
   */
  this.wheel = new EZ3.Vector2();
  /**
   * @property {EZ3.Vector2} movement
   */
  this.movement = new EZ3.Vector2();
  /**
   * @property {Boolean} locked
   * @default false
   */
  this.locked = false;
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

/**
 * @method EZ3.MousePointer#processPress
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 * @param {EZ3.Signal} onPress
 * @param {EZ3.Signal} onMove
 */
EZ3.MousePointer.prototype.processPress = function(event, domElement, bounds, onPress, onMove) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processPress();
  EZ3.Pointer.prototype.processPress.call(this, event, domElement, bounds);

  onPress.dispatch(this._buttons[event.button]);
  onMove.dispatch(this);
};

/**
 * @method EZ3.MousePointer#processMove
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 * @param {EZ3.Signal} onMove
 */
EZ3.MousePointer.prototype.processMove = function(event, domElement, bounds, onMove) {
  if (!this.locked)
    EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
  else {
    this.movement.x = event.movementX || event.mozMovementX || 0;
    this.movement.y = event.movementY || event.mozMovementY || 0;
  }

  onMove.dispatch(this);
};

/**
 * @method EZ3.MousePointer#processUp
 * @param {HTMLEvent} event
 * @param {EZ3.Signal} onUp
 */
EZ3.MousePointer.prototype.processUp = function(event, onUp) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processUp();

  onUp.dispatch(this._buttons[event.button]);
};

/**
 * @method EZ3.MousePointer#processWheel
 * @param {HTMLEvent} event
 * @param {EZ3.Signal} onWheel
 */
EZ3.MousePointer.prototype.processWheel = function(event, onWheel) {
  this.wheel.x = event.wheelDeltaX || event.deltaX;
  this.wheel.y = event.wheelDeltaY || event.deltaY;

  onWheel.dispatch(this.wheel);
};

/**
 * @method EZ3.MousePointer#processLockChange
 * @param {EZ3.Signal} onLockChange
 */
EZ3.MousePointer.prototype.processLockChange = function(onLockChange) {
  this.locked = !this.locked;

  onLockChange.dispatch(this.locked);
};

/**
 * @method EZ3.MousePointer#getButton
 * @param {Number} code
 * @return {EZ3.Switch}
 */
EZ3.MousePointer.prototype.getButton = function(code) {
  if (!this._buttons[code])
    this._buttons[code] = new EZ3.Switch(code);

  return this._buttons[code];
};
