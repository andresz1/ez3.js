/**
 * @class EZ3.BoundingBox
 * @extends EZ3.Mesh
 * @constructor
 * @param {EZ3.Box} box
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Material} [material]
 */
EZ3.BoundingBox = function(box, resolution, material) {
  geometry = new EZ3.BoxGeometry(resolution);

  if (!material) {
    EZ3.Mesh.call(this, geometry);
    this.material.emissive.set(1, 1, 1);
    this.material.fill = EZ3.Material.WIREFRAME;
  } else
    EZ3.Mesh.call(this, geometry, material);

    this.position.copy(box.center());
    this.scale.copy(box.size());
};

EZ3.BoundingBox.prototype = Object.create(EZ3.Mesh.prototype);
EZ3.BoundingBox.prototype.constructor = EZ3.Mesh;
