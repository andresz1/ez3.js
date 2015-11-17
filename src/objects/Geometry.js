/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.buffers = new EZ3.ArrayBuffer();
};

EZ3.Geometry.prototype.processLinearIndices = function() {
  var lines = [];
  var triangles;
  var i;

  if (this.buffers.get('triangle')) {
    triangles = this.buffers.get('triangle').data;

    for (i = 0; i < triangles.length; i += 3) {
      lines.push(triangles[i]);
      lines.push(triangles[i + 1]);
      lines.push(triangles[i]);
      lines.push(triangles[i + 2]);
      lines.push(triangles[i + 1]);
      lines.push(triangles[i + 2]);
    }

    this.buffers.add('line', new EZ3.IndexBuffer(lines, false));
  }
};

EZ3.Geometry.prototype.processVertexNormals = function() {
  var indices = this.buffers.get('triangle').data;
  var vertices = this.buffers.get('position').data;
  var normals = [];
  var appearances = [];
  var normal = new EZ3.Vector3();
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var buffer;
  var x;
  var y;
  var z;
  var i;

  for (i = 0; i < vertices.length / 3; i++) {
    normals.push(0, 0, 0);
    appearances.push(0);
  }

  for (i = 0; i < indices.length; i += 3) {
    x = 3 * indices[i];
    y = 3 * indices[i + 1];
    z = 3 * indices[i + 2];

    point0.set(vertices[x], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    normal = vector1.cross(vector0);

    if (!normal.testZero())
      normal.normalize();

    normals[x] += normal.x;
    normals[x + 1] += normal.y;
    normals[x + 2] += normal.z;

    normals[y] += normal.x;
    normals[y + 1] += normal.y;
    normals[y + 2] += normal.z;

    normals[z] += normal.x;
    normals[z + 1] += normal.y;
    normals[z + 2] += normal.z;

    appearances[x / 3]++;
    appearances[y / 3]++;
    appearances[z / 3]++;
  }

  for (i = 0; i < vertices.length / 3; i++) {
    x = 3 * i;

    normals[x] /= appearances[i];
    normals[x + 1] /= appearances[i];
    normals[x + 2] /= appearances[i];
  }

  console.log(normals);

  buffer = new EZ3.VertexBuffer(normals, false);
  buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('normal', buffer);
};

EZ3.Geometry.prototype.processFaceNormals = function() {
  var indices = this.buffers.get('triangle').data;
  var vertices = this.buffers.get('position').data;
  var normals = [];
  var normal = new EZ3.Vector3();
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var buffer;
  var x;
  var y;
  var z;
  var i;

  for (i = 0; i < indices.length; i += 3) {
    x = 3 * indices[i];
    y = 3 * indices[i + 1];
    z = 3 * indices[i + 2];

    point0.set(vertices[x], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    normal = vector1.cross(vector0);

    if (!normal.testZero())
      normal.normalize();

    normals[x] = normal.x;
    normals[x + 1] = normal.y;
    normals[x + 2] = normal.z;

    normals[y] = normal.x;
    normals[y + 1] = normal.y;
    normals[y + 2] = normal.z;


    normals[z] = normal.x;
    normals[z + 1] = normal.y;
    normals[z + 2] = normal.z;
  }

  console.log(normals);

  buffer = new EZ3.VertexBuffer(normals, false);
  buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('normal', buffer);
};

EZ3.Geometry.prototype.processNormals = function() {

  this.processVertexNormals();
};
