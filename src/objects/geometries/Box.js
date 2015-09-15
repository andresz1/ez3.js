/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(dimensions, resolution) {
  EZ3.Geometry.call(this);

  if (dimensions !== undefined)
    this._dimensions = (dimensions instanceof EZ3.Vector3) ? dimensions : new EZ3.Vector3();

  if (resolution !== undefined)
    this._resolution = (resolution instanceof EZ3.Vector3) ? resolution : new EZ3.Vector3();

  this.update();
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Box.prototype.update = function() {
  var width, height, depth;
  var widthHalf, heightHalf, depthHalf;
  var widthSegments, heightSegments, depthSegments;
  var vertices, indices, uvs, normals, tangents, bitangents;

  uvs = [];
  indices = [];
  normals = [];
  vertices = [];

  width = this.dimensions.x;
  height = this.dimensions.y;
  depth = this.dimensions.z;

  widthHalf = width * 0.5;
  heightHalf = height * 0.5;
  depthHalf = depth * 0.5;

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
    var w;
    var vector;
    var output;
    var offset;
    var a, b, c, d;
    var gridX, gridY;
    var uva, uvb, uvc, ubd;
    var widthHalf, heightHalf;
    var segmentWidth, segmentHeight;
    var i, j;

    gridX = widthSegments;
    gridY = heightSegments;

    widthHalf = width * 0.5;
    heightHalf = height * 0.5;

    offset = vertices.length / 3;

    uva = new EZ3.Vector2();
    uvb = new EZ3.Vector2();
    uvc = new EZ3.Vector2();
    uvd = new EZ3.Vector2();

    vector = new EZ3.Vector3();

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

  output = this.mergeVertices(indices, uvs, vertices);
  normals = this.calculateNormals(indices, vertices);

  if (!this.uvs) {
    this.uvs = new EZ3.GeometryArray({
      data: uvs
    });
  } else {
    this.uvs.clear();
    this.uvs.update({
      data: uvs
    });
  }

  if (!this.indices) {
    this.indices = new EZ3.GeometryArray({
      data: this.calculateLinearIndices(indices)
    });
  } else {
    this.indices.clear();
    this.indices.update({
      data: indices
    });
  }

  if (!this.normals) {
    this.normals = new EZ3.GeometryArray({
      data: normals
    });
  } else {
    this.normals.clear();
    this.normals.update({
      data: normals
    });
  }

  if (!this.vertices) {
    this.vertices = new EZ3.GeometryArray({
      data: vertices
    });
  } else {
    this.vertices.clear();
    this.vertices.update({
      data: vertices
    });
  }

  if (!this.tangents) {
    this.tangents = new EZ3.GeometryArray({
      data: tangents
    });
  } else {
    this.tangents.clear();
    this.tangents.update({
      data: tangents
    });
  }

  if (!this.bitangents) {
    this.bitangents = new EZ3.GeometryArray({
      data: bitangents
    });
  } else {
    this.bitangents.clear();
    this.bitangents.update({
      data: bitangents
    });
  }
};

Object.defineProperty(EZ3.Box.prototype, 'dimensions', {
  get: function() {
    return this._dimensions;
  },
  set: function(dimensions) {
    if (dimensions instanceof EZ3.Vector3)
      this._dimensions = dimensions;
  }
});

Object.defineProperty(EZ3.Box.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if (resolution instanceof EZ3.Vector3)
      this._resolution.copy(resolution);
  }
});
