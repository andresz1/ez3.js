EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
};

EZ3.Mouse.prototype._processMousePointerDown = function(event) {
  this.pointer.processButtonDown(event);
};

EZ3.Mouse.prototype._processMousePointerMove = function(event) {
  this.pointer.processButtonMove(event);
};

EZ3.Mouse.prototype._processMousePointerUp = function(event) {
  this.pointer.processButtonUp(event);
};

EZ3.Mouse.prototype._processMousePointerWheel = function(event) {
  this.pointer.processWheel(event);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePointerDown = function (event) {
    that._processDown(event);
  };

  this._onMousePointerMove = function (event) {
    that._processMove(event);
  };

  this._onMousePointerUp = function (event) {
    that._processUp(event);
  };

  this._onMousePointerWheel = function(event) {
    that._processWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onMousePointerDown, true);
  this._domElement.addEventListener('mousemove', this._onMousePointerMove, true);
  this._domElement.addEventListener('mouseup', this._onMousePointerUp, true);
  this._domElement.addEventListener('mousewheel', this._onMousePointerWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onMousePointerWheel, true);
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
