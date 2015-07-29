EZ3.Pointer = function(id) {
  this.id = id;
  this.client = EZ3.Vector2.create();
  this.page = EZ3.Vector2.create();
  this.screen = EZ3.Vector2.create();
};

EZ3.Pointer.prototype.processDown = function(event) {
  this.processMove(event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  this.client[0] = event.clientX;
  this.client[1] = event.clientY;

  this.page[0] = event.pageX;
  this.page[1] = event.pageY;

  this.screen[0] = event.screenX;
  this.screen[0] = event.screenY;
};
