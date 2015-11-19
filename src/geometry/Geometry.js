/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.buffers = new EZ3.ArrayBuffer();

  this.linearDataNeedGenerate = true;
  this.normalDataNeedGenerate = true;
};

EZ3.Geometry.prototype._setNormalData = function(normals) {
  var buffer = this.buffers.get('normal');

  if (!buffer) {
    buffer = new EZ3.VertexBuffer(normals, false);
    buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
    this.buffers.add('normal', buffer);
  } else {
    buffer.data = normals;
    buffer.needUpdate = true;
  }
};

EZ3.Geometry.prototype.generateLinearData = function() {
  var triangles = this.buffers.get('triangle');
  var dynamic;
  var need32Bits;
  var lines;
  var buffer;
  var i;

  if (!triangles)
    return;

  dynamic = triangles.dynamic;
  need32Bits = triangles.need32Bits;
  triangles = triangles.data;
  lines = [];

  for (i = 0; i < triangles.length; i += 3) {
    lines.push(triangles[i], triangles[i + 1], triangles[i]);
    lines.push(triangles[i + 2], triangles[i + 1], triangles[i + 2]);
  }

  buffer = this.buffers.get('line');

  if (!buffer)
    this.buffers.add('line', new EZ3.IndexBuffer(lines, dynamic, need32Bits));
  else {
    buffer.data = lines;
    buffer.needUpdate = true;
  }
};

EZ3.Geometry.prototype.generateNormalData = function() {
  var indices = this.buffers.get('triangle');
  var vertices = this.buffers.get('position');
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
    if (!weighted[i].testZero())
      weighted[i].normalize();

    normals.push(weighted[i].x, weighted[i].y, weighted[i].z);
  }

  this._setNormalData(normals);
};
