/**
 * @class EZ3.CubeCamera
 * @extends EZ3.Entity
 * @constructor
 * @param {Number} [near]
 * @param {Number} [far]
 */
EZ3.CubeCamera = function(near, far) {
  var i;

  EZ3.Entity.call(this);

  /**
   * @property {Number} near
   * @default 0.1
   */
  this.near = (near !== undefined) ? near : 0.1;

  /**
   * @property {Number} far
   * @default 2000
   */
  this.far = (far !== undefined) ? far : 2000;

  /**
   * @property {EZ3.Matrix4[]} views
   */
  this._views = [];

  /**
   * @property {EZ3.Matrix4} projection
   */
  this.projection = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4[]} viewProjections
   */
  this._viewProjections = [];

  /**
   * @property {EZ3.Frustum[]} frustums
   */
  this._frustums = [];

  for (i = 0; i < 6; i++) {
    this._views.push(new EZ3.Matrix4());
    this._viewProjections.push(new EZ3.Matrix4());
    this._frustums.push(new EZ3.Frustum());
  }
};

EZ3.CubeCamera.prototype = Object.create(EZ3.Entity.prototype);
EZ3.CubeCamera.prototype.constructor = EZ3.CubeCamera;

/**
 * @method EZ3.CubeCamera#_updateProjection
 * @private
 */
EZ3.CubeCamera.prototype._updateProjection = function() {
  var changed = false;

  if (this._cache.near !== this.near) {
    this._cache.near = this.near;
    changed = true;
  }

  if (this._cache.far !== this.far) {
    this._cache.far = this.far;
    changed = true;
  }

  if (changed)
    this.projection.perspective(90, 1, this.near, this.far);

  return changed;
};

/**
 * @method EZ3.CubeCamera#_updateViews
 * @private
 */
EZ3.CubeCamera.prototype._updateViews = function() {
  var worldPosition = this.getWorldPosition();
  var target = new EZ3.Vector3();
  var up = new EZ3.Vector3();
  var i;

  if (worldPosition.isEqual(this._cache.worldPosition))
    return false;

  for (i = 0; i < 6; i++) {
    switch (i) {
      case EZ3.Cubemap.POSITIVE_X:
        target.set(1, 0, 0);
        up.set(0, -1, 0);
        break;
      case EZ3.Cubemap.NEGATIVE_X:
        target.set(-1, 0, 0);
        up.set(0, -1, 0);
        break;
      case EZ3.Cubemap.POSITIVE_Y:
        target.set(0, 1, 0);
        up.set(0, 0, 1);
        break;
      case EZ3.Cubemap.NEGATIVE_Y:
        target.set(0, -1, 0);
        up.set(0, 0, -1);
        break;
      case EZ3.Cubemap.POSITIVE_Z:
        target.set(0, 0, 1);
        up.set(0, -1, 0);
        break;
      case EZ3.Cubemap.NEGATIVE_Z:
        target.set(0, 0, -1);
        up.set(0, -1, 0);
        break;
    }

    this._views[i].lookAt(worldPosition, target.clone().add(worldPosition), up);
  }

  this._cache.worldPosition = worldPosition.clone();

  return true;
};

/**
 * @method EZ3.CubeCamera#updateFrustums
 */
EZ3.CubeCamera.prototype.updateFrustums = function() {
  var viewProjection;
  var i;

  if (this._updateViews() || this._updateProjection()) {
    for (i = 0; i < 6; i++) {
      viewProjection = this._viewProjections[i];

      viewProjection.mul(this.projection, this._views[i]);
      this._frustums[i].setFromMatrix4(viewProjection);
    }
  }
};

/**
 * @method EZ3.CubeCamera#getView
 * @param {Number} face
 * @return {EZ3.Matrix4}
 */
EZ3.CubeCamera.prototype.getView = function(face) {
  return this._views[face];
};

/**
 * @method EZ3.CubeCamera#getViewProjection
 * @param {Number} face
 * @return {EZ3.Matrix4}
 */
EZ3.CubeCamera.prototype.getViewProjection = function(face) {
  return this._viewProjections[face];
};


/**
 * @method EZ3.CubeCamera#getFrustum
 * @param {Number} face
 * @return {EZ3.Frustum}
 */
EZ3.CubeCamera.prototype.getFrustum = function(face) {
  return this._frustums[face];
};
