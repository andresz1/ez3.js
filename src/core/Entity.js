EZ3.Entity = function() {
  this.parent = null;
  this.children = [];
  this.scale = vec3.create();
  this.position = vec3.create();
  this.rotation = quat.create();
  this.modelMatrix = mat4.create();
  this.worldMatrix = mat4.create();
  this.normalMatrix = mat3.create();

  vec3.set(this.scale, 1, 1 ,1);
  vec3.set(this.position, 0, 0 ,0);
  quat.set(this.rotation, 0, 0, 0, 0);

  mat4.identity(this.modelMatrix);
  mat4.identity(this.worldMatrix);
  mat3.identity(this.normalMatrix);

  this.dirty = true;
  this.scale.dirty = false;
  this.position.dirty = false;
  this.rotation.dirty = false;
};

EZ3.Entity.prototype.add = function(child) {
  if(child instanceof EZ3.Entity){

    if(child.parent)
      child.parent.remove(child);

    this.dirty = true;
    child.parent = this;
    this.children.push(child);

  }else{
    throw('Child object must have a prototype of Entity');
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if(~position){
    this.children.splice(position,1);
    this.dirty = true;
  }
};

EZ3.Entity.prototype.update = function(parentIsDirty, parentWorldMatrix) {
  this.dirty = this.dirty || parentIsDirty || this.scale.dirty || this.position.dirty || this.rotation.dirty;

  if(this.dirty){

    mat4.fromRotationTranslation(this.modelMatrix, this.rotation, this.position);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

    if(!parentWorldMatrix)
        mat4.copy(this.worldMatrix, this.modelMatrix);
    else
        mat4.multiply(this.worldMatrix, parentWorldMatrix, this.modelMatrix);

    mat3.normalFromMat4(this.normalMatrix, this.worldMatrix);

    for(var k = this.children.length - 1; k >= 0; --k)
      this.children[k].update(this.dirty, this.worldMatrix);

    this.dirty = false;
    this.scale.dirty = false;
    this.position.dirty = false;
    this.rotation.dirty = false;
  }
};
