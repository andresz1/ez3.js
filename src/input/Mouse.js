/**
 * @class Mouse
 */

EZ3.Mouse = function(domElement, bounds) {
  this._domElement = domElement;
  this._bounds = bounds;

  this.enabled = false;
  this.pointer = new EZ3.MousePointer();
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
  this.onLockChange = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this._domElement, this._bounds, this.onPress, this.onMove);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this._domElement, this._bounds, this.onMove);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

EZ3.Mouse.prototype._processMouseLockChange = function() {
  var device = EZ3.Device;

  if (this.pointer.locked) {
    document.removeEventListener(device.pointerLockChange, this._onMouseLockChange, true);

    delete this._onMouseLockChange;
  }

  this.pointer.processLockChange(this.onLockChange);
};

EZ3.Mouse.prototype.requestPointerLock = function() {
  var device = EZ3.Device;
  var that;

  if (device.requestPointerLock && !this.pointer.locked) {
    that = this;

    this._onMouseLockChange = function(event) {
      that._processMouseLockChange(event);
    };

    document.addEventListener(device.pointerLockChange, this._onMouseLockChange, true);

    this._domElement[device.requestPointerLock]();
  }
};

EZ3.Mouse.prototype.exitPointerLock = function() {
  var device = EZ3.Device;

  if (device.exitPointerLock && this.pointer.locked)
    document[device.exitPointerLock]();
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;
  var device = EZ3.Device;

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

  this._domElement.addEventListener('mousedown', this._onMousePress, true);
  this._domElement.addEventListener('mousemove', this._onMouseMove, true);
  this._domElement.addEventListener('mouseup', this._onMouseUp, true);

  if (device.wheel) {
    this._onMouseWheel = function(event) {
      that._processMouseWheel(event);
    };

    this._domElement.addEventListener(device.wheel, this._onMouseWheel, true);
  }
};

EZ3.Mouse.prototype.disable = function() {
  var device = EZ3.Device;

  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMouserDown, true);
  this._domElement.removeEventListener('mousemove', this._onMouseMove, true);
  this._domElement.removeEventListener('mouseup', this._onMouseUp, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;

  if (device.wheel) {
    this._domElement.removeEventListener(device.wheel, this._onMouseWheel, true);

    delete this._onMouseWheel;
  }
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.MIDDLE_BUTTON = 1;
EZ3.Mouse.RIGHT_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;
