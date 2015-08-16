EZ3.Geometry = function() {
  this._uv = [];
  this._indices = [];
  this._normals = [];
  this._vertices = [];
  this._tangents = [];
  this._bitangents = [];
  this._maxPoint = vec3.create();
  this._minPoint = vec3.create();
  this._midPoint = vec3.create();
  this._buffer = new EZ3.Buffer();
};

EZ3.Geometry.prototype.draw = function(gl) {
  this._buffer.draw(gl);
};

EZ3.Geometry.prototype.init = function(gl) {
  this._buffer.init(gl);
};

EZ3.Geometry.prototype.fill = function(buffer, size, data) {
  this._buffer.fill(buffer, size, data);
};

EZ3.Geometry.prototype.initArray = function(size, value) {
  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });
};

EZ3.Geometry.prototype.calculateNormals = function() {
  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  normal  = vec3.create();
  point0  = vec3.create();
  point1  = vec3.create();
  point2  = vec3.create();
  vector0 = vec3.create();
  vector1 = vec3.create();

  var tempNormals = this.initArray(this._vertices.length, 0);
  var tempAppearances = this.initArray(this._vertices.length / 3, 0);

  for(k = 0; k < this._indices.length; k += 3) {

    x = 3 * this._indices[k + 0];
    y = 3 * this._indices[k + 1];
    z = 3 * this._indices[k + 2];

    vec3.set(point0, this._vertices[x + 0], this._vertices[x + 1], this._vertices[x + 2]);
    vec3.set(point1, this._vertices[y + 0], this._vertices[y + 1], this._vertices[y + 2]);
    vec3.set(point2, this._vertices[z + 0], this._vertices[z + 1], this._vertices[z + 2]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if(normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
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

  for(k = 0; k < this._vertices.length / 3; ++k){
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this._normals.push(tempNormals[x] / tempAppearances[k]);
    this._normals.push(tempNormals[y] / tempAppearances[k]);
    this._normals.push(tempNormals[z] / tempAppearances[k]);
  }

  tempNormals.splice(0, tempNormals.length);
  tempAppearances.splice(0, tempAppearances.length);
};

EZ3.Geometry.prototype.updateMaxPoint = function(x, y, z) {
  this._maxPoint[0] = Math.max(this._maxPoint[0], x);
  this._maxPoint[1] = Math.max(this._maxPoint[1], y);
  this._maxPoint[2] = Math.max(this._maxPoint[2], z);
};

EZ3.Geometry.prototype.updateMinPoint = function(x, y, z) {
  this._minPoint[0] = Math.min(this._minPoint[0], x);
  this._minPoint[1] = Math.min(this._minPoint[1], y);
  this._minPoint[2] = Math.min(this._minPoint[2], z);
};

EZ3.Geometry.prototype.calculateMidPoint = function () {
  this._midPoint[0] = (this._maxPoint[0] + this._minPoint[0]) * 0.5;
  this._midPoint[0] = (this._maxPoint[1] + this._minPoint[1]) * 0.5;
  this._midPoint[0] = (this._maxPoint[2] + this._minPoint[2]) * 0.5;
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

  var tempT = this.initArray(this._vertices.length, 0);
  var tempB = this.initArray(this._vertices.length, 0);

  for(k = 0; k < this._indices.length; k += 3) {

    x = this._indices[k + 0];
    y = this._indices[k + 1];
    z = this._indices[k + 2];

    vec3.set(point0, this._vertices[3 * x + 0], this._vertices[3 * x + 1], this._vertices[3 * x + 2]);
    vec3.set(point1, this._vertices[3 * y + 0], this._vertices[3 * y + 1], this._vertices[3 * y + 2]);
    vec3.set(point2, this._vertices[3 * z + 0], this._vertices[3 * z + 1], this._vertices[3 * z + 2]);

    vec2.set(textPoint0, this._uv[2 * x + 0], this._uv[2 * x + 1]);
    vec2.set(textPoint1, this._uv[2 * y + 0], this._uv[2 * y + 1]);
    vec2.set(textPoint2, this._uv[2 * z + 0], this._uv[2 * z + 1]);

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

  for(k = 0; k < this._vertices.length / 3; ++k) {

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    vec3.set(tangent, tempT[x], tempT[y], tempT[z]);
    vec3.set(bitangent, tempB[x], tempB[y], tempB[z]);
    vec3.set(normal, this._normals[x], this._normals[y], this._normals[z]);

  }

};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};
