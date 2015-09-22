/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(dimensions, resolution) {
  EZ3.Geometry.call(this);

  if (dimensions !== undefined) {
    if(dimensions instanceof EZ3.Vector3)
      this._dimensions = dimensions;
    else
      this._dimensions = new EZ3.Vector3(1,1,1);
  }

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector3)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector3(1,1,1);
  }
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Box.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var width = this.dimensions.x;
  var height = this.dimensions.y;
  var depth = this.dimensions.z;
  var widthHalf = width * 0.5;
  var depthHalf = depth * 0.5;
  var heightHalf = height * 0.5;
  var widthSegments;
  var heightSegments;
  var depthSegments;

  if (this.resolution !== undefined) {
    widthSegments = this.resolution.x;
    heightSegments = this.resolution.y;
    depthSegments = this.resolution.z;
  } else {
    widthSegments = 1;
    heightSegments = 1;
    depthSegments = 1;
  }

  function buildPlane(u, v, udir, vdir, width, height, depth) {
    var gridX = widthSegments;
    var gridY = heightSegments;
    var widthHalf = width * 0.5;
    var heightHalf = height * 0.5;
    var offset = vertices.length / 3;
    var uva = new EZ3.Vector2();
    var uvb = new EZ3.Vector2();
    var uvc = new EZ3.Vector2();
    var uvd = new EZ3.Vector2();
    var vector = new EZ3.Vector3();
    var segmentWidth;
    var segmentHeight;
    var w;
    var a;
    var b;
    var c;
    var d;
    var i;
    var j;

    if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {

      w = 'z';

    } else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {

      w = 'y';
      gridY = depthSegments;

    } else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {

      w = 'x';
      gridX = depthSegments;

    }

    segmentWidth = width / gridX;
    segmentHeight = height / gridY;

    for (i = 0; i < gridY + 1; i++) {
      for (j = 0; j < gridX + 1; j++) {
        vector[u] = (j * segmentWidth - widthHalf) * udir;
        vector[v] = (i * segmentHeight - heightHalf) * vdir;
        vector[w] = depth;

        vertices.push(vector.x, vector.y, vector.z);
      }
    }

    for (i = 0; i < gridY; ++i) {
      for (j = 0; j < gridX; ++j) {
        a = (j + 0) + (gridX + 1) * (i + 0);
        b = (j + 0) + (gridX + 1) * (i + 1);
        c = (j + 1) + (gridX + 1) * (i + 1);
        d = (j + 1) + (gridX + 1) * (i + 0);

        uva.set((j + 0) / gridX, (i + 0) / gridY);
        uvb.set((j + 0) / gridX, (i + 1) / gridY);
        uvc.set((j + 1) / gridX, (i + 1) / gridY);
        uvd.set((j + 1) / gridX, (i + 0) / gridY);

        indices.push(a + offset, b + offset, d + offset);
        indices.push(b + offset, c + offset, d + offset);

        uvs.push(uva.x, uva.y, uvb.x, uvb.y, uvd.x, uvd.y);
        uvs.push(uvb.x, uvb.y, uvc.x, uvc.y, uvd.x, uvd.y);
      }
    }
  }

  buildPlane('z', 'y', -1, -1, depth, height, +widthHalf);
  buildPlane('z', 'y', +1, -1, depth, height, -widthHalf);
  buildPlane('x', 'z', +1, +1, width, depth, +heightHalf);
  buildPlane('x', 'z', +1, -1, width, depth, -heightHalf);
  buildPlane('x', 'y', +1, -1, width, height, +depthHalf);
  buildPlane('x', 'y', -1, -1, width, height, -depthHalf);

  this.uvs.data = uvs;
  this.uvs.dynamic = true;

  this.indices.data = indices;
  this.indices.dynamic = true;

  this.vertices.data = vertices;
  this.vertices.dynamic = true;

  this.mergeVertices();
};

Object.defineProperty(EZ3.Box.prototype, 'dimensions', {
  get: function() {
    return this._dimensions;
  },
  set: function(dimensions) {
    if (dimensions instanceof EZ3.Vector3) {
      this._dimensions = dimensions;
    }
  }
});

Object.defineProperty(EZ3.Box.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if (resolution instanceof EZ3.Vector3) {
      this._resolution.copy(resolution);
    }
  }
});

Object.defineProperty(EZ3.Box.prototype, 'dirty', {
  get: function() {
    return this.dimensions.dirty || this.resolution.dirty;
  },
  set: function(dirty) {
    this.dimensions.dirty = dirty;
    this.resolution.dirty = dirty;
  }
});
