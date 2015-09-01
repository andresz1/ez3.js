/**
 * @class Entity
 */

EZ3.Entity = function() {
  this.parent = null;
  this.children = [];

  this.scale = {};
  this.scale.dirty = true;
  this.scale.value = vec3.create();
  vec3.set(this.scale.value, 1, 1 ,1);

  this.position = {};
  this.position.dirty = false;
  this.position.value = vec3.create();
  vec3.set(this.position.value, 0, 0 ,0);

  this.rotation = {};
  this.rotation.dirty = true;
  this.rotation.value = quat.create();
  quat.set(this.rotation.value, 0, 0 ,0 ,0);

  this.modelMatrix = {};
  this.modelMatrix.value = mat4.create();
  mat4.identity(this.modelMatrix.value);

  this.worldMatrix = {};
  this.worldMatrix.value = mat4.create();
  mat4.identity(this.worldMatrix.value);

  this.normalMatrix = {};
  this.normalMatrix.value = mat3.create();
  mat3.identity(this.normalMatrix.value);
};

EZ3.Entity.prototype.add = function(child) {
  if (child instanceof EZ3.Entity) {

    if (child.parent)
      child.parent.remove(child);

    this.dirty = true;
    child.parent = this;
    this.children.push(child);

  } else {
    throw ('Child object must have a prototype of Entity Or Light');
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if (~position) {
    this.children.splice(position, 1);
    this.dirty = true;
  }
};

EZ3.Entity.prototype.update = function(parentIsDirty, parentWorldMatrix) {
  var dirty = this.scale.dirty || this.position.dirty || this.rotation.dirty || parentIsDirty;

  if (dirty) {

    if(this.scale.dirty || this.position.dirty || this.rotation.dirty) {

      if (this.scale.dirty)
        this.scale.dirty = false;

      if (this.rotation.dirty)
        this.rotation.dirty = false;

      if (this.position.dirty)
        if (!(this instanceof EZ3.Spot || this instanceof EZ3.Puntual))
          this.position.dirty = false;

      mat4.fromRotationTranslation(this.modelMatrix.value, this.rotation.value, this.position.value);
      mat4.scale(this.modelMatrix.value, this.modelMatrix.value, this.scale.value);
    }

    if (!parentWorldMatrix)
      mat4.copy(this.worldMatrix.value, this.modelMatrix.value);
    else
      mat4.multiply(this.worldMatrix.value, parentWorldMatrix.value, this.modelMatrix.value);

    mat3.normalFromMat4(this.normalMatrix.value, this.worldMatrix.value);

    for (var k = this.children.length - 1; k >= 0; --k)
      this.children[k].update(dirty, this.worldMatrix);
  }
};
