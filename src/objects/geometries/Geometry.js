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

EZ3.Geometry.prototype.initArray = function(size, value) {
  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });
};

EZ3.Geometry.prototype.calculateNormals = function() {
  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  normal = vec3.create();
  point0 = vec3.create();
  point1 = vec3.create();
  point2 = vec3.create();
  vector0 = vec3.create();
  vector1 = vec3.create();

  var tempNormals = this.initArray(this.vertices.length, 0);
  var tempAppearances = this.initArray(this.vertices.length / 3, 0);

  for (k = 0; k < this.indices.length; k += 3) {

    x = 3 * this.indices[k + 0];
    y = 3 * this.indices[k + 1];
    z = 3 * this.indices[k + 2];

    vec3.set(point0, this.vertices[x + 0], this.vertices[x + 1], this.vertices[x + 2]);
    vec3.set(point1, this.vertices[y + 0], this.vertices[y + 1], this.vertices[y + 2]);
    vec3.set(point2, this.vertices[z + 0], this.vertices[z + 1], this.vertices[z + 2]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if (normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    tempNormals[x + 0] += normal[0];
    tempNormals[x + 1] += normal[1];
    tempNormals[x + 2] += normal[2];

    tempNormals[y + 0] += normal[0];
    tempNormals[y + 1] += normal[1];
    tempNormals[y + 2] += normal[2];

    tempNormals[z + 0] += normal[0];
    tempNormals[z + 1] += normal[1];
    tempNormals[z + 2] += normal[2];

    ++tempAppearances[x / 3];
    ++tempAppearances[y / 3];
    ++tempAppearances[z / 3];
  }

  for (k = 0; k < this.vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this.normals.push(tempNormals[x] / tempAppearances[k]);
    this.normals.push(tempNormals[y] / tempAppearances[k]);
    this.normals.push(tempNormals[z] / tempAppearances[k]);
  }

  tempNormals.splice(0, tempNormals.length);
  tempAppearances.splice(0, tempAppearances.length);
};

EZ3.Geometry.prototype.calculateTangents = function() {
  var x, y, z, k, r;

  var point0 = vec3.create();
  var point1 = vec3.create();
  var point2 = vec3.create();

  var vector0 = vec3.create();
  var vector1 = vec3.create();

  var normal = vec3.create();
  var tangent = vec4.create();
  var bitangent = vec3.create();

  var textPoint0 = vec2.create();
  var textPoint1 = vec2.create();
  var textPoint2 = vec2.create();

  var textVector0 = vec2.create();
  var textVector1 = vec2.create();

  var tempT = this.initArray(this.vertices.length, 0);
  var tempB = this.initArray(this.vertices.length, 0);

  for (k = 0; k < this.indices.length; k += 3) {
    x = this.indices[k + 0];
    y = this.indices[k + 1];
    z = this.indices[k + 2];

    vec3.set(point0, this.vertices[3 * x + 0], this.vertices[3 * x + 1], this.vertices[3 * x + 2]);
    vec3.set(point1, this.vertices[3 * y + 0], this.vertices[3 * y + 1], this.vertices[3 * y + 2]);
    vec3.set(point2, this.vertices[3 * z + 0], this.vertices[3 * z + 1], this.vertices[3 * z + 2]);

    vec2.set(textPoint0, this.uv[2 * x + 0], this.uv[2 * x + 1]);
    vec2.set(textPoint1, this.uv[2 * y + 0], this.uv[2 * y + 1]);
    vec2.set(textPoint2, this.uv[2 * z + 0], this.uv[2 * z + 1]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec2.sub(textVector0, textPoint1, textPoint0);
    vec2.sub(textVector1, textPoint2, textPoint0);

    r = 1.0 / (textVector0[0] * textVector1[1] - textVector1[0] * textVector0[1]);

    tangent[0] = (textVector1[1] * vector0[0] - textVector0[1] * vector1[0]) * r;
    tangent[1] = (textVector1[1] * vector0[1] - textVector0[1] * vector1[1]) * r;
    tangent[2] = (textVector1[1] * vector0[2] - textVector0[1] * vector1[2]) * r;

    bitangent[0] = (textVector0[0] * vector1[0] - textVector1[0] * vector0[0]) * r;
    bitangent[1] = (textVector0[0] * vector1[1] - textVector1[0] * vector0[1]) * r;
    bitangent[2] = (textVector0[0] * vector1[2] - textVector1[0] * vector0[2]) * r;

    tempT[3 * x + 0] += tangent[0];
    tempT[3 * y + 0] += tangent[1];
    tempT[3 * z + 0] += tangent[2];

    tempT[3 * x + 1] += tangent[0];
    tempT[3 * y + 1] += tangent[1];
    tempT[3 * z + 1] += tangent[2];

    tempT[3 * x + 2] += tangent[0];
    tempT[3 * y + 2] += tangent[1];
    tempT[3 * z + 2] += tangent[2];

    tempB[3 * x + 0] += bitangent[0];
    tempB[3 * y + 0] += bitangent[1];
    tempB[3 * z + 0] += bitangent[2];

    tempB[3 * x + 1] += bitangent[0];
    tempB[3 * y + 1] += bitangent[1];
    tempB[3 * z + 1] += bitangent[2];

    tempB[3 * x + 2] += bitangent[0];
    tempB[3 * y + 2] += bitangent[1];
    tempB[3 * z + 2] += bitangent[2];
  }

  for (k = 0; k < this._vertices.length / 3; ++k) {

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    vec3.set(tangent, tempT[x], tempT[y], tempT[z]);
    vec3.set(bitangent, tempB[x], tempB[y], tempB[z]);
    vec3.set(normal, this.normals[x], this.normals[y], this.normals[z]);
  }
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
