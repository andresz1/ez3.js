/**
 * @class EZ3.Box
 * @extends EZ3.Primitive
 * @constructor
 * @param {EZ3.Vector3} [resolution]
 * @param {EZ3.Vector3} [dimensions]
 */
EZ3.Box = function(resolution, dimensions) {
  EZ3.Primitive.call(this);

  /**
   * @property {EZ3.Vector3} resolution
   * @default new EZ3.Vector3(1, 1, 1)
   */
  this.resolution = resolution || new EZ3.Vector3(1, 1, 1);

  /**
   * @property {EZ3.Vector3} dimensions
   * @default new EZ3.Vector3(1, 1, 1)
   */
  this.dimensions = dimensions || new EZ3.Vector3(1, 1, 1);
};

EZ3.Box.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

/**
 * @method EZ3.Box#generate
 */
EZ3.Box.prototype.generate = function() {
  var that = this;
  var uvs = [];
  var indices = [];
  var vertices = [];
  var normals = [];
  var widthHalf = this.dimensions.x * 0.5;
  var heightHalf = this.dimensions.y * 0.5;
  var depthHalf = this.dimensions.z * 0.5;

  function computeFace(u, v, udir, vdir, width, height, depth) {
    var gridX = that.resolution.x;
    var gridY = that.resolution.y;
    var widthHalf = width * 0.5;
    var heightHalf = height * 0.5;
    var offset = vertices.length / 3;
    var vector = new EZ3.Vector3();
    var normal = new EZ3.Vector3();
    var segmentWidth;
    var segmentHeight;
    var a;
    var w;
    var s;
    var t;

    if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x'))
      w = 'z';
    else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
      w = 'y';
      gridY = that.resolution.z;
    } else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
      w = 'x';
      gridX = that.resolution.z;
    }

    normal[w] = (depth > 0) ? 1 : -1;

    segmentWidth = width / gridX;
    segmentHeight = height / gridY;

    for (s = 0; s < gridY + 1; s++) {
      for (t = 0; t < gridX + 1; t++) {
        vector[u] = (t * segmentWidth - widthHalf) * udir;
        vector[v] = (s * segmentHeight - heightHalf) * vdir;
        vector[w] = depth;

        uvs.push(t / gridX, s / gridY);
        vertices.push(vector.x, vector.y, vector.z);
        normals.push(normal.x, normal.y, normal.z);
      }
    }

    for (s = 0; s < gridY; s++) {
      for (t = 0; t < gridX; t++) {
        a = offset + (s * (gridX + 1) + t);
        w = offset + ((s + 1) * (gridX + 1) + (t + 1));

        indices.push(a, w, offset + (s * (gridX + 1) + (t + 1)));
        indices.push(a, offset + ((s + 1) * (gridX + 1) + t), w);
      }
    }
  }

  computeFace('z', 'y', -1, -1, this.dimensions.z, this.dimensions.y, widthHalf);
  computeFace('z', 'y', 1, -1, this.dimensions.z, this.dimensions.y, -widthHalf);
  computeFace('x', 'z', 1, 1, this.dimensions.x, this.dimensions.z, heightHalf);
  computeFace('x', 'z', 1, -1, this.dimensions.x, this.dimensions.z, -heightHalf);
  computeFace('x', 'y', 1, -1, this.dimensions.x, this.dimensions.y, depthHalf);
  computeFace('x', 'y', -1, -1, this.dimensions.x, this.dimensions.y, -depthHalf);

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

/**
 * @property {Boolean} needGenerate
 * @memberof EZ3.Box
 */
Object.defineProperty(EZ3.Box.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (!this.dimensions.isEqual(this._cache.dimensions)) {
      this._cache.dimensions = this.dimensions.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});
