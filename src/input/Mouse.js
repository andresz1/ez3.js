/**
 * @class EZ3.Mouse
 * @constructor
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 */
EZ3.Mouse = function(domElement, bounds) {
  /**
   * @property {HTMLElement} _domElement
   * @private
   */
  this._domElement = domElement;
  /**
   * @property {HTMLRect} _bounds
   * @private
   */
  this._bounds = bounds;

  /**
   * @property {Boolean} enabled
   * @default false
   */
  this.enabled = false;
  /**
   * @property {EZ3.MousePointer} pointer
   */
  this.pointer = new EZ3.MousePointer();
  /**
   * @property {EZ3.Signal} onPress
   */
  this.onPress = new EZ3.Signal();
  /**
   * @property {EZ3.Signal} onMove
   */
  this.onMove = new EZ3.Signal();
  /**
   * @property {EZ3.Signal} onUp
   */
  this.onUp = new EZ3.Signal();
  /**
   * @property {EZ3.Signal} onWheel
   */
  this.onWheel = new EZ3.Signal();
  /**
   * @property {EZ3.Signal} onLockChange
   */
  this.onLockChange = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

/**
 * @method EZ3.Mouse#_processMousePress
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this._domElement, this._bounds, this.onPress, this.onMove);
};

/**
 * @method EZ3.Moused#_processMouseMove
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this._domElement, this._bounds, this.onMove);
};

/**
 * @method EZ3.Moused#_processMouseUp
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

/**
 * @method EZ3.Moused#_processMouseWheel
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

/**
 * @method EZ3.Moused#_processMouseLockChange
 * @private
 */
EZ3.Mouse.prototype._processMouseLockChange = function() {
  var device = EZ3.Device;

  if (this.pointer.locked) {
    document.removeEventListener(device.pointerLockChange, this._onMouseLockChange, true);

    delete this._onMouseLockChange;
  }

  this.pointer.processLockChange(this.onLockChange);
};

/**
 * @method EZ3.Moused#requestPointerLock
 */
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

/**
 * @method EZ3.Moused#exitPointerLock
 */
EZ3.Mouse.prototype.exitPointerLock = function() {
  var device = EZ3.Device;

  if (device.exitPointerLock && this.pointer.locked)
    document[device.exitPointerLock]();
};

/**
 * @method EZ3.Moused#enable
 */
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

/**
 * @method EZ3.Moused#disable
 */
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

/**
 * @property {Number} LEFT_BUTTON
 * @memberof EZ3.Touch
 * @static
 * @final
 */
EZ3.Mouse.LEFT_BUTTON = 0;
/**
 * @property {Number} MIDDLE_BUTTON
 * @memberof EZ3.Touch
 * @static
 * @final
 */
EZ3.Mouse.MIDDLE_BUTTON = 1;
/**
 * @property {Number} RIGHT_BUTTON
 * @memberof EZ3.Touch
 * @static
 * @final
 */
EZ3.Mouse.RIGHT_BUTTON = 2;
/**
 * @property {Number} BACK_BUTTON
 * @memberof EZ3.Touch
 * @static
 * @final
 */
EZ3.Mouse.BACK_BUTTON = 3;
/**
 * @property {Number} FORWARD_BUTTON
 * @memberof EZ3.Touch
 * @static
 * @final
 */
EZ3.Mouse.FORWARD_BUTTON = 4;
