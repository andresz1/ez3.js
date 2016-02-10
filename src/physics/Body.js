/**
 * @class EZ3.Body
 * @constructor
 */
EZ3.Body = function(world, type, position, size, rotation, move, x) {
  this._body = world.add({
    type: type,
    pos: position,
    size: size,
    rot: rotation,
    move: move
  });
};

/**
 * @property {Number} position
 * @memberof EZ3.Body
 */
Object.defineProperty(EZ3.Body.prototype, 'position', {
  get: function() {
    return this._body.getPosition();
  }
});

/**
 * @property {Number} quaternion
 * @memberof EZ3.Body
 */
Object.defineProperty(EZ3.Body.prototype, 'quaternion', {
  get: function() {
    return this._body.getQuaternion();
  }
});

/**
 * @property {Number} density
 * @memberof EZ3.Body
 */
Object.defineProperty(EZ3.Body.prototype, 'density', {
  get: function() {
    return this._body.shapes.density;
  },
  set: function(density) {
    this._body.shapes.density = density;
    this._body.setupMass(0x1, density > 0);
  }
});

/**
 * @property {Number} friction
 * @memberof EZ3.Body
 */
Object.defineProperty(EZ3.Body.prototype, 'friction', {
  get: function() {
    return this._body.shapes.friction;
  },
  set: function(friction) {
    this._body.shapes.friction = friction;
  }
});

/**
 * @property {Number} restitution
 * @memberof EZ3.Body
 */
Object.defineProperty(EZ3.Body.prototype, 'restitution', {
  get: function() {
    return this._body.shapes.restitution;
  },
  set: function(restitution) {
    this._body.shapes.restitution = restitution;
  }
});

EZ3.Body.BOX = 1;
EZ3.Body.SPHERE = 2;
EZ3.Body.CYLINDER = 3;
