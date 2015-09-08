/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(resolution) {
  EZ3.Geometry.call(this);

  this._resolution = resolution;

  var that = this;

  function _create() {
    var index0, index1, index2, index3, z, x;
    var vertices, normals, uvs, indices;

    uvs = [];
    indices = [];
    normals = [];
    vertices = [];

    for (z = 0; z < that.resolution.x + 1; ++z) {
      for (x = 0; x < that.resolution.y + 1; ++x) {
        vertices.push(x);
        vertices.push(0);
        vertices.push(z);

        uvs.push(x / that.resolution.y);
        uvs.push(z / that.resolution.x);
      }
    }

    for (z = 0; z < that.resolution.x; ++z) {
      for (x = 0; x < that.resolution.y; ++x) {
        index0 = z * (that.resolution.x + 1) + x;
        index1 = index0 + 1;
        index2 = index0 + (that.resolution.x + 1);
        index3 = index2 + 1;

        indices.push(index0);
        indices.push(index2);
        indices.push(index1);

        indices.push(index1);
        indices.push(index2);
        indices.push(index3);
      }
    }

    that.calculateNormals();
    normals = that.normals;

    that.uvs = uvs;
    that.indices = indices;
    that.normals = normals;
    that.vertices = vertices;
  }

  _create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

Object.defineProperty(EZ3.Grid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
