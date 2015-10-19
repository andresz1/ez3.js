/**
 * @class Entity
 */

EZ3.Entity = function() {
  this.parent = null;
  this.children = [];

  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();

  this.scale = new EZ3.Vector3(1, 1, 1);
  this.position = new EZ3.Vector3(0, 0, 0);
  this.rotation = new EZ3.Quaternion(1, 0, 0, 0);
};

EZ3.Entity.prototype.add = function(child) {
  if (child instanceof EZ3.Entity) {
    if (child.parent)
      child.parent.remove(child);

    child.parent = this;
    this.children.push(child);
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if (~position)
    this.children.splice(position, 1);
};

EZ3.Entity.prototype.updateWorld = function() {
  this.model.fromRotationTranslation(this.model, this.rotation, this.position);
  this.model.scale(this.model, this.scale);

  if (!this.parent)
    this.world.copy(this.model);
  else
    this.world.mul(this.model, this.parent.world);
};
