/**
 * @class Mouse
 */

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;
  this._device = EZ3.Device;

  this.enabled = false;
  this.pointer = new EZ3.MousePointer(domElement);
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
  this.onLockChange = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this.onPress, this.onMove);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this.onMove);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

EZ3.Mouse.prototype._processMouseLockChange = function() {
  if (this.pointer.locked) {
    document.removeEventListener(this._device.pointerLockChange, this._onMouseLockChange, true);

    delete this._onMouseLockChange;
  }

  this.pointer.processLockChange(this.onLockChange);
};

EZ3.Mouse.prototype.lock = function() {
  var that;

  if (this._device.requestPointerLock && !this.pointer.locked) {
    that = this;

    this._onMouseLockChange = function(event) {
      that._processMouseLockChange(event);
    };

    document.addEventListener(this._device.pointerLockChange, this._onMouseLockChange, true);

    this._domElement[this._device.requestPointerLock]();
  }
};

EZ3.Mouse.prototype.unlock = function() {
  if (this._device.cancelPointerLock && this.pointer.locked)
    document[this._device.cancelPointerLock]();
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePress = function(event) {
    that._processMousePress(event);
  };

  this._onMouseMove = function(event) {
    that._processMouseMove(event);
  };

  this._onMouseUp = function(event) {
    that._processMouseUp(event);
  };

  this._onMouseWheel = function(event) {
    that._processMouseWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onMousePress, true);
  this._domElement.addEventListener('mousemove', this._onMouseMove, true);
  this._domElement.addEventListener('mouseup', this._onMouseUp, true);
  this._domElement.addEventListener('mousewheel', this._onMouseWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onMouseWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMouserDown, true);
  this._domElement.removeEventListener('mousemove', this._onMouseMove, true);
  this._domElement.removeEventListener('mouseup', this._onMouseUp, true);
  this._domElement.removeEventListener('mousewheel', this._onMouseWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onMouseWheel, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;
  delete this._onMouseWheel;
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.MIDDLE_BUTTON = 1;
EZ3.Mouse.RIGHT_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;
