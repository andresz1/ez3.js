/**
 * @class EZ3.Pointer
 * @constructor
 */
EZ3.Pointer = function() {
  /**
   * @property {Object} last
   */
  this.last = {
    page : new EZ3.Vector2(),
    client : new EZ3.Vector2(),
    screen : new EZ3.Vector2(),
    position : new EZ3.Vector2()
  };
  /**
   * @property {Object} current
   */
  this.current = {
    page : new EZ3.Vector2(),
    client : new EZ3.Vector2(),
    screen : new EZ3.Vector2(),
    position : new EZ3.Vector2()
  };
  /**
   * @property {Boolean} entered
   * @default false
   */
  this.entered = false;
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

/**
 * @method EZ3.Pointer#processPress
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 */
EZ3.Pointer.prototype.processPress = function(event, domElement, bounds) {
  EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
};

/**
 * @method EZ3.Pointer#processMove
 * @param {HTMLEvent} event
 * @param {HTMLElement} domElement
 * @param {HTMLRect} bounds
 */
EZ3.Pointer.prototype.processMove = function(event, domElement, bounds) {
  var x = Math.round((event.clientX - bounds.left) / (bounds.right - bounds.left) * domElement.width);
  var y = Math.round((event.clientY - bounds.top) / (bounds.bottom - bounds.top) * domElement.height);

  this.last.page.copy(this.current.position);
  this.last.client.copy(this.current.client);
  this.last.screen.copy(this.current.screen);
  this.last.position.copy(this.current.position);

  this.current.page.set(event.pageX, event.pageY);
  this.current.client.set(event.clientX, event.clientY);
  this.current.screen.set(event.screenX, event.screenY);
  this.current.position.set(x, y);
};
