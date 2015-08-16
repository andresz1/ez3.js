EZ3.Entity = function() {
  this._name = null;
  this._parent = null;
  this._children = [];
  this._scale = vec3.create();
  this._position = vec3.create();
  this._rotation = quat.create();
  this._modelMatrix = mat4.create();
  this._worldMatrix = mat4.create();
  this._normalMatrix = mat3.create();

  this._dirty = true;
  this._scale.dirty = false;
  this._position.dirty = false;
  this._rotation.dirty = false;
};

EZ3.Entity.prototype.add = function(child) {

  if(child instanceof EZ3.Entity){

    if(child.parent){
      child._parent.remove(child);
    }

    this._dirty = true;
    child.parent = this;
    this._children.push(child);

  }else{
    throw('Child object must have a prototype of Entity');
  }

};

EZ3.Entity.prototype.remove = function(child) {
  var position = this._children.indexOf(child);

  if(~position){
    this._children.splice(position,1);
    this._dirty = true;
  }
};

EZ3.Entity.prototype.update = function(parentIsDirty, parentWorldMatrix) {
  var childrenCount = this._children.length;

  this._dirty = this._dirty || parentIsDirty || this._scale.dirty || this._position.dirty || this._rotation.dirty;

  if(this._dirty){

    mat4.fromRotationTranslation(this._modelMatrix, this._rotation, this._position);
    mat4.scale(this._modelMatrix, this._scale);

    mat4.multiply(this._worldMatrix, parentWorldMatrix, this._modelMatrix);

    mat3.normalFromMat4(this._normalMatrix, this._worldMatrix);

    while(--childrenCount) {
      this._children[childrenCount].update(this._worldMatrix, this._dirty);
    }

    this.dirty = false;
    this._scale.dirty = false;
    this._position.dirty = false;
    this._rotation.dirty = false;

  }

};
