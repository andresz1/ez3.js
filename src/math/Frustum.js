/**
 * @class EZ3.Frustum
 * @constructor
 */
EZ3.Frustum = function(p0, p1, p2, p3, p4, p5) {
  this.planes = [
    (p0 !== undefined) ? p0 : new EZ3.Plane(),
    (p1 !== undefined) ? p1 : new EZ3.Plane(),
    (p2 !== undefined) ? p2 : new EZ3.Plane(),
    (p3 !== undefined) ? p3 : new EZ3.Plane(),
    (p4 !== undefined) ? p4 : new EZ3.Plane(),
    (p5 !== undefined) ? p5 : new EZ3.Plane()
  ];
};

EZ3.Frustum.prototype.constructor = EZ3.Frustum;

EZ3.Frustum.prototype.set = function(p0, p1, p2, p3, p4, p5) {
  var planes = this.planes;

  planes[0].copy(p0);
  planes[1].copy(p1);
  planes[2].copy(p2);
  planes[3].copy(p3);
  planes[4].copy(p4);
  planes[5].copy(p5);

  return this;
};

EZ3.Frustum.prototype.copy = function(frustum) {
  var planes = this.planes;

  for (var i = 0; i < 6; i++)
    planes[i].copy(frustum.planes[i]);

  return this;
};

EZ3.Frustum.prototype.setFromMatrix4 = function(m) {
  var planes = this.planes;
  var me = m.elements;
  var me0 = me[0];
  var me1 = me[1];
  var me2 = me[2];
  var me3 = me[3];
  var me4 = me[4];
  var me5 = me[5];
  var me6 = me[6];
  var me7 = me[7];
  var me8 = me[8];
  var me9 = me[9];
  var me10 = me[10];
  var me11 = me[11];
  var me12 = me[12];
  var me13 = me[13];
  var me14 = me[14];
  var me15 = me[15];

  planes[0].set(new EZ3.Vector3(me3 - me0, me7 - me4, me11 - me8), me15 - me12).normalize();
  planes[1].set(new EZ3.Vector3(me3 + me0, me7 + me4, me11 + me8), me15 + me12).normalize();
  planes[2].set(new EZ3.Vector3(me3 + me1, me7 + me5, me11 + me9), me15 + me13).normalize();
  planes[3].set(new EZ3.Vector3(me3 - me1, me7 - me5, me11 - me9), me15 - me13).normalize();
  planes[4].set(new EZ3.Vector3(me3 - me2, me7 - me6, me11 - me10), me15 - me14).normalize();
  planes[5].set(new EZ3.Vector3(me3 + me2, me7 + me6, me11 + me10), me15 + me14).normalize();

  return this;
};


EZ3.Frustum.prototype.intersectsMesh = function(mesh) {
  var geometry = mesh.geometry;
  var sphere = new EZ3.Sphere();

  geometry.updateBoundingVolumes();

  sphere.copy(geometry.boundingSphere);
  sphere.applyMatrix4(mesh.world);

  return this.intersectsSphere(sphere);
};

EZ3.Frustum.prototype.intersectsSphere = function(sphere) {
  var planes = this.planes;
  var center = sphere.center;
  var negRadius = -sphere.radius;

  for (var i = 0; i < 6; i++)
    if (planes[i].distanceToPoint(center) < negRadius)
      return false;

  return true;
};

EZ3.Frustum.prototype.intersectsBox = function(box) {
  var p1 = new EZ3.Vector3();
  var p2 = new EZ3.Vector3();
  var planes = this.planes;

  for (var i = 0; i < 6; i++) {
    var plane = planes[i];

    p1.x = (plane.normal.x > 0) ? box.min.x : box.max.x;
    p2.x = (plane.normal.x > 0) ? box.max.x : box.min.x;
    p1.y = (plane.normal.y > 0) ? box.min.y : box.max.y;
    p2.y = (plane.normal.y > 0) ? box.max.y : box.min.y;
    p1.z = (plane.normal.z > 0) ? box.min.z : box.max.z;
    p2.z = (plane.normal.z > 0) ? box.max.z : box.min.z;

    if (plane.distanceToPoint(p1) < 0 && plane.distanceToPoint(p2) < 0)
      return false;
  }

  return true;
};
