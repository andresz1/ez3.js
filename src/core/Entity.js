/**
 * @class Entity
 */

EZ3.Entity = function() {
  this._dirty = true;

  this._parent = null;
  this._children = [];

  this._scale = vec3.create();
  this._scale.dirty = true;
  vec3.set(this._scale, 1, 1 ,1);

  this._position = vec3.create();
  this._position.dirty = true;
  vec3.set(this._position, 0, 0 ,0);

  this._rotation = quat.create();
  this._rotation.dirty = true;
  quat.set(this._rotation, 0, 0 ,0 ,0);

  this._modelMatrix = mat4.create();
  mat4.identity(this._modelMatrix);

  this._worldMatrix = mat4.create();
  mat4.identity(this._worldMatrix);

  this._normalMatrix = mat3.create();
  mat3.identity(this._normalMatrix);
};

Object.defineProperty(EZ3.Entity.prototype, "children", {
  get: function() {
    return this._children;
  },
  set: function(children) {
    this._children = children;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "scale", {
  get: function() {
    return this._scale;
  },
  set: function(scale) {
    this._scale = bitangents;
    this._scale.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "position", {
  get: function() {
    return this._scale;
  },
  set: function(scale) {
    this._scale = bitangents;
    this._scale.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "rotation", {
  get: function() {
    return this._rotation;
  },
  set: function(scale) {
    this._rotation = rotation;
    this._rotation.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "modelMatrix", {
  get: function() {
    return this._modelMatrix;
  },
  set: function(modelMatrix) {
    this._modelMatrix = modelMatrix;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "worldMatrix", {
  get: function() {
    return this._worldMatrix;
  },
  set: function(worldMatrix) {
    this._worldMatrix = worldMatrix;
  }
});

Object.defineProperty(EZ3.Entity.prototype, "normalMatrix", {
  get: function() {
    return this._normalMatrix;
  },
  set: function(normalMatrix) {
    this._normalMatrix = normalMatrix;
  }
});

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
  this._dirty = this._dirty || this._scale.dirty || this._position.dirty || this._rotation.dirty || parentIsDirty;

  if (this._dirty) {

    if(this._scale.dirty || this._position.dirty || this._rotation.dirty) {

      if (this.scale.dirty)
        this._scale.dirty = false;

      if (this.rotation.dirty)
        this._rotation.dirty = false;

      if (this.position.dirty)
        this._position.dirty = false;

      mat4.fromRotationTranslation(this._modelMatrix, this._rotation, this._position);
      mat4.scale(this._modelMatrix, this._modelMatrix, this._scale);
    }

    if (!parentWorldMatrix)
      mat4.copy(this._worldMatrix, this._modelMatrix);
    else
      mat4.multiply(this._worldMatrix, parentWorldMatrix, this._modelMatrix);

    mat3.normalFromMat4(this._normalMatrix, this._worldMatrix);

    for (var k = this._children.length - 1; k >= 0; --k)
      this._children[k].update(this._dirty, this._worldMatrix);
  }
};
