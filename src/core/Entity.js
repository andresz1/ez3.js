/**
 * @class Entity
 */

EZ3.Entity = function() {
  var that = this;

  this._cache = {};

  this.parent = null;
  this.children = [];
  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();
  this.scale = new EZ3.Vector3(1, 1, 1);
  this.rotation = new EZ3.Euler();
  this.position = new EZ3.Vector3();
  this.quaternion = new EZ3.Quaternion();

  this.rotation.onChange.add(function() {
    that.quaternion.setFromEuler(that.rotation);
  });

  this.quaternion.onChange.add(function() {
    that.rotation.setFromQuaternion(that.quaternion);
  });
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

  if (target.isDiff(this._cache.target)) {
    this._cache.target = target.clone();
    build = true;
  }

  if (up.isDiff(this._cache.up)) {
    this._cache.up = up.clone();
    build = true;
  }

  if (this.position.isDiff(this._cache.position))
    build = true;

  if (build)
    this.quaternion.setFromRotationMatrix(new EZ3.Matrix4().lookAt(this.position, target, up));
};

EZ3.Entity.prototype.updateWorld = function() {
  var scaleDirty = false;
  var modelDirty = false;
  var positionDirty = false;
  var quaternionDirty = false;
  var parentWorldDirty = false;

  if (this.position.isDiff(this._cache.position)) {
    this._cache.position = this.position.clone();
    positionDirty = true;
  }

  if (this.quaternion.isDiff(this._cache.quaternion)) {
    this._cache.quaternion = this.quaternion.clone();
    quaternionDirty = true;
  }

  if (this.scale.isDiff(this._cache.scale)) {
    this._cache.scale = this.scale.clone();
    scaleDirty = true;
  }

  if (positionDirty || quaternionDirty || scaleDirty)
    this.model.compose(this.position, this.quaternion, this.scale);

  if (!this.parent) {
    modelDirty = this.model.isDiff(this._cache.model);

    if (modelDirty) {
      this.world = this.model.clone();
      this._cache.model = this.model.clone();
    }
  } else {
    modelDirty = this.model.isDiff(this._cache.model);
    parentWorldDirty = this.parent.world.isDiff(this._cache.parentWorld);

    if (parentWorldDirty || modelDirty) {

      if (modelDirty)
        this._cache.model = this.model.clone();

      if (parentWorldDirty)
        this._cache.parentWorld = this.parent.world.clone();

      this.world.mul(this.parent.world, this.model);
    }
  }
};

EZ3.Entity.prototype.traverse = function(callback) {
  var entities = [];
  var entity;
  var i;

  entities.push(this);

  while (entities.length) {
    entity = entities.pop();

    callback(entity);

    for (i = entity.children.length - 1; i >= 0; i--)
      entities.push(entity.children[i]);
  }
};

EZ3.Entity.prototype.updateWorldTraverse = function() {
  this.traverse(function(entity) {
    entity.updateWorld();
  });
};

EZ3.Entity.prototype.getWorldPosition = function() {
  return this.world.getPosition();
};

EZ3.Entity.prototype.getWorldRotation = function() {
  return this.world.getRotation();
};

EZ3.Entity.prototype.getWorldScale = function() {
  return this.world.getScale();
};

EZ3.Entity.prototype.getWorldDirection = function() {
  return new EZ3.Vector3(0, 0, 1).mulQuaternion(this.getWorldRotation());
};
