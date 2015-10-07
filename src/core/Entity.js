/**
 * @class Entity
 */

EZ3.Entity = function() {
  this._parent = null;
  this._children = [];

  this._modelMatrix = new EZ3.Matrix4();
  this._worldMatrix = new EZ3.Matrix4();
  this._normalMatrix = new EZ3.Matrix3();

  this._scale = new EZ3.Vector3(1, 1, 1);
  this._position = new EZ3.Vector3(0, 0, 0);
  this._rotation = new EZ3.Quaternion(1, 0, 0, 0);

  this._dirty = true;
};

EZ3.Entity.prototype.add = function(child) {
  if (child instanceof EZ3.Entity) {

    if (child.parent)
      child.parent.remove(child);

    this.dirty = true;
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

EZ3.Entity.prototype.update = function() {
  var scale = this.scale;
  var position = this.position;
  var rotation = this.rotation;
  var modelMatrix = this.modelMatrix;

  if (scale.dirty || position.dirty || rotation.dirty) {

    if (scale.dirty)
      scale.dirty = false;

    if (position.dirty)
      position.dirty = false;

    if (rotation.dirty)
      rotation.dirty = false;

    this.modelMatrix.fromRotationTranslation(modelMatrix, rotation, position);
    this.modelMatrix.scale(this.modelMatrix, scale);
  }

  if (!this.parent)
    this.worldMatrix.copy(this.modelMatrix);
  else
    this.worldMatrix.mul(this.modelMatrix, this.parent.worldMatrix);

  this.normalMatrix.normalFromMat4(this.worldMatrix);
};

Object.defineProperty(EZ3.Entity.prototype, 'dirty', {
  get: function() {
    var dirty = this._dirty;
    var scaleDirty = this.scale.dirty;
    var positionDirty = this.position.dirty;
    var rotationDirty = this.rotation.dirty;

    return dirty || scaleDirty || positionDirty || rotationDirty;
  },
  set: function(dirty) {
    this._dirty = dirty;
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'parent', {
  get: function() {
    return this._parent;
  },
  set: function(parent) {
    this._parent = parent;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'children', {
  get: function() {
    return this._children;
  },
  set: function(children) {
    this._children = children;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'scale', {
  get: function() {
    return this._scale;
  },
  set: function(scale) {
    this._scale.copy(scale);
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'position', {
  get: function() {
    return this._position;
  },
  set: function(position) {
    this._position.copy(position);
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'rotation', {
  get: function() {
    return this._rotation;
  },
  set: function(rotation) {
    this._rotation.copy(rotation);
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'modelMatrix', {
  get: function() {
    return this._modelMatrix;
  },
  set: function(modelMatrix) {
    this._modelMatrix.copy(modelMatrix);
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'worldMatrix', {
  get: function() {
    return this._worldMatrix;
  },
  set: function(worldMatrix) {
    this._worldMatrix.copy(worldMatrix);
  }
});

Object.defineProperty(EZ3.Entity.prototype, 'normalMatrix', {
  get: function() {
    return this._normalMatrix;
  },
  set: function(normalMatrix) {
    this._normalMatrix.copy(normalMatrix);
  }
});
