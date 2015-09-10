/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(resolution) {
  EZ3.Geometry.call(this);

  this._resolution = resolution;

  this.update(resolution);
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Box.prototype.update = function(resolution) {
  var halfWidth, halfHeight, halfDepth;
  var vertices, indices, normals;

  halfWidth  = this.resolution.x * 0.5;
  halfHeight = this.resolution.y * 0.5;
  halfDepth  = this.resolution.z * 0.5;

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

  normals = this.calculateNormals(indices, vertices);

  if(!this.indices) {
    this.indices = new EZ3.GeometryArray({
      data: indices
    });
  } else {
    this.indices.clear();
    this.indices.update({
      data: indices
    });
  }

  if(!this.normals) {
    this.normals = new EZ3.GeometryArray({
      data: normals
    });
  } else {
    this.normals.clear();
    this.normals.update({
      data: normals
    });
  }

  if(!this.vertices) {
    this.vertices = new EZ3.GeometryArray({
      data: vertices
    });
  } else {
    this.vertices.clear();
    this.vertices.update({
      data: vertices
    });
  }
};

Object.defineProperty(EZ3.Box.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
