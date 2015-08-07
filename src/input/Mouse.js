/**
 * @class Mouse
 */

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
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

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePress = function (event) {
    that._processMousePress(event);
  };

  this._onMouseMove = function (event) {
    that._processMouseMove(event);
  };

  this._onMouseUp = function (event) {
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

  this._domElement.removeEventListener('mousedown', this._onMousePointerDown, true);
  this._domElement.removeEventListener('mousemove', this._onMousePointerMove, true);
  this._domElement.removeEventListener('mouseup', this._onMousePointerUp, true);
  this._domElement.removeEventListener('mousewheel', this._onMousePointerWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onMousePointerWheel, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;
  delete this._onMouseWheel;
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.RIGHT_BUTTON = 1;
EZ3.Mouse.MIDDLE_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;
