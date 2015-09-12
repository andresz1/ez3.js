/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(resolution) {
  EZ3.Geometry.call(this);

  this._resolution = resolution;

  this.update();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Grid.prototype.update = function() {

  var index0, index1, index2, index3, z, x;
  var vertices, normals, uvs, indices;

  uvs = [];
  indices = [];
  normals = [];
  vertices = [];

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x);
      vertices.push(0);
      vertices.push(z);

      uvs.push(x / this.resolution.y);
      uvs.push(z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      index0 = z * (this.resolution.x + 1) + x;
      index1 = index0 + 1;
      index2 = index0 + (this.resolution.x + 1);
      index3 = index2 + 1;

      indices.push(index0);
      indices.push(index2);
      indices.push(index1);

      indices.push(index1);
      indices.push(index2);
      indices.push(index3);
    }
  }

  normals = this.calculateNormals(indices, vertices);

  output = this.calculateTangentsAndBitangents(indices, uvs, normals, vertices);

  if(!this.uvs) {
    this.uvs = new EZ3.GeometryArray({
      data: uvs,
      dynamic: true
    });
  } else {
    this.uvs.clear();
    this.uvs.update({
      data: uvs,
      dynamic: true
    });
  }

  if(!this.indices) {
    this.indices = new EZ3.GeometryArray({
      data: indices,
      dynamic: true
    });
  } else {
    this.indices.clear();
    this.indices.update({
      data: indices,
      dynamic: true
    });
  }

  if(!this.normals) {
    this.normals = new EZ3.GeometryArray({
      data: normals,
      dynamic: true
    });
  } else {
    this.normals.clear();
    this.normals.update({
      data: normals,
      dynamic: true
    });
  }

  if(!this.vertices) {
    this.vertices = new EZ3.GeometryArray({
      data: vertices,
      dynamic: true
    });
  } else {
    this.vertices.clear();
    this.vertices.update({
      data: vertices,
      dynamic: true
    });
  }

  if(!this.tangents) {
    this.tangents = new EZ3.GeometryArray({
      data: output.tangents,
      dynamic: true
    });
  } else {
    this.tangents.clear();
    this.tangents.update({
      data: output.tangents,
      dynamic: true
    });
  }

  if(!this.bitangents) {
    this.bitangents = new EZ3.GeometryArray({
      data: output.bitangents,
      dynamic: true
    });
  } else {
    this.bitangents.clear();
    this.bitangents.update({
      data: output.bitangents,
      dynamic: true
    });
  }
};

Object.defineProperty(EZ3.Grid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
