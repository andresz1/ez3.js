/**
 * @class BufferAttribute
 */

EZ3.BufferAttribute = function(size) {
  this._data = [];
  this._offset = 0;
  this._stride = 0;
  this._dynamic = false;
  this._normalized = false;
  this._size = size || 0;

  this.dirty = true;
};

EZ3.BufferAttribute.prototype.constructor = EZ3.BufferAttribute;

Object.defineProperty(EZ3.BufferAttribute.prototype, 'size', {
  get: function() {
    return this._size;
  },
  set: function(size) {
    this._size = size;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'data', {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'offset', {
  get: function() {
    return this._offset;
  },
  set: function(offset) {
    this._offset = offset;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'stride', {
  get: function() {
    return this._stride;
  },
  set: function(stride) {
    this._stride = stride;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'dynamic', {
  get: function() {
    return this._dynamic;
  },
  set: function(dynamic) {
    this._dynamic = dynamic;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'normalized', {
  get: function() {
    return this._normalized;
  },
  set: function(normalized) {
    this._normalized = normalized;
    this.dirty = true;
  }
});

EZ3.BufferAttribute.SIZE = {};
EZ3.BufferAttribute.SIZE.UV = 2;
EZ3.BufferAttribute.SIZE.VERTEX = 3;
EZ3.BufferAttribute.SIZE.COLOR = 3;
EZ3.BufferAttribute.SIZE.NORMAL = 3;
EZ3.BufferAttribute.SIZE.BITANGENT = 3;
EZ3.BufferAttribute.SIZE.TANGENT = 4;
