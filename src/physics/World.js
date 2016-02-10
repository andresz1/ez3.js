/**
 * @class EZ3.World
 * @constructor
 */
EZ3.World = function() {
  this._world = new OIMO.World(1 / 60, 2, 8);
  this._world.gravity = new OIMO.Vec3(0, -2.5, 0);
  this._meshes = [];
};

EZ3.World.prototype.add = function(mesh, type, move) {
  mesh.traverse(function(entity) {
    if (entity instanceof EZ3.Mesh) {

      entity.pivot.copy(entity.getBoundingBox().getCenter());
    }
  });

  var quaternion = mesh.quaternion.clone();

  mesh.quaternion.set(0, 0, 0, 1);
  mesh.updateWorldTraverse();

  var box = mesh.getBoundingBox().applyMatrix4(mesh.world);
  var center = box.getCenter();
  var delta = mesh.position.clone().sub(center);
  var size = new EZ3.Vector3();
  var rotation;

  if (type === EZ3.Body.SPHERE) {
    type = 'sphere';
    size.sub(box.max, box.min);
    size = [Math.max(size.x, size.y, size.z) * 0.5];
    rotation = [0, 0, 0];
  } else {
    type = 'box';
    size = size.sub(box.max, box.min).max(new EZ3.Vector3(1)).toArray();
    rotation = [EZ3.Math.toDegrees(0), EZ3.Math.toDegrees(0), EZ3.Math.toDegrees(0.3)];
  }

  //mesh.rotation.copy(q);

  console.log(center);
  console.log(size);
  console.log(rotation);

  mesh.quaternion.copy(quaternion);

  mesh.body = new EZ3.Body(this._world, type, center.toArray(), size, rotation, move);
  mesh.delta = delta;
  this._meshes.push(mesh);
};


EZ3.World.prototype.joint = function() {

};

EZ3.World.prototype.update = function() {
  var mesh;
  var i;

  this._world.step();

  for (i = 0; i < this._meshes.length; i++) {
    mesh = this._meshes[i];
    mesh.position.copy(mesh.body.position).add(mesh.delta);
    mesh.quaternion.copy(mesh.body.quaternion);
    mesh.quaternion.w = -mesh.quaternion.w;
  }
};

/**
 * @property {Boolean} gravity
 * @memberof EZ3.World
 * @private
 */
Object.defineProperty(EZ3.World.prototype, 'gravity', {
  get: function() {
    return this._world.gravity;
  },
  set: function(gravity) {
    this._world.gravity.copy(gravity);
  }
});
