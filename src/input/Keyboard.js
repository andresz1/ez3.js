EZ3.Keyboard = function(domElement) {
  this._domElement = domElement;

  this.enabled = true;
};

EZ3.Keyboard.prototype.enable = function() {
  this.enabled = true;
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;
};
