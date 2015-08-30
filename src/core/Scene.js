EZ3.Scene = function() {
  EZ3.Entity.call(this);
  this._lights = [];
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;

EZ3.Scene.prototype.add = function(entity) {
  if (entity instanceof EZ3.Entity) {
    if (entity instanceof EZ3.Light)
      this._lights.push(entity);
    else
      EZ3.Entity.prototype.add.call(this, entity);
  }
};

EZ3.Scene.prototype.getLights = function() {
  return this._lights;
};
