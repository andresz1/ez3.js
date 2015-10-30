/**
 * @class TouchPointer
 * @extends Pointer
 * @extends Switch
 */

EZ3.TouchPointer = function(domElement, code, id) {
  EZ3.Pointer.call(this, domElement);
  EZ3.Switch.call(this, code);

  this.id = id || 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.extends(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

EZ3.TouchPointer.prototype.processPress = function(event, onPress, onMove) {
  EZ3.Pointer.prototype.processPress.call(this, event);
  EZ3.Switch.prototype.processPress.call(this);

  onPress.dispatch(this);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processMove = function(event, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processUp = function(onUp) {
  EZ3.Switch.prototype.processUp.call(this);
  onUp.dispatch(this);
};
