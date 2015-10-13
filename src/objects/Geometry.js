/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.buffers = new EZ3.ArrayBuffer();
};

EZ3.Geometry.prototype.calculateLinearIndeces = function() {
  var lines = [];
  var triangles;
  var i;

  if (this.buffers.get('triangle') && !this.buffers.get('line')) {
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

EZ3.Geometry.prototype.calculateNormals = function() {
  var normals = [];
  var tmpNormals = [];
  var tmpAppearances = [];
  var normal = new EZ3.Vector3();
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var indices = this.buffers.get('triangle').data;
  var vertices = this.buffers.get('position').data;
  var buffer;
  var x;
  var y;
  var z;
  var k;

  for (k = 0; k < vertices.length / 3; ++k) {
    tmpNormals.push(0);
    tmpNormals.push(0);
    tmpNormals.push(0);
    tmpAppearances.push(0);
  }

  for (k = 0; k < indices.length; k += 3) {
    x = 3 * indices[k + 0];
    y = 3 * indices[k + 1];
    z = 3 * indices[k + 2];

    point0.set(vertices[x + 0], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y + 0], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z + 0], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    normal = vector0.cross(vector1);

    if (!normal.testZero())
      normal.normalize();

    tmpNormals[x + 0] += normal.x;
    tmpNormals[x + 1] += normal.y;
    tmpNormals[x + 2] += normal.z;

    tmpNormals[y + 0] += normal.x;
    tmpNormals[y + 1] += normal.y;
    tmpNormals[y + 2] += normal.z;

    tmpNormals[z + 0] += normal.x;
    tmpNormals[z + 1] += normal.y;
    tmpNormals[z + 2] += normal.z;

    ++tmpAppearances[x / 3];
    ++tmpAppearances[y / 3];
    ++tmpAppearances[z / 3];
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    normals.push(tmpNormals[x] / tmpAppearances[k]);
    normals.push(tmpNormals[y] / tmpAppearances[k]);
    normals.push(tmpNormals[z] / tmpAppearances[k]);
  }

  tmpNormals = [];
  tmpAppearances = [];

  buffer = new EZ3.VertexBuffer(normals, false);
  buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('normal', buffer);
};

EZ3.Geometry.prototype.calculateTangentsAndBitangents = function() {
  var tangents = [];
  var bitangents = [];
  var tmpTangents = [];
  var tmpBitangents = [];
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var normal = new EZ3.Vector3();
  var tangent = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var tmpNormal  = new EZ3.Vector3();
  var bitangent  = new EZ3.Vector3();
  var textPoint0 = new EZ3.Vector2();
  var textPoint1 = new EZ3.Vector2();
  var textPoint2 = new EZ3.Vector2();
  var textVector0 = new EZ3.Vector2();
  var textVector1 = new EZ3.Vector2();
  var uvs = this.uvs.data;
  var indices = this.indices.data;
  var normals = this.normals.data;
  var vertices = this.vertices.data;
  var handedness;
  var x;
  var y;
  var z;
  var vx;
  var vy;
  var vz;
  var tx;
  var ty;
  var tz;
  var r;
  var k;

  for (k = 0; k < vertices.length; ++k) {
    tmpTangents.push(0);
    tmpBitangents.push(0);
  }

  for (k = 0; k < indices.length; k += 3) {

    vx = 3 * indices[k + 0];
    vy = 3 * indices[k + 1];
    vz = 3 * indices[k + 2];

    tx = 2 * indices[k + 0];
    ty = 2 * indices[k + 1];
    tz = 2 * indices[k + 2];

    textPoint0.set(uvs[tx + 0], uvs[tx + 1]);
    textPoint1.set(uvs[ty + 0], uvs[ty + 1]);
    textPoint2.set(uvs[tz + 0], uvs[tz + 1]);

    point0.set(vertices[vx + 0], vertices[vx + 1], vertices[vx + 2]);
    point1.set(vertices[vy + 0], vertices[vy + 1], vertices[vy + 2]);
    point2.set(vertices[vz + 0], vertices[vz + 1], vertices[vz + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    textVector0.sub(textPoint1, textPoint0);
    textVector1.sub(textPoint2, textPoint0);

    r = 1.0 / (textVector0.x * textVector1.y - textVector1.x * textVector0.y);

    tangent.x = (textVector1.y * vector0.x - textVector0.y * vector1.x) * r;
    tangent.y = (textVector1.y * vector0.y - textVector0.y * vector1.y) * r;
    tangent.z = (textVector1.y * vector0.z - textVector0.y * vector1.z) * r;

    bitangent.x = (textVector0.x * vector1.x - textVector1.x * vector0.x) * r;
    bitangent.y = (textVector0.x * vector1.y - textVector1.x * vector0.y) * r;
    bitangent.z = (textVector0.x * vector1.z - textVector1.x * vector0.z) * r;

    tmpTangents[vx + 0] += tangent.x;
    tmpTangents[vy + 0] += tangent.y;
    tmpTangents[vz + 0] += tangent.z;

    tmpTangents[vx + 1] += tangent.x;
    tmpTangents[vy + 1] += tangent.y;
    tmpTangents[vz + 1] += tangent.z;

    tmpTangents[vx + 2] += tangent.x;
    tmpTangents[vy + 2] += tangent.y;
    tmpTangents[vz + 2] += tangent.z;

    tmpBitangents[vx + 0] += bitangent.x;
    tmpBitangents[vy + 0] += bitangent.y;
    tmpBitangents[vz + 0] += bitangent.z;

    tmpBitangents[vx + 1] += bitangent.x;
    tmpBitangents[vy + 1] += bitangent.y;
    tmpBitangents[vz + 1] += bitangent.z;

    tmpBitangents[vx + 2] += bitangent.x;
    tmpBitangents[vy + 2] += bitangent.y;
    tmpBitangents[vz + 2] += bitangent.z;
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    tangent.set(tmpTangents[x], tmpTangents[y], tmpTangents[z]);
    bitangent.set(tmpBitangents[x], tmpBitangents[y], tmpBitangents[z]);
    normal.set(normals[x], normals[y], normals[z]);

    tmpNormal.copy(normal);
    tmpNormal.scaleEqual(tmpNormal.dot(tangent));
    tangent.subEqual(tmpNormal);
    tangent.normalize();

    tmpNormal.copy(normal);
    handedness = (bitangent.dot(tmpNormal.cross(tangent))) < 0 ? -1 : 1;

    bitangents.push(bitangent.x, bitangent.y, bitangent.z);
    tangents.push(tangent.x, tangent.y, tangent.z, handedness);
  }

  tmpTangents = [];
  tmpBitangents = [];

  this.tangents.data = tangents;
  this.bitangents.data = bitangents;
};
