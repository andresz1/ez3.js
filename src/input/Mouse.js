EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
};

EZ3.Mouse.prototype._processDown = function(event) {
  this.pointer.processDown(event);
};

EZ3.Mouse.prototype._processMove = function(event) {
  this.pointer.processMove(event);
};

EZ3.Mouse.prototype._processUp = function(event) {
  this.pointer.processUp(event);
};

EZ3.Mouse.prototype._processWheel = function(event) {
  this.pointer.processWheel(event);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onDown = function (event) {
    that._processDown(event);
  };

  this._onMove = function (event) {
    that._processMove(event);
  };

  this._onUp = function (event) {
    that._processUp(event);
  };

  this._onWheel = function(event) {
    that._processWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onDown, true);
  this._domElement.addEventListener('mousemove', this._onMove, true);
  this._domElement.addEventListener('mouseup', this._onUp, true);
  this._domElement.addEventListener('mousewheel', this._onWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onDown, true);
  this._domElement.removeEventListener('mousemove', this._onMove, true);
  this._domElement.removeEventListener('mouseup', this._onUp, true);
  this._domElement.removeEventListener('mousewheel', this._onWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onWheel, true);
};
