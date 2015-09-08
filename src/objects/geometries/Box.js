/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(resolution) {
  EZ3.Geometry.call(this);

  this._resolution = resolution;

  var that = this;

  function _create () {
    var halfWidth, halfHeight, halfDepth;
    var vertices, indices, normals;

    halfWidth  = that.resolution.x * 0.5;
    halfHeight = that.resolution.y * 0.5;
    halfDepth  = that.resolution.z * 0.5;

    vertices = [
      +halfWidth, +halfHeight, +halfDepth,
      -halfWidth, +halfHeight, +halfDepth,
      -halfWidth, -halfHeight, +halfDepth,
      +halfWidth, -halfHeight, +halfDepth,
      +halfWidth, -halfHeight, -halfDepth,
      -halfWidth, -halfHeight, -halfDepth,
      -halfWidth, +halfHeight, -halfDepth,
      +halfWidth, +halfHeight, -halfDepth
    ];

    indices = [
      0, 1 ,2,
      0, 2, 3,
      7, 4, 5,
      7, 5, 6,
      6, 5, 2,
      6, 2, 1,
      7, 0, 3,
      7, 3, 4,
      7, 6, 1,
      7, 1, 0,
      3, 2, 5,
      3, 5, 4
    ];

    normals = that.calculateNormals(indices, vertices);

    that.indices = indices;
    that.normals = normals;
    that.vertices = vertices;
  }

  _create();
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

Object.defineProperty(EZ3.Box.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    this._resolution.x = resolution.x;
    this._resolution.y = resolution.y;
  }
});
