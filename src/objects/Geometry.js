/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this._uvs = [];
  this._uvs.offset = 0;
  this._uvs.stride = 0;
  this._uvs.dirty = false;
  this._uvs.dynamic = false;
  this._uvs.normalized = false;

  this._colors = [];
  this._colors.offset = 0;
  this._colors.stride = 0;
  this._colors.dirty = false;
  this._colors.dynamic = false;
  this._colors.normalized = false;

  this._indices = [];
  this._indices.offset = 0;
  this._indices.stride = 0;
  this._indices.dirty = false;
  this._indices.dynamic = false;
  this._indices.normalized = false;

  this._normals = [];
  this._normals.offset = 0;
  this._normals.stride = 0;
  this._normals.dirty = false;
  this._normals.dynamic = false;
  this._normals.normalized = false;

  this._vertices = [];
  this._vertices.offset = 0;
  this._vertices.stride = 0;
  this._vertices.dirty = false;
  this._vertices.dynamic = false;
  this._vertices.normalized = false;

  this._tangents = [];
  this._tangents.offset = 0;
  this._tangents.stride = 0;
  this._tangents.dirty = false;
  this._tangents.dynamic = false;
  this._tangents.normalized = false;

  this._bitangents = [];
  this._bitangents.offset = 0;
  this._bitangents.stride = 0;
  this._bitangents.dirty = false;
  this._bitangents.dynamic = false;
  this._bitangents.normalized = false;
};

EZ3.Geometry.prototype.calculateNormals = function(indices, vertices) {
  var normals;
  var x, y, z, k;
  var tempNormals, tempAppearances;
  var normal, point0, point1, point2, vector0, vector1;

  normals = [];

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

    vector0 = point1.sub(point0);
    vector1 = point2.sub(point0);

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

  return normals;
};

EZ3.Geometry.prototype.calculateTangentsAndBitangents = function(indices, uvs, normals, vertices) {
  var tempT, tempB;
  var vector0, vector1;
  var tangents, bitangents;
  var point0, point1, point2;
  var textVector0, textVector1;
  var textPoint0, textPoint1, textPoint2;
  var normal, normalT, tangent, bitangent;
  var vx, vy, vz, tx, ty, tz, k, r, handedness;

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

  for(k = 0; k < vertices.length; ++k) {
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

  return {
    tangents: tangents,
    bitangents: bitangents
  };
};

Object.defineProperty(EZ3.Geometry.prototype, "uvs", {
  get: function() {
    return this._uvs;
  },
  set: function(uvs) {
    this._uvs = uvs;
    this._uvs.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "colors", {
  get: function() {
    return this._colors;
  },
  set: function(colors) {
    this._colors = colors;
    this._colors.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "indices", {
  get: function() {
    return this._indices;
  },
  set: function(indices) {
    this._indices = indices;
    this._indices.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "normals", {
  get: function() {
    return this._normals;
  },
  set: function(normals) {
    this._normals = normals;
    this._normals.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "vertices", {
  get: function() {
    return this._vertices;
  },
  set: function(vertices) {
    this._vertices = vertices;
    this._vertices.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "tangents", {
  get: function() {
    return this._tangents;
  },
  set: function(tangents) {
    this._tangents = tangents;
    this._tangents.dirty = true;
  }
});

Object.defineProperty(EZ3.Geometry.prototype, "bitangents", {
  get: function() {
    return this._bitangents;
  },
  set: function(bitangents) {
    this._bitangents = bitangents;
    this._bitangents.dirty = true;
  }
});
