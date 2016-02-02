/**
 * @class EZ3.Buffer
 * @constructor
 * @param {Number[]} [data]
 * @param {Boolean} [dynamic]
 */
EZ3.Buffer = function(data, dynamic) {
  /**
   * @property {WebGLId} _id
   * @private
   */
  this._id = null;
  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};
  /**
   * @property {Number} _ranges
   * @private
   */
  this._ranges = [];

  /**
   * @property {Number[]} data
   * @default []
   */
  this.data = data || [];
  /**
   * @property {Boolean} dynamic
   * @default false
   */
  this.dynamic = (dynamic !== undefined) ? dynamic : false;
  /**
   * @property {Boolean} needUpdate
   * @default true
   */
  this.needUpdate = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

/**
 * @method EZ3.Buffer#bind
 * @param {WebGLContext} gl
 * @param {Number} target
 */
EZ3.Buffer.prototype.bind = function(gl, target) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(target, this._id);
};

/**
 * @method EZ3.Buffer#update
 * @param {WebGLContext} gl
 * @param {Number} target
 * @param {Number} [bytes]
 */
EZ3.Buffer.prototype.update = function(gl, target, bytes) {
  var length = bytes * this.data.length;
  var changed = false;
  var ArrayType;
  var offset;
  var data;
  var k;

  if (target === gl.ARRAY_BUFFER) {
    ArrayType = Float32Array;
  } else {
    if (bytes === 4)
      ArrayType = Uint32Array;
    else
      ArrayType = Uint16Array;
  }

  if (this._cache.length !== length) {
    this._cache.length = length;
    changed = true;
  }

  if (this._cache.dynamic !== this.dynamic) {
    this._cache.dynamic =  this.dynamic;
    changed = true;
  }

  if (changed) {
    this._ranges = [];

    gl.bufferData(target, new ArrayType(this.data), (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  } else {
    if (this._ranges.length) {
      for (k = 0; k < this._ranges.length; k += 2) {
        offset = bytes * this._ranges[k];
        data = this.data.slice(this._ranges[k], this._ranges[k + 1]);
        gl.bufferSubData(target, offset, new ArrayType(data));
      }

      this._ranges = [];
    } else
      gl.bufferSubData(target, 0, new ArrayType(this.data));
  }
};

/**
 * @method EZ3.Buffer#addUpdateRange
 * @param {Number} left
 * @param {Number} right
 */
EZ3.Buffer.prototype.addUpdateRange = function(left, right) {
    this._ranges.push(left, right);
};
