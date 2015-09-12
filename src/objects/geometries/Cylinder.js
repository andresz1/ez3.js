/**
 * @class Cylinder
 * @extends Geometry
 */

EZ3.Cylinder = function(radius, base, height, resolution) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._base.dirty = false;

  this._radius = radius;
  this._radius.dirty = false;

  this._height = height;
  this._height.dirty = false;

  this._resolution = resolution;

  this.update();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;

EZ3.Cylinder.prototype.update = function() {
  var u, v;
  var vertex, normal;
  var actualHeight, step;
  var vertices, normals, uvs, indices;
  var s, t;

  actualHeight = this.height;
  step = (this.height - this.base) / this.resolution.x;

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

      vertex.x = this.radius * Math.cos(EZ3.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = this.radius * Math.sin(EZ3.DOUBLE_PI * v);

      normal.x = vertex.x;
      normal.y = vertex.y;
      normal.z = vertex.z;

      normal.normalize();

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);

      normals.push(normal.x);
      normals.push(normal.y);
      normals.push(normal.z);

      uvs.push(u);
      uvs.push(v);

    }

    actualHeight -= step;

    if (actualHeight < this.base)
      break;

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

Object.defineProperty(EZ3.Cylinder.prototype, 'base', {
  get: function() {
    return this._base;
  },
  set: function(base) {
    this._base = base;
    this._base.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'radius', {
  get: function() {
    return this._radius;
  },
  set: function(radius) {
    this._radius = radius;
    this._radius.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(height) {
    this._height = height;
    this._height.dirty = true;
  }
});

Object.defineProperty(EZ3.Cylinder.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
