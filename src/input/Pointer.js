/**
 * @class Pointer
 */

EZ3.Pointer = function(domElement) {
  this._domElement = domElement;
  this._bound = domElement.getBoundingClientRect();

  this.page = new EZ3.Vector2();
  this.client = new EZ3.Vector2();
  this.screen = new EZ3.Vector2();
  this.position = new EZ3.Vector2();
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Pointer.prototype.processPress = function(event) {
  EZ3.Pointer.prototype.processMove.call(this, event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  this.page.set(event.pageX, event.pageY);
  this.client.set(event.clientX, event.clientY);
  this.screen.set(event.screenX, event.screenY);

  this.position.x = Math.round((event.clientX - this._bound.left) / (this._bound.right - this._bound.left) * this._domElement.width);
  this.position.y = Math.round((event.clientY - this._bound.top) / (this._bound.bottom - this._bound.top) * this._domElement.height);
};
