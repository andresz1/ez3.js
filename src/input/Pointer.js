/**
 * @class Pointer
 */

EZ3.Pointer = function(id) {
  this.id = id;
  this.client = EZ3.Vec2.create();
  this.page = EZ3.Vec2.create();
  this.screen = EZ3.Vec2.create();

  EZ3.Vec2.set(this.client, 0, 0);
  EZ3.Vec2.set(this.page, 0, 0);
  EZ3.Vec2.set(this.screen, 0, 0);
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Pointer.prototype.processPress = function(event, onMove) {
  this.processMove(event, onMove);
};

EZ3.Pointer.prototype.processMove = function(event, onMove) {
  EZ3.Vec2.set(this.client, event.clientX, event.clientY);
  EZ3.Vec2.set(this.page, event.pageX, event.pageY);
  EZ3.Vec2.set(this.screen, event.screenX, event.screenY);

  onMove.dispatch(this);
};
