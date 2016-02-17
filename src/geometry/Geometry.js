/**
 * @class EZ3.Geometry
 * @constructor
 */
EZ3.Geometry = function() {
  /**
   * @property {EZ3.ArrayBuffer} buffers
   */
  this.buffers = new EZ3.ArrayBuffer();

  /**
   * @property {EZ3.Sphere} boundingSphere
   */
  this.boundingSphere = null;

  /**
   * @property {EZ3.Box} boundingBox
   */
  this.boundingBox = null;
};

/**
 * @method EZ3.Geometry#computeBoundingVolumes
 */
EZ3.Geometry.prototype.computeBoundingVolumes = function() {
  var vertices = this.buffers.getPositions();
  var box;
  var v;
  var radius;

  if (!vertices)
    return;

  vertices = vertices.data;
  box = new EZ3.Box();
  v = new EZ3.Vector3();
  radius = 0;

  for (i = 0; i < vertices.length; i += 3) {
    v.set(vertices[i], vertices[i + 1], vertices[i + 2]);
    box.expand(v);
  }
  
  center = box.center();

  for (i = 0; i < vertices.length; i += 3) {
    v.set(vertices[i], vertices[i + 1], vertices[i + 2]);
    radius = Math.max(radius, center.distance(v));
  }

  this.boundingBox = box;
  this.boundingSphere = new EZ3.Sphere(center, radius);
};

/**
 * @method EZ3.Geometry#computeLines
 */
EZ3.Geometry.prototype.computeLines = function() {
  var triangles = this.buffers.getTriangles();
  var need32Bits;
  var lines;
  var i;

  if (!triangles)
    return;

  triangles = triangles.data;
  need32Bits = triangles.need32Bits;
  lines = [];

  for (i = 0; i < triangles.length; i += 3) {
    lines.push(triangles[i], triangles[i + 1], triangles[i]);
    lines.push(triangles[i + 2], triangles[i + 1], triangles[i + 2]);
  }

  this.buffers.setLines(lines, need32Bits);
};

/**
 * @method EZ3.Geometry#computeNormals
 */
EZ3.Geometry.prototype.computeNormals = function() {
  var indices = this.buffers.getTriangles();
  var vertices = this.buffers.getPositions();
  var normals;
  var weighted;
  var point0;
  var point1;
  var point2;
  var vector0;
  var vector1;
  var x;
  var y;
  var z;
  var i;

  if (!indices || !vertices)
    return;

  indices = indices.data;
  vertices = vertices.data;
  normals = [];
  weighted = [];
  point0 = new EZ3.Vector3();
  point1 = new EZ3.Vector3();
  point2 = new EZ3.Vector3();
  vector0 = new EZ3.Vector3();
  vector1 = new EZ3.Vector3();

  for (i = 0; i < vertices.length / 3; i++)
    weighted.push(new EZ3.Vector3());

  for (i = 0; i < indices.length; i += 3) {
    x = 3 * indices[i];
    y = 3 * indices[i + 1];
    z = 3 * indices[i + 2];

    point0.set(vertices[x], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    vector1.cross(vector0);
    weighted[indices[i]].add(vector1);
    weighted[indices[i + 1]].add(vector1);
    weighted[indices[i + 2]].add(vector1);
  }

  for (i = 0; i < weighted.length; i++) {
    weighted[i].normalize();

    normals.push(weighted[i].x, weighted[i].y, weighted[i].z);
  }

  this.buffers.setNormals(normals);
};

/**
 * @method EZ3.Geometry#updateBoundingVolumes
 */
EZ3.Geometry.prototype.updateBoundingVolumes = function() {
  if (!this.boundingSphere || !this.boundingBox)
    this.computeBoundingVolumes();
};

/**
 * @method EZ3.Geometry#updateLines
 */
EZ3.Geometry.prototype.updateLines = function() {
  if (!this.buffers.getLines())
    this.computeLines();
};

/**
 * @method EZ3.Geometry#updateNormals
 */
EZ3.Geometry.prototype.updateNormals = function() {
  if (!this.buffers.getNormals())
    this.computeNormals();
};
