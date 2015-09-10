/**
 * @class Ellipsoid
 * @extends Geometry
 */

EZ3.Ellipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  var that = this;

  function _create() {
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

    for (s = 0; s < that.resolution.x; ++s) {
      for (t = 0; t < that.resolution.y; ++t) {
        u = s / (that.resolution.x - 1);
        v = t / (that.resolution.y - 1);

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex.x = (that.radiuses.x * Math.cos(phi) * Math.sin(rho));
        vertex.y = (that.radiuses.y * Math.sin(rho - EZ3.HALF_PI));
        vertex.z = (that.radiuses.z * Math.sin(phi) * Math.sin(rho));

        normal.x = vertex.x / that.radiuses.x;
        normal.y = vertex.y / that.radiuses.y;
        normal.z = vertex.z / that.radiuses.z;

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

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

Object.defineProperty(EZ3.Ellipsoid.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    this._radiuses.x = radiuses.x;
    this._radiuses.y = radiuses.y;
    this._radiuses.z = radiuses.z;
  }
});

Object.defineProperty(EZ3.Ellipsoid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
