/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.uvs = new EZ3.BufferAttributes({});
  this.colors = new EZ3.BufferAttributes({});
  this.indices = new EZ3.BufferAttributes({});
  this.normals = new EZ3.BufferAttributes({});
  this.vertices = new EZ3.BufferAttributes({});
  this.tangents = new EZ3.BufferAttributes({});
  this.bitangents = new EZ3.BufferAttributes({});
};

EZ3.Geometry.prototype.calculateLinearIndices = function() {
  var linearIndices, triangularIndices;
  var k;

  linearIndices = [];
  triangularIndices = this.indices.data;

  for (k = 0; k < triangularIndices.length; k += 3) {
    linearIndices.push(triangularIndices[k + 0]);
    linearIndices.push(triangularIndices[k + 1]);
    linearIndices.push(triangularIndices[k + 0]);
    linearIndices.push(triangularIndices[k + 2]);
    linearIndices.push(triangularIndices[k + 1]);
    linearIndices.push(triangularIndices[k + 2]);
  }

  this.indices.data = linearIndices;
};

EZ3.Geometry.prototype.calculateTriangularIndices = function() {
  var indices, triangularIndices;

  indices = this.indices.data;
  triangularIndices = [];

  for (k = 0; k < linearIndices.length; k += 6) {
    triangularIndices.push(indices[k + 0]);
    triangularIndices.push(indices[k + 1]);
    triangularIndices.push(indices[k + 3]);
  }

  this.indices.data = triangularIndices;
};

EZ3.Geometry.prototype.mergeVertices = function() {
  var key;
  var presicion;
  var vertex, uv;
  var uniqueVerticesCounter;
  var indices, uvs, vertices;
  var verticesMap, appearanceMap;
  var uniqueVertices, uniqueIndices, uniqueUvs, uniqueNormals, uniqueTag;
  var k, n;

  uvs = this.uvs.data;
  indices = this.indices.data;
  vertices = this.vertices.data;

  verticesMap = {};
  appearanceMap = {};

  uniqueUvs = [];
  uniqueTag = [];
  uniqueIndices = [];
  uniqueVertices = [];
  uniqueVerticesCounter = 0;

  var faceIndices;
  var indicesToRemove = [];

  uv = new EZ3.Vector2();
  vertex = new EZ3.Vector3();

  precision = Math.pow(10, 4);

  for(k = 0; k < indices.length; k++) {
    vertex.x = vertices[3 * indices[k] + 0];
    vertex.y = vertices[3 * indices[k] + 1];
    vertex.z = vertices[3 * indices[k] + 2];

    key = Math.round(vertex.x * precision) +
      '_' +
      Math.round(vertex.y * precision) +
      '_' +
      Math.round(vertex.z * precision);

      if(verticesMap[key] === undefined) {
        verticesMap[key] = k;
        appearanceMap[verticesMap[key]] = uniqueVerticesCounter++;

        uv.x = uvs[2 * indices[k] + 0];
        uv.y = uvs[2 * indices[k] + 1];

        uniqueUvs.push(uv.x, uv.y);
        uniqueVertices.push(vertex.x, vertex.y, vertex.z);
      }

      uniqueIndices.push(appearanceMap[verticesMap[key]]);
  }

  this.uvs.data = uniqueUvs;
  this.indices.data = uniqueIndices;
  this.vertices.data = uniqueVertices;
};

EZ3.Geometry.prototype.calculateNormals = function() {
  var normals;
  var x, y, z, k;
  var indices, vertices;
  var tempNormals, tempAppearances;
  var normal, point0, point1, point2, vector0, vector1;

  indices = this.indices.data;
  vertices = this.vertices.data;

  normals = [];
  tempNormals = [];
  tempAppearances = [];

  normal = new EZ3.Vector3();
  point0 = new EZ3.Vector3();
  point1 = new EZ3.Vector3();
  point2 = new EZ3.Vector3();
  vector0 = new EZ3.Vector3();
  vector1 = new EZ3.Vector3();

  for (k = 0; k < vertices.length / 3; ++k) {
    tempNormals.push(0);
    tempNormals.push(0);
    tempNormals.push(0);
    tempAppearances.push(0);
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

    tempNormals[x + 0] += normal.x;
    tempNormals[x + 1] += normal.y;
    tempNormals[x + 2] += normal.z;

    tempNormals[y + 0] += normal.x;
    tempNormals[y + 1] += normal.y;
    tempNormals[y + 2] += normal.z;

    tempNormals[z + 0] += normal.x;
    tempNormals[z + 1] += normal.y;
    tempNormals[z + 2] += normal.z;

    ++tempAppearances[x / 3];
    ++tempAppearances[y / 3];
    ++tempAppearances[z / 3];
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    normals.push(tempNormals[x] / tempAppearances[k]);
    normals.push(tempNormals[y] / tempAppearances[k]);
    normals.push(tempNormals[z] / tempAppearances[k]);
  }

  tempNormals = [];
  tempAppearances = [];

  this.normals.data = normals;
};

EZ3.Geometry.prototype.calculateTangentsAndBitangents = function() {
  var tempT, tempB;
  var vector0, vector1;
  var tangents, bitangents;
  var point0, point1, point2;
  var textVector0, textVector1;
  var indices, uvs, normals, vertices;
  var textPoint0, textPoint1, textPoint2;
  var normal, normalT, tangent, bitangent;
  var vx, vy, vz, tx, ty, tz, k, r, handedness;

  uvs = this.uvs.data;
  indices = this.indices.data;
  normals = this.normals.data;
  vertices = this.vertices.data;

  point0 = new EZ3.Vector3();
  point1 = new EZ3.Vector3();
  point2 = new EZ3.Vector3();

  vector0 = new EZ3.Vector3();
  vector1 = new EZ3.Vector3();

  normal = new EZ3.Vector3();
  normalT = new EZ3.Vector3();
  tangent = new EZ3.Vector3();
  bitangent = new EZ3.Vector3();

  textPoint0 = new EZ3.Vector2();
  textPoint1 = new EZ3.Vector2();
  textPoint2 = new EZ3.Vector2();

  textVector0 = new EZ3.Vector2();
  textVector1 = new EZ3.Vector2();

  tempT = [];
  tempB = [];
  tangents = [];
  bitangents = [];

  for (k = 0; k < vertices.length; ++k) {
    tempT.push(0);
    tempB.push(0);
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

    tempT[vx + 0] += tangent.x;
    tempT[vy + 0] += tangent.y;
    tempT[vz + 0] += tangent.z;

    tempT[vx + 1] += tangent.x;
    tempT[vy + 1] += tangent.y;
    tempT[vz + 1] += tangent.z;

    tempT[vx + 2] += tangent.x;
    tempT[vy + 2] += tangent.y;
    tempT[vz + 2] += tangent.z;

    tempB[vx + 0] += bitangent.x;
    tempB[vy + 0] += bitangent.y;
    tempB[vz + 0] += bitangent.z;

    tempB[vx + 1] += bitangent.x;
    tempB[vy + 1] += bitangent.y;
    tempB[vz + 1] += bitangent.z;

    tempB[vx + 2] += bitangent.x;
    tempB[vy + 2] += bitangent.y;
    tempB[vz + 2] += bitangent.z;
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    tangent.set(tempT[x], tempT[y], tempT[z]);
    bitangent.set(tempB[x], tempB[y], tempB[z]);
    normal.set(normals[x], normals[y], normals[z]);

    normalT.copy(normal);
    tangent.normalize(tangent.subEqual(normalT.scaleEqual(normalT.dot(tangent))));

    normalT.copy(normal);
    handedness = (bitangent.dot(normalT.cross(tangent))) < 0 ? -1 : 1;

    tangents.push(tangent.x);
    tangents.push(tangent.y);
    tangents.push(tangent.z);
    tangents.push(handedness);

    bitangents.push(bitangent.x);
    bitangents.push(bitangent.y);
    bitangents.push(bitangent.z);
  }

  tempB = [];
  tempT = [];

  this.tangents.data = tangents;
  this.bitangents.data = bitangents;
};
