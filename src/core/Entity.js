/**
 * @class Entity
 */

EZ3.Entity = function() {
  this._cache = {};

  this.parent = null;
  this.children = [];
  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();
  this.scale = new EZ3.Vector3(1, 1, 1);
  this.position = new EZ3.Vector3(0, 0, 0);
  this.rotation = new EZ3.Quaternion(0, 0, 0, 1);

  // Quitar caching inicial
  this._cache.world = this.world.clone();
  this._cache.model = this.model.clone();
  this._cache.scale = this.scale.clone();
  this._cache.position = this.position.clone();
  this._cache.rotation = this.rotation.clone();
  this._cache.parentWorld = this.model.clone();
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

EZ3.Entity.prototype.lookAt = function(target, up) {
  // Poner parametros opcionales
  var build = false;

  if(target.testDiff(this._cache.target)) {
    this._cache.target = target.clone();
    build = true;
  }

  if(up.testDiff(this._cache.up)) {
    this._cache.up = up.clone();
    build = true;
  }

  if(this.position.testDiff(this._cache.position))
    build = true;

  if(build)
    this.rotation.fromRotationMatrix(new EZ3.Matrix4().lookAt(this.position, target, up));
};

EZ3.Entity.prototype.updateWorld = function() {
  var positionDirty;
  var rotationDirty;
  var scaleDirty;
  var modelDirty;
  var parentWorldDirty;

  if (this._cache.position.testDiff(this.position)) {
    this._cache.position = this.position.clone();
    positionDirty = true;
  }

  if (this._cache.rotation.testDiff(this.rotation)) {
    this._cache.rotation = this.rotation.clone();
    rotationDirty = true;
  }

  if (this._cache.scale.testDiff(this.scale)) {
    this._cache.scale = this.scale.clone();
    scaleDirty = true;
  }

  if (positionDirty || rotationDirty || scaleDirty)
    this.model.compose(this.position, this.rotation, this.scale);

  if (!this.parent) {
    modelDirty = this._cache.model.testDiff(this.model);

    if (modelDirty) {
      this.world = this.model.clone();
      this._cache.model = this.model.clone();
    }
  } else {
    modelDirty = this._cache.model.testDiff(this.model);
    parentWorldDirty = this._cache.parentWorld.testDiff(this.parent.world);

    if (parentWorldDirty || modelDirty) {

      if (modelDirty)
        this._cache.model = this.model.clone();

      if (parentWorldDirty)
        this._cache.parentWorld = this.parent.world.clone();

      this.world.mul(this.parent.world, this.model);
    }
  }
};

EZ3.Entity.prototype.worldPosition = function(optionalTarget) {
  var rotation = new EZ3.Quaternion();
  var position = optionalTarget || new EZ3.Vector3();
  var scale = new EZ3.Vector3();

  this.world.decompose(position, rotation, scale);

  return position;
};

EZ3.Entity.prototype.worldRotation = function(optionalTarget) {
  var rotation = optionalTarget || new EZ3.Quaternion();
  var position = new EZ3.Vector3();
  var scale = new EZ3.Vector3();

  this.world.decompose(position, rotation, scale);

  return rotation;
};

EZ3.Entity.prototype.worldScale = function(optionalTarget) {
  var rotation = new EZ3.Quaternion();
  var position = new EZ3.Vector3();
  var scale = optionalTarget || new EZ3.Vector3();

  this.world.decompose(position, rotation, scale);

  return scale;
};

EZ3.Entity.prototype.worldDirection = function(optionalTarget) {
  var rotation = new EZ3.Quaternion();
  var direction = optionalTarget || new EZ3.Vector3(0, 0, 1);

  this.worldRotation(rotation);

  return direction.mulQuaternion(rotation);
};
