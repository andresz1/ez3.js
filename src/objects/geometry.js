EZ3.Geometry = function(data) {
  this.vertices = data.vertices;
  this.indices = data.indices;
  this.normals = data.normals || [];
  this.uv = data.uv || [];
  this.tangents = data.tangents || [];
  this.binormals = data.binormals || [];
  this.colors = data.colors || [];
};

EZ3.Geometry.prototype.initArray = function(size, value) {

  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });

};

EZ3.Geometry.prototype.calculateNormals = function() {

  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  var temporalNormals = initArray(this.vertices.length, 0);
  var temporalAppearances = initArray(this.vertices.length / 3, 0);

  for(k = 0; k < this.indices.length; k += 3) {

    x = 3 * this.indices[k + 0];
    y = 3 * this.indices[k + 1];
    z = 3 * this.indices[k + 2];

    point0 = vec3.create(this.vertices[x + 0], this.vertices[x + 1], this.vertices[x + 2]);
    point1 = vec3.create(this.vertices[y + 0], this.vertices[y + 1], this.vertices[y + 2]);
    point2 = vec3.create(this.vertices[z + 0], this.vertices[z + 1], this.vertices[z + 2]);

    vec3.subtract(vector0, point1, point0);
    vec3.subtract(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if(normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    temporalNormals[x + 0] += normal[0];
    temporalNormals[x + 1] += normal[1];
    temporalNormals[x + 2] += normal[2];

    temporalNormals[y + 0] += normal[0];
    temporalNormals[y + 1] += normal[1];
    temporalNormals[y + 2] += normal[2];

    temporalNormals[z + 0] += normal[0];
    temporalNormals[z + 1] += normal[1];
    temporalNormals[z + 2] += normal[2];

    ++temporalAppearances[x / 3];
    ++temporalAppearances[y / 3];
    ++temporalAppearances[z / 3];

  }

  for(k = 0; k < this.vertices.length / 3; ++k){

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this.normals.push(temporalNormals[x] / temporalAppearances[k]);
    this.normals.push(temporalNormals[y] / temporalAppearances[k]);
    this.normals.push(temporalNormals[z] / temporalAppearances[k]);

  }

  temporalNormals.splice(0, temporalNormals.length);
  temporalAppearances.splice(0, temporalAppearances.length);

};

EZ3.Geometry.prototype.calculateTangents = function() {

};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};

EZ3.Geometry.prototype.calculateBoundingSphere = function() {

};
