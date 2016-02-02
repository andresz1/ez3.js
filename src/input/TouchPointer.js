/**
 * @class EZ3.TouchPointer
 * @extends EZ3.Pointer
 * @extends EZ3.Switch
 * @constructor
 * @param {Number} code
 * @param {Number} id
 */
EZ3.TouchPointer = function(code, id) {
  EZ3.Pointer.call(this);
  EZ3.Switch.call(this, code);

  /**
   * @property {Number} id
   * @default 0
   */
  this.id = (id !== undefined)? id : 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.extends(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

/**
 * @method EZ3.TouchPointer#processPress
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 * @param {EZ3.Signal} onPress
 * @param {EZ3.Signal} onMove
 */
EZ3.TouchPointer.prototype.processPress = function(event, domElement, bounds, onPress, onMove) {
  EZ3.Pointer.prototype.processPress.call(this, event, domElement, bounds);
  EZ3.Switch.prototype.processPress.call(this);

  this.last.page.copy(this.current.position);
  this.last.client.copy(this.current.client);
  this.last.screen.copy(this.current.screen);
  this.last.position.copy(this.current.position);

  onPress.dispatch(this);
  onMove.dispatch(this);
};

/**
 * @method EZ3.TouchPointer#processMove
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 * @param {EZ3.Signal} onMove
 */
EZ3.TouchPointer.prototype.processMove = function(event, domElement, bounds, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
  onMove.dispatch(this);
};

/**
 * @method EZ3.TouchPointer#processUp
 * @param {EZ3.Signal} onUp
 */
EZ3.TouchPointer.prototype.processUp = function(onUp) {
  EZ3.Switch.prototype.processUp.call(this);
  onUp.dispatch(this);
};
