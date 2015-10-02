/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(dimensions, resolution) {
  EZ3.Geometry.call(this);

  if (dimensions instanceof EZ3.Vector3)
    this._dimensions = dimensions;
  else
    this._dimensions = new EZ3.Vector3(1, 1, 1);


  if (resolution instanceof EZ3.Vector3)
    this._resolution = resolution;
  else
    this._resolution = new EZ3.Vector3(1, 1, 1);
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
  var need32Bits = false;
  var widthSegments;
  var heightSegments;
  var depthSegments;
  var buffer;
  var length;

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
    var a;
    var b;
    var c;
    var d;
    var w;
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

        a = offset + (i * (gridX + 1) + j);
        b = offset + (i * (gridX + 1) + (j + 1));
        c = offset + ((i + 1) * (gridX + 1) + j);
        d = offset + ((i + 1) * (gridX + 1) + (j + 1));

        uva.set(j / gridX, i / gridY);
        uvb.set(j / gridX, (i + 1) / gridY);
        uvc.set((j + 1) / gridX, (i + 1) / gridY);
        uvd.set((j + 1) / gridX, i / gridY);

        indices.push(a, c, b, c, d, b);

        uvs.push(uva.x, uva.y, uvb.x, uvb.y, uvd.x, uvd.y);
        uvs.push(uvb.x, uvb.y, uvc.x, uvc.y, uvd.x, uvd.y);

        if (!need32Bits) {
          length = indices.length;
          need32Bits = need32Bits ||
            (a > EZ3.Math.MAX_USHORT) ||
            (b > EZ3.Math.MAX_USHORT) ||
            (c > EZ3.Math.MAX_USHORT) ||
            (d > EZ3.Math.MAX_USHORT);
        }
      }
    }
  }

  buildPlane('z', 'y', -1, -1, depth, height, +widthHalf);
  buildPlane('z', 'y', +1, -1, depth, height, -widthHalf);
  buildPlane('x', 'z', +1, +1, width, depth, +heightHalf);
  buildPlane('x', 'z', +1, -1, width, depth, -heightHalf);
  buildPlane('x', 'y', +1, -1, width, height, +depthHalf);
  buildPlane('x', 'y', -1, -1, width, height, -depthHalf);

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);

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

Object.defineProperty(EZ3.Box.prototype, 'regenerate', {
  get: function() {
    return this.dimensions.dirty || this.resolution.dirty;
  },
  set: function(regenerate) {
    this.dimensions.dirty = regenerate;
    this.resolution.dirty = regenerate;
  }
});
