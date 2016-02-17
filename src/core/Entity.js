/**
 * @class EZ3.Entity
 * @constructor
 */
EZ3.Entity = function() {
  var that = this;

  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};

  /**
   * @property {EZ3.Entity} parent
   */
  this.parent = null;

  /**
   * @property {EZ3.Entity[]} children
   */
  this.children = [];

  /**
   * @property {EZ3.Matrix4} model
   */
  this.model = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4} world
   */
  this.world = new EZ3.Matrix4();

  /**
   * @property {EZ3.Vector3} scale
   */
  this.scale = new EZ3.Vector3(1, 1, 1);

  /**
   * @property {EZ3.Euler} rotation
   */
  this.rotation = new EZ3.Euler();

  /**
   * @property {EZ3.Vector3} position
   */
  this.position = new EZ3.Vector3();

  /**
   * @property {EZ3.Vector3} pivot
   */
  this.pivot = new EZ3.Vector3();

  /**
   * @property {EZ3.Quaternion} quaternion
   */
  this.quaternion = new EZ3.Quaternion();

  this.rotation.onChange.add(function() {
    that.quaternion.setFromEuler(that.rotation);
  });

  this.quaternion.onChange.add(function() {
    that.rotation.setFromQuaternion(that.quaternion);
  });
};

/**
 * @method EZ3.Entity#add
 * @param {EZ3.Entity} child
 */
EZ3.Entity.prototype.add = function(child) {
  if (child.parent)
    child.parent.remove(child);

  child.parent = this;
  this.children.push(child);
};

/**
 * @method EZ3.Entity#remove
 * @param {EZ3.Entity} child
 */
EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if (~position)
    this.children.splice(position, 1);
};

/**
 * @method EZ3.Entity#lookAt
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.Entity.prototype.lookAt = function(target, up) {
  target = target || new EZ3.Vector3();
  up = up || new EZ3.Vector3(0, 1, 0);

  this.quaternion.setFromRotationMatrix(new EZ3.Matrix4().lookAt(this.position, target, up));
};

/**
 * @method EZ3.Entity#updateWorld
 */
EZ3.Entity.prototype.updateWorld = function() {
  var changed = false;

  if (this.position.isDiff(this._cache.position)) {
    this._cache.position = this.position.clone();
    changed = true;
  }

  if (this.quaternion.isDiff(this._cache.quaternion)) {
    this._cache.quaternion = this.quaternion.clone();
    changed = true;
  }

  if (this.scale.isDiff(this._cache.scale)) {
    this._cache.scale = this.scale.clone();
    changed = true;
  }

  if (this.pivot.isDiff(this._cache.pivot)) {
    this._cache.pivot = this.pivot.clone();
    changed = true;
  }

  if (changed)
    this.model.compose(this.pivot, this.position, this.quaternion, this.scale);

  if (!this.parent) {
    if (this.model.isDiff(this._cache.model)) {
      this.world = this.model.clone();
      this._cache.model = this.model.clone();
    }
  } else {
    changed = false;

    if (this.model.isDiff(this._cache.model)) {
      this._cache.model = this.model.clone();
      changed = true;
    }

    if (this.parent.world.isDiff(this._cache.parentWorld)) {
      this._cache.parentWorld = this.parent.world.clone();
      changed = true;
    }

    if (changed)
      this.world.mul(this.parent.world, this.model);
  }
};

/**
 * @method EZ3.Entity#traverse
 * @param {Function} callback
 */
EZ3.Entity.prototype.traverse = function(callback) {
  var entities = [];
  var entity;
  var children;
  var i;

  entities.push(this);

  while (entities.length) {
    entity = entities.pop();
    children = entity.children.slice();

    callback(entity);

    for (i = children.length - 1; i >= 0; i--)
      entities.push(children[i]);
  }
};

/**
 * @method EZ3.Entity#updateWorldTraverse
 */
EZ3.Entity.prototype.updateWorldTraverse = function() {
  this.traverse(function(entity) {
    entity.updateWorld();
  });
};

/**
 * @method EZ3.Entity#getWorldPosition
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldPosition = function() {
  return this.world.getPosition();
};

/**
 * @method EZ3.Entity#getWorldRotation
 * @return {EZ3.Quaternion}
 */
EZ3.Entity.prototype.getWorldRotation = function() {
  return this.world.getRotation();
};

/**
 * @method EZ3.Entity#getWorldScale
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldScale = function() {
  return this.world.getScale();
};

/**
 * @method EZ3.Entity#getWorldDirection
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldDirection = function() {
  return new EZ3.Vector3(0, 0, 1).mulQuaternion(this.getWorldRotation());
};

/**
 * @method EZ3.Entity#getBoundingBoxTraverse
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getBoundingBoxTraverse = function() {
  var box = new EZ3.Box();

  this.traverse(function(entity) {
    var geometry;

    if (entity instanceof EZ3.Mesh) {
      geometry = entity.geometry;

      geometry.updateBoundingVolumes();

      box.union(geometry.boundingBox);
    }
  });

  return box;
};

/**
 * @method EZ3.Entity#getBoundingSphereTraverse
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getBoundingSphereTraverse = function() {
  var box = new EZ3.Box();

  this.traverse(function(entity) {
    var geometry;

    if (entity instanceof EZ3.Mesh) {
      geometry = entity.geometry;

      geometry.updateBoundingVolumes();

      box.union(geometry.boundingBox);
    }
  });

  return new EZ3.Sphere(box.center(), box.size().length() * 0.5);
};
