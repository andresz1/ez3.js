EZ3.Scene = function() {
  EZ3.Entity.call(this);
  this.spots = [];
  this.puntuals = [];
  this.directionals = [];
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;

EZ3.Scene.prototype.add = function(entity) {
  if (entity instanceof EZ3.Entity) {
      if (entity instanceof EZ3.Spot)
        this.spots.push(entity);
      else if (entity instanceof EZ3.Puntual)
        this.puntuals.push(entity);
      else if(entity instanceof EZ3.Directional)
        this.directionals.push(entity);
      EZ3.Entity.prototype.add.call(this, entity);
    }
};
