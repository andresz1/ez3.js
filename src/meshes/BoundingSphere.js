/**
 * @class EZ3.BoundingSphere
 * @extends EZ3.Mesh
 * @constructor
 * @param {EZ3.Geometry} [geometry]
 * @param {EZ3.Vector2} [resolution]
 * @param {EZ3.Material} [material]
 */
EZ3.BoundingSphere = function(geometry, resolution, material) {
  var sphere;

  if (geometry instanceof EZ3.PrimitiveGeometry)
    geometry.updateData();

  geometry.updateBoundingVolumes();

  sphere = geometry.boundingSphere;
  geometry = new EZ3.SphereGeometry(resolution);

  if (!material) {
    EZ3.Mesh.call(this, geometry);
    this.material.emissive.set(1, 1, 1);
    this.material.fill = EZ3.Material.WIREFRAME;
  } else
    EZ3.Mesh.call(this, geometry, material);

  this.position.copy(sphere.center);
  this.scale.set(sphere.radius);
};

EZ3.BoundingSphere.prototype = Object.create(EZ3.Mesh.prototype);
EZ3.BoundingSphere.prototype.constructor = EZ3.Mesh;
