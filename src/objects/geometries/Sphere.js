/**
 * @class Sphere
 * @extends Geometry
 */

EZ3.Sphere = function(radius, resolution) {
  EZ3.Geometry.call(this);

  this._radius = radius;
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

    for (s = 0; s < that.resolution.x; s++) {
      for (t = 0; t < that.resolution.y; t++) {
        u = s / (that.resolution.x - 1);
        v = t / (that.resolution.y - 1);

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex.x = (that.radius * Math.cos(phi) * Math.sin(rho));
        vertex.y = (that.radius * Math.sin(rho - EZ3.HALF_PI));
        vertex.z = (that.radius * Math.sin(phi) * Math.sin(rho));

        normal.x = vertex.x / that.radius;
        normal.y = vertex.y / that.radius;
        normal.z = vertex.z / that.radius;

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

    that.uvs = uvs;
    that.indices = indices;
    that.normals = normals;
    that.vertices = vertices;
  }

  _create();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

Object.defineProperty(EZ3.Sphere.prototype, 'radius', {
  get: function() {
    return this._radius;
  },
  set: function(radius) {
    this._radius = radius;
  }
});

Object.defineProperty(EZ3.Sphere.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
