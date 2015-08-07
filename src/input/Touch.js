/**
 * @class Touch
 */

EZ3.Touch = function(domElement, device) {
  this._domElement = domElement;
  this._device = device;
  this._pointers = [];

  this.enabled = false;
};

EZ3.Touch._onTouchPress = function(event) {
  event.preventDefault();

	for (var i = 0; i < event.changedTouches.length; i++) {
    var id = event.changedTouches[i].identifier;

    if(!this._pointers[id])
      this._pointers[id] = new EZ3.TouchPointer(id);

    this._pointers[id].processDown();
  }
};

EZ3.Touch._onTouchMove = function(event) {

};

EZ3.Touch._onTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++)
    this._pointers[event.changedTouches[i].identifier].processUp();
};

EZ3.Touch.prototype.enable = function() {
  var that = this;

  this.enabled = false;

  if (this._device.touch) {
    this._onTouchPress = function(event) {
      that._processTouchPress(event);
    };

    this._onTouchMove = function(event) {
      that._processTouchMove(event);
    };

    this._onTouchUp = function(event) {
      that._processTouchUp(event);
    };

    if(this._device.touch === EZ3.device.TOUCH) {
      this._domElement.addEventListener('touchstart', this._onTouchPress, false);
      this._domElement.addEventListener('touchmove', this._onTouchMove, false);
      this._domElement.addEventListener('touchend', this._onTouchUp, false);
    }
    else if (this._device.touch === EZ3.device.POINTER) {
      this._domElement.addEventListener('pointerdown', this._onTouchPress, false);
      this._domElement.addEventListener('pointermove', this._onTouchMove, false);
      this._domElement.addEventListener('pointerup', this._onTouchUp, false);
    }
    else {
      this._domElement.addEventListener('MSPointerDown', this._onTouchPress, false);
      this._domElement.addEventListener('MSPointerMove', this._onTouchMove, false);
      this._domElement.addEventListener('MSPointerUp', this._onTouchUp, false);
    }
  }
};

EZ3.Touch.prototype.disable = function() {
  this.enabled = false;

  if (this._device.touch) {
    if(this._device.touch === EZ3.device.TOUCH) {
      this._domElement.addEventListener('touchstart', this._onTouchPress, false);
      this._domElement.addEventListener('touchmove', this._onTouchMove, false);
      this._domElement.addEventListener('touchend', this._onTouchUp, false);
    }
     else if (this._device.touch === EZ3.device.POINTER) {
      this._domElement.addEventListener('pointerdown', this._onTouchPress, false);
      this._domElement.addEventListener('pointermove', this._onTouchMove, false);
      this._domElement.addEventListener('pointerup', this._onTouchUp, false);
    }
    else {
      this._domElement.addEventListener('MSPointerDown', this._onTouchPress, false);
      this._domElement.addEventListener('MSPointerMove', this._onTouchMove, false);
      this._domElement.addEventListener('MSPointerUp', this._onTouchUp, false);
    }

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;
  }
};

EZ3.Touch.TAP = 0;
