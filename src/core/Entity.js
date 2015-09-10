/**
 * @class Entity
 */

EZ3.Entity = function() {
  this.dirty = true;

  this._parent = null;
  this._children = [];

  this._modelMatrix = new EZ3.Matrix4();
  this._worldMatrix = new EZ3.Matrix4();
  this._normalMatrix = new EZ3.Matrix3();

  this._scale = new EZ3.Vector3(1, 1 ,1);
  this._position = new EZ3.Vector3(0, 0, 0);
  this._rotation = new EZ3.Quaternion(1, 0, 0, 0);
};

EZ3.Entity.prototype.add = function(child) {
  if (child instanceof EZ3.Entity) {

    if (child.parent)
      child.parent.remove(child);

    this._dirty = true;
    child.parent = this;
    this._children.push(child);

  } else {
    throw ('Child object must have a prototype of Entity Or Light');
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this._children.indexOf(child);

  if (~position) {
    this._children.splice(position, 1);
    this._dirty = true;
  }
};

EZ3.Entity.prototype.update = function(parentIsDirty, parentWorldMatrix) {

  if(parentIsDirty !== undefined)
    this.dirty = this.dirty || this.scale.dirty || this.position.dirty || this.rotation.dirty || parentIsDirty;
  else
    this.dirty = this.dirty || this.scale.dirty || this.position.dirty || this.rotation.dirty;

  if (this.dirty) {

    if(this.scale.dirty || this.position.dirty || this.rotation.dirty) {

      if (this.scale.dirty)
        this.scale.dirty = false;

      if (this.rotation.dirty)
        this.rotation.dirty = false;

      if (this.position.dirty)
        this.position.dirty = false;

      this.modelMatrix = this.modelMatrix.fromRotationTranslation(this.modelMatrix, this.rotation, this.position);
      this.modelMatrix = this.modelMatrix.scale(this.modelMatrix, this.scale);
    }

    if((parentWorldMatrix && parentWorldMatrix.dirty) || this.modelMatrix.dirty) {
      this.modelMatrix.dirty = false;

      if (!parentWorldMatrix)
        this.worldMatrix.copy(this.modelMatrix);
      else
        this.worldMatrix.mul(this.modelMatrix, parentWorldMatrix);
    }

    for (var k = this._children.length - 1; k >= 0; --k)
      this._children[k].update(this.dirty, this.worldMatrix);

    if(this.worldMatrix.dirty) {
      this.worldMatrix.dirty = false;
      this.normalMatrix.normalFromMat4(this.worldMatrix);
    }

    if(this instanceof EZ3.Mesh)
      this.dirty = false;
  }
};

Object.defineProperty(EZ3.Entity.prototype, "parent", {
  get: function() {
    return this._parent;
  },
  set: function(parent) {
    this._parent = parent;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "children", {
  get: function() {
    return this._children;
  },
  set: function(children) {
    this._children = children;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "scale", {
  get: function() {
    return this._scale;
  },
  set: function(scale) {
    this._scale.copy(scale);
  }
});

Object.defineProperty(EZ3.Entity.prototype, "position", {
  get: function() {
    return this._position;
  },
  set: function(position) {
    this._position.copy(position);
  }
});

Object.defineProperty(EZ3.Entity.prototype, "rotation", {
  get: function() {
    return this._rotation;
  },
  set: function(rotation) {
    this._rotation.copy(rotation);
  }
});

Object.defineProperty(EZ3.Entity.prototype, "modelMatrix", {
  get: function() {
    return this._modelMatrix;
  },
  set: function(modelMatrix) {
    this._modelMatrix.copy(modelMatrix);
  }
});

Object.defineProperty(EZ3.Entity.prototype, "worldMatrix", {
  get: function() {
    return this._worldMatrix;
  },
  set: function(worldMatrix) {
    this._worldMatrix.copy(worldMatrix);
  }
});

Object.defineProperty(EZ3.Entity.prototype, "normalMatrix", {
  get: function() {
    return this._normalMatrix;
  },
  set: function(normalMatrix) {
    this._normalMatrix.copy(normalMatrix);
  }
});
