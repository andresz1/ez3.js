/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(resolution) {
  EZ3.Geometry.call(this);

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(2,2);
  }
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Grid.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var index0;
  var index1;
  var index2;
  var index3;
  var x;
  var z;

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x);
      vertices.push(0);
      vertices.push(z);

      uvs.push(x / this.resolution.y);
      uvs.push(z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      index0 = z * (this.resolution.x + 1) + x;
      index1 = index0 + 1;
      index2 = index0 + (this.resolution.x + 1);
      index3 = index2 + 1;

      indices.push(index0);
      indices.push(index2);
      indices.push(index1);

      indices.push(index1);
      indices.push(index2);
      indices.push(index3);
    }
  }

  this.uvs.data = uvs;
  this.uvs.dynamic = true;

  this.indices.data = indices;
  this.indices.dynamic = true;

  this.vertices.data = vertices;
  this.vertices.dynamic = true;

  this.mergeVertices();
};

Object.defineProperty(EZ3.Grid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});

Object.defineProperty(EZ3.Grid.prototype, 'dirty', {
  get: function() {
    return this.resolution.dirty;
  },
  set: function(dirty) {
    this.resolution.dirty = dirty;
  }
});
