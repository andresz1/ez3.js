/**
 * @class Entity
 */

EZ3.Entity = function() {
  this.parent = null;
  this.children = [];

  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();

  if(this instanceof EZ3.Mesh)
    this.normal = new EZ3.Matrix3();

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
  var k;

  if(this.position.dirty || this.rotation.dirty || this.scale.dirty) {
    this.model.fromRotationTranslation(this.model, this.rotation, this.position);
    this.model.scale(this.model, this.scale);

    this.scale.dirty = false;
    this.position.dirty = false;
    this.rotation.dirty = false;
  }

  if (!this.parent) {
    if(this.model.dirty) {

      this.world.copy(this.model);

      for(k = 0; k < this.children.length; k++)
        this.children[k].world.dirty = true;

      this.model.dirty = false;

      if(this instanceof EZ3.Mesh)
        this.normal.dirty = true;
    }
  } else {
    if(this.world.dirty || this.model.dirty) {

      this.world.mul(this.model, this.parent.world);

      for(k = 0; k < this.children.length; k++)
        this.children[k].world.dirty = true;

      this.model.dirty = false;
      this.world.dirty = false;

      if(this instanceof EZ3.Mesh)
        this.normal.dirty = true;
    }
  }
};
