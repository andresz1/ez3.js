/**
 * @class Torus
 * @extends Geometry
 */

EZ3.Torus = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  this.update();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.update = function() {
  var u, v;
  var result;
  var rho, phi;
  var vertex, normal;
  var cosS, cosR, sinS, sinR;
  var vertices, normals, uvs, indices;
  var s, r;

  vertex = new EZ3.Vector3();
  normal = new EZ3.Vector3();

  uvs = [];
  indices = [];
  normals = [];
  vertices = [];

  for (s = 0; s < this.resolution.x; ++s) {
    for (r = 0; r < this.resolution.y; ++r) {
      u = s / (this.resolution.x - 1);
      v = r / (this.resolution.y - 1);

      rho = EZ3.DOUBLE_PI * u;
      phi = EZ3.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex.x = (this.radiuses.x + this.radiuses.y * cosR) * cosS;
      vertex.y = (this.radiuses.y * sinR);
      vertex.z = (this.radiuses.x + this.radiuses.y * cosR) * sinS;

      normal.x = vertex.x - this.radiuses.x * cosS;
      normal.y = vertex.y;
      normal.z = vertex.z - this.radiuses.x * sinS;

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
    for (r = 0; r < this.resolution.y - 1; ++r) {
      indices.push((s + 0) * this.resolution.y + (r + 0));
      indices.push((s + 0) * this.resolution.y + (r + 1));
      indices.push((s + 1) * this.resolution.y + (r + 1));

      indices.push((s + 0) * this.resolution.y + (r + 0));
      indices.push((s + 1) * this.resolution.y + (r + 1));
      indices.push((s + 1) * this.resolution.y + (r + 0));
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

Object.defineProperty(EZ3.Torus.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    if(radiuses instanceof EZ3.Vector2)
      this._radiuses.copy(radiuses);
  }
});

Object.defineProperty(EZ3.Torus.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
