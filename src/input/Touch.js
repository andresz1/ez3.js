/**
 * @class Touch
 */

EZ3.Touch = function(domElement, device) {
  this._domElement = domElement;
  this._device = device;

  this.enabled = false;
};

EZ3.Touch.prototype.enable = function() {
  var that = this;

  this.enabled = false;

  if (this._device.touch) {
    this._onTouchPress = function(event) {
      this._processTouchPress(event);
    };

    this._onTouchMove = function(event) {
      this._processTouchMove(event);
    };

    this._onTouchUp = function(event) {
      this._processTouchUp(event);
    };

    this._onTouchEnter = function(event) {
      this._processTouchEnter(event);
    };

    this._onTouchLeave = function(event) {
      this._processTouchLeave(event);
    };

    this._onTouchCancel = function(event) {
      this._processTouchCancel(event);
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
    delete this._onTouchEnter;
    delete this._onTouchLeave;
    delete this._onTouchCancel;
  }
};
