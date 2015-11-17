/**
 * @class TouchPointer
 * @extends Pointer
 * @extends Switch
 */

EZ3.TouchPointer = function(code, id) {
  EZ3.Pointer.call(this);
  EZ3.Switch.call(this, code);

  this.id = id || 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.extends(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

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

EZ3.TouchPointer.prototype.processMove = function(event, domElement, bounds, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processUp = function(onUp) {
  EZ3.Switch.prototype.processUp.call(this);
  onUp.dispatch(this);
};
