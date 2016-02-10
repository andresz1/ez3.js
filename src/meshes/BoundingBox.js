/**
 * @class EZ3.BoundingBox
 * @extends EZ3.Mesh
 * @constructor
 * @param {EZ3.Geometry} [geometry]
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Material} [material]
 */
EZ3.BoundingBox = function(geometry, resolution, material) {
  var box;

  if (geometry instanceof EZ3.PrimitiveGeometry)
    geometry.updateData();

  geometry.updateBoundingVolumes();

  box = geometry.boundingBox;
  geometry = new EZ3.BoxGeometry(resolution);

  if (!material) {
    EZ3.Mesh.call(this, geometry);
    this.material.emissive.set(1, 1, 1);
    this.material.fill = EZ3.Material.WIREFRAME;
  } else
    EZ3.Mesh.call(this, geometry, material);

    this.position.copy(new EZ3.Vector3().add(box.max, box.min).scale(0.5));
    this.scale.sub(box.max, box.min);
};

EZ3.BoundingBox.prototype = Object.create(EZ3.Mesh.prototype);
EZ3.BoundingBox.prototype.constructor = EZ3.Mesh;
