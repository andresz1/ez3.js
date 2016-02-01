/**
 * @class EZ3.Scene
 * @extends EZ3.Entity
 * @constructor
 */
EZ3.Scene = function() {
  EZ3.Entity.call(this);
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;
