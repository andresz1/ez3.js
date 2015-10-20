/**
 * @class Touch
 */

EZ3.Touch = function(domElement) {
  this._device = EZ3.Device;
  this._domElement = domElement;
  this._pointers = [];

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

EZ3.Touch.prototype._searchPointerIndex = function(id) {
  for (var i = 0; i < this._pointers.length; i++)
    if (id === this._pointers[i].id)
      return i;

  return -1;
};

EZ3.Touch.prototype._processTouchPress = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var found = false;

    for (var j = 0; j < EZ3.Touch.MAX_NUM_OF_POINTERS; j++) {
      if (!this._pointers[j]) {
        this._pointers[j] = new EZ3.TouchPointer(this._domElement, j, event.changedTouches[i].identifier);
        found = true;
        break;
      } else if (this._pointers[j].isUp()) {
        this._pointers[j].id = event.changedTouches[i].identifier;
        found = true;
        break;
      }
    }

    if (found)
      this._pointers[j].processPress(event.changedTouches[i], this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processMove(event.changedTouches[i], this.onMove);
  }
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processUp(this.onUp);
  }
};

EZ3.Touch.prototype.enable = function() {
  if (this._device.touch) {
    var that = this;

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

    if (this._device.touch === EZ3.Device.TOUCH.STANDARD) {
      this._press = 'touchstart';
      this._move = 'touchmove';
      this._up = 'touchend';
    } else if (this._device.touch === EZ3.Device.TOUCH.POINTER) {
      this._press = 'pointerdown';
      this._move = 'pointermove';
      this._up = 'pointerup';
    } else {
      this._press = 'MSPointerDown';
      this._move = 'MSPointerMove';
      this._up = 'MSPointerUp';
    }

    this._domElement.addEventListener(this._press, this._onTouchPress, false);
    this._domElement.addEventListener(this._move, this._onTouchMove, false);
    this._domElement.addEventListener(this._up, this._onTouchUp, false);
  }
};

EZ3.Touch.prototype.disable = function() {
  if (this._device.touch) {
    this.enabled = false;

    this._domElement.removeEventListener(this._press, this._onTouchPress, false);
    this._domElement.removeEventListener(this._move, this._onTouchMove, false);
    this._domElement.removeEventListener(this._up, this._onTouchUp, false);

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;

    delete this._press;
    delete this._move;
    delete this._up;
  }
};

EZ3.Touch.prototype.getPointer = function(code) {
  if (!this._pointers[code])
    this._pointers[code] = new EZ3.TouchPointer(this._domElement, code);

  return this._pointers[code];
};

EZ3.Touch.POINTER_1 = 0;
EZ3.Touch.POINTER_2 = 1;
EZ3.Touch.POINTER_3 = 2;
EZ3.Touch.POINTER_4 = 3;
EZ3.Touch.POINTER_5 = 4;
EZ3.Touch.POINTER_6 = 5;
EZ3.Touch.POINTER_7 = 6;
EZ3.Touch.POINTER_8 = 7;
EZ3.Touch.POINTER_9 = 8;
EZ3.Touch.POINTER_10 = 9;
EZ3.Touch.MAX_NUM_OF_POINTERS = 10;
