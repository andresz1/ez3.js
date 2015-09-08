/**
 * @class Cone
 * @extends Geometry
 */

EZ3.Cone = function(base, height, resolution) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._base.dirty = false;

  this._height = height;
  this._height.dirty = false;

  this._resolution = resolution;

  var that = this;

  function _create() {
    var u, v;
    var vertex, normal;
    var radius, actualHeight, step;
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

        radius = Math.abs(that.height - actualHeight) * 0.5;

        vertex.x = radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex.y = actualHeight;
        vertex.z = radius * Math.sin(EZ3.DOUBLE_PI * v);

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

    that.uvs = uvs;
    that.indices = indices;
    that.normals = normals;
    that.vertices = vertices;
  }

  _create();
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;

Object.defineProperty(EZ3.Cone.prototype, 'base', {
  get: function() {
    return this._base;
  },
  set: function(base) {
    this._base = base;
    this._base.dirty = true;
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'height', {
  get: function() {
    return this._height;
  },
  set: function(height) {
    this._height = height;
    this._height.dirty = true;
  }
});

Object.defineProperty(EZ3.Cone.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
