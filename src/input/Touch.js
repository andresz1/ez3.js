/**
 * @class EZ3.Touch
 * @constructor
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 */

EZ3.Touch = function(domElement, bounds) {
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
   * @property {EZ3.TouchPointer[]} _pointers
   * @private
   */
  this._pointers = [];

  /**
   * @property {Boolean} enabled
   * @default false
   */
  this.enabled = false;
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
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

/**
 * @method EZ3.Touch#_getPointerIndex
 * @private
 * @param {Number} id
 * @return {Number}
 */
EZ3.Touch.prototype._getPointerIndex = function(id) {
  var i;

  for (i = 0; i < this._pointers.length; i++)
    if (id === this._pointers[i].id)
      return i;

  return -1;
};

/**
 * @method EZ3.Touch#_processTouchPress
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Touch.prototype._processTouchPress = function(event) {
  var touch;
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    touch = null;

    for (j = 0; j < EZ3.Touch.MAX_NUM_OF_POINTERS; j++) {
      if (!this._pointers[j]) {
        touch = event.changedTouches[i];
        this._pointers[j] = new EZ3.TouchPointer(j, touch.identifier);
        break;
      } else if (this._pointers[j].isUp()) {
        touch = event.changedTouches[i];
        this._pointers[j].id = touch.identifier;
        break;
      }
    }

    if (touch)
      this._pointers[j].processPress(touch, this._domElement, this._bounds, this.onPress, this.onMove);
  }
};

/**
 * @method EZ3.Touch#_processTouchMove
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Touch.prototype._processTouchMove = function(event) {
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    j = this._getPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processMove(event.changedTouches[i], this._domElement, this._bounds, this.onMove);
  }
};

/**
 * @method EZ3.Touch#_processTouchUp
 * @private
 * @param {HTMLEvent} event
 */
EZ3.Touch.prototype._processTouchUp = function(event) {
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    j = this._getPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processUp(this.onUp);
  }
};

/**
 * @method EZ3.Touch#enable
 */
EZ3.Touch.prototype.enable = function() {
  var device = EZ3.Device;
  var that;

  if (device.touchDown) {
    that = this;

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

    this._domElement.addEventListener(device.touchDown, this._onTouchPress, false);
    this._domElement.addEventListener(device.touchMove, this._onTouchMove, false);
    this._domElement.addEventListener(device.touchUp, this._onTouchUp, false);
  }
};

/**
 * @method EZ3.Touch#disable
 */
EZ3.Touch.prototype.disable = function() {
  var device = EZ3.Device;

  if (device.touchDown) {
    this.enabled = false;

    this._domElement.removeEventListener(device.touchDown, this._onTouchPress, false);
    this._domElement.removeEventListener(device.touchMove, this._onTouchMove, false);
    this._domElement.removeEventListener(device.touchUp, this._onTouchUp, false);

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;
  }
};

/**
 * @method EZ3.Touch#getPointer
 * @param {Number} code
 * @return {EZ3.TouchPointer}
 */
EZ3.Touch.prototype.getPointer = function(code) {
  if (!this._pointers[code])
    this._pointers[code] = new EZ3.TouchPointer(code);

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
