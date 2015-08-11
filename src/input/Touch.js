/**
 * @class Touch
 */

EZ3.Touch = function(domElement, device) {
  this._domElement = domElement;
  this._device = device;
  this._pointers = [];
  this.count = -1;

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

EZ3.Touch.prototype._processTouchPress = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    //var id = event.changedTouches[i].identifier;
    this.count++;

    if (!this._pointers[this.count])
      this._pointers[this.count] = new EZ3.TouchPointer(this.count);

    this._pointers[this.count].processPress(event.changedTouches[i], this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++)
    this._pointers[i].processMove(event.changedTouches[i], this.onMove);
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    //var id = event.changedTouches[i].identifier;
    if (!this._pointers[this.count])
      this._pointers[this.count] = new EZ3.TouchPointer(this.count);

    this._pointers[this.count].processUp(this.onUp);

    this.count--;
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

    if (this._device.touch === EZ3.Device.TOUCH) {
      this._press = 'touchstart';
      this._move = 'touchmove';
      this._up = 'touchend';
    } else if (this._device.touch === EZ3.Device.POINTER) {
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

EZ3.Touch.prototype.getPointer = function(id) {
  if (!this._pointers[--id])
    this._pointers[id] = new EZ3.TouchPointer(id);

  return this._pointers[id];
};

EZ3.Touch.TAP = 0;
