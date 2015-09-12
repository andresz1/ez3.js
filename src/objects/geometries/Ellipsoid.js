/**
 * @class Ellipsoid
 * @extends Geometry
 */

EZ3.Ellipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  this.update();
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

EZ3.Ellipsoid.prototype.update = function() {
  var u, v;
  var phi, rho;
  var normal, vertex;
  var vertices, normals, uvs, indices;
  var s, t;

  vertex = new EZ3.Vector3();
  normal = new EZ3.Vector3();

  uvs = [];
  indices = [];
  normals = [];
  vertices = [];

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.DOUBLE_PI * u;
      rho = EZ3.PI * v;

      vertex.x = (this.radiuses.x * Math.cos(phi) * Math.sin(rho));
      vertex.y = (this.radiuses.y * Math.sin(rho - EZ3.HALF_PI));
      vertex.z = (this.radiuses.z * Math.sin(phi) * Math.sin(rho));

      normal.x = vertex.x / this.radiuses.x;
      normal.y = vertex.y / this.radiuses.y;
      normal.z = vertex.z / this.radiuses.z;

      normal.normalize();

      uvs.push(u);
      uvs.push(v);

      normals.push(normal.x);
      normals.push(normal.y);
      normals.push(normal.z);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 0) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 1));

      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 1) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 0));
    }
  }

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

Object.defineProperty(EZ3.Ellipsoid.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    if(radiuses instanceof EZ3.Vector3)
      this._radiuses.copy(radiuses);
  }
});

Object.defineProperty(EZ3.Ellipsoid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
