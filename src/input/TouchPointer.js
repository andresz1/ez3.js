/**
 * @class TouchPointer
 * @extends Pointer
 * @extends Switch
 */

EZ3.TouchPointer = function(id) {
  EZ3.Pointer.call(this, id);
  EZ3.Switch.call(this, EZ3.Touch.TAP);
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
mixin(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;
