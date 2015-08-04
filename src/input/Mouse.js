EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
};

EZ3.Mouse.prototype._processMouseDown = function(event) {
  this.pointer.processDown(event);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMouseDown = function (event) {
    that._processMouseDown(event);
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

  this._domElement.addEventListener('mousedown', this._onMouseDown, true);
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
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.RIGHT_BUTTON = 1;
EZ3.Mouse.MIDDLE_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;
