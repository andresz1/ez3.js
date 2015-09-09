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

  var that = this;

  function _create() {
    var u, v;
    var vertex, normal;
    var actualHeight, step;
    var vertices, normals, uvs, indices;
    var s, t;

    actualHeight = that.height;
    step = (that.height - that.base) / that.resolution.x;

    vertex = new EZ3.Vector3();
    normal = new EZ3.Vector3();

    uvs = [];
    indices = [];
    normals = [];
    vertices = [];

    for (s = 0; s < that.resolution.x; ++s) {
      for (t = 0; t < that.resolution.y; ++t) {
        u = s / (that.resolution.x - 1);
        v = t / (that.resolution.y - 1);

        vertex.x = that.radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex.y = actualHeight;
        vertex.z = that.radius * Math.sin(EZ3.DOUBLE_PI * v);

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

      if (actualHeight < that.base)
        break;

    }

    for (s = 0; s < that.resolution.x - 1; ++s) {
      for (t = 0; t < that.resolution.y - 1; ++t) {
        indices.push((s + 0) * that.resolution.y + (t + 0));
        indices.push((s + 0) * that.resolution.y + (t + 1));
        indices.push((s + 1) * that.resolution.y + (t + 1));

        indices.push((s + 0) * that.resolution.y + (t + 0));
        indices.push((s + 1) * that.resolution.y + (t + 1));
        indices.push((s + 1) * that.resolution.y + (t + 0));
      }
    }

    that.uvs = new EZ3.GeometryArray({
      data: uvs
    });

    that.indices = new EZ3.GeometryArray({
      data: indices
    });

    that.normals = new EZ3.GeometryArray({
      data: normals
    });

    that.vertices = new EZ3.GeometryArray({
      data: vertices
    });
  }

  _create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;

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
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
