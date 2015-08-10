/**
 * @class Touch
 */

EZ3.Touch = function(domElement, device) {
  this._domElement = domElement;
  this._device = device;
  this._pointers = [];

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype._processTouchPress = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var id = event.changedTouches[i].identifier;

    if (!this._pointers[id])
      this._pointers[id] = new EZ3.TouchPointer(id);

    this._pointers[id].processPress(event.changedTouches[i], this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++)
    this._pointers[event.changedTouches[i].identifier].processMove(event.changedTouches[i], this.onMove);
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var id = event.changedTouches[i].identifier;

    if (!this._pointers[id])
      this._pointers[id] = new EZ3.TouchPointer(id);

    this._pointers[id].processUp(this.onUp);
  }
};

EZ3.Touch.prototype.enable = function() {
  var that = this;

  if (this._device.touch) {
    this.enabled = true;

    this._onTouchPress = function(event) {
      that._processTouchPress(event);
    };

    this._onTouchMove = function(event) {
      that._processTouchMove(event);
    };

    this._onTouchUp = function(event) {
      that._processTouchUp(event);
    };

    if (this._device.touch === EZ3.Device.TOUCH) {
      this._domElement.addEventListener('touchstart', this._onTouchPress, false);
      this._domElement.addEventListener('touchmove', this._onTouchMove, false);
      this._domElement.addEventListener('touchend', this._onTouchUp, false);
    } else if (this._device.touch === EZ3.Device.POINTER) {
      this._domElement.addEventListener('pointerdown', this._onTouchPress, false);
      this._domElement.addEventListener('pointermove', this._onTouchMove, false);
      this._domElement.addEventListener('pointerup', this._onTouchUp, false);
    } else {
      this._domElement.addEventListener('MSPointerDown', this._onTouchPress, false);
      this._domElement.addEventListener('MSPointerMove', this._onTouchMove, false);
      this._domElement.addEventListener('MSPointerUp', this._onTouchUp, false);
    }
  }
};

EZ3.Touch.prototype.disable = function() {
  if (this._device.touch) {
    this.enabled = false;

    if (this._device.touch === EZ3.device.TOUCH) {
      this._domElement.addEventListener('touchstart', this._onTouchPress, false);
      this._domElement.addEventListener('touchmove', this._onTouchMove, false);
      this._domElement.addEventListener('touchend', this._onTouchUp, false);
    } else if (this._device.touch === EZ3.device.POINTER) {
      this._domElement.addEventListener('pointerdown', this._onTouchPress, false);
      this._domElement.addEventListener('pointermove', this._onTouchMove, false);
      this._domElement.addEventListener('pointerup', this._onTouchUp, false);
    } else {
      this._domElement.addEventListener('MSPointerDown', this._onTouchPress, false);
      this._domElement.addEventListener('MSPointerMove', this._onTouchMove, false);
      this._domElement.addEventListener('MSPointerUp', this._onTouchUp, false);
    }

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;
  }
};

EZ3.Touch.prototype.getPointer = function(id) {
  if (!this._pointers[--id])
    this._pointers[id] = new EZ3.TouchPointer(id);

  return this._pointers[id];
};

EZ3.Touch.TAP = 0;
