/**
 * @class Torus
 * @extends Geometry
 */

EZ3.Torus = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  var that = this;

  function _create() {
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

    for (s = 0; s < that.resolution.x; ++s) {
      for (r = 0; r < that.resolution.y; ++r) {
        u = s / (that.resolution.x - 1);
        v = r / (that.resolution.y - 1);

        rho = EZ3.DOUBLE_PI * u;
        phi = EZ3.DOUBLE_PI * v;

        cosS = Math.cos(rho);
        cosR = Math.cos(phi);
        sinS = Math.sin(rho);
        sinR = Math.sin(phi);

        vertex.x = (that.radiuses.x + that.radiuses.y * cosR) * cosS;
        vertex.y = (that.radiuses.y * sinR);
        vertex.z = (that.radiuses.x + that.radiuses.y * cosR) * sinS;

        normal.x = vertex.x - that.radiuses.x * cosS;
        normal.y = vertex.y;
        normal.z = vertex.z - that.radiuses.x * sinS;

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
      for (r = 0; r < that.resolution.y - 1; ++r) {
        indices.push((s + 0) * that.resolution.y + (r + 0));
        indices.push((s + 0) * that.resolution.y + (r + 1));
        indices.push((s + 1) * that.resolution.y + (r + 1));

        indices.push((s + 0) * that.resolution.y + (r + 0));
        indices.push((s + 1) * that.resolution.y + (r + 1));
        indices.push((s + 1) * that.resolution.y + (r + 0));
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

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

Object.defineProperty(EZ3.Torus.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    this._radiuses.x = radiuses.x;
    this._radiuses.y = radiuses.y;
  }
});

Object.defineProperty(EZ3.Torus.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
