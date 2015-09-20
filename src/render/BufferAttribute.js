/**
 * @class BufferAttribute
 */

EZ3.BufferAttribute = function(length) {
  this._length = length || 0;
  this._data = [];
  this._offset = 0;
  this._stride = 0;
  this._dynamic = false;
  this._normalized = false;

  this.dirty = true;
};

EZ3.BufferAttribute.prototype.constructor = EZ3.BufferAttribute;

Object.defineProperty(EZ3.BufferAttribute.prototype, 'empty', {
  get: function() {
    return this.data.length === 0;
  }
});

Object.defineProperty(EZ3.BufferAttribute.prototype, 'length', {
  get: function() {
    return this._length;
  },
  set: function(length) {
    this._length = length;
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

EZ3.BufferAttribute.UV_LENGTH = 2;
EZ3.BufferAttribute.COLOR_LENGTH = 3;
EZ3.BufferAttribute.VERTEX_LENGTH = 3;
EZ3.BufferAttribute.NORMAL_LENGTH = 3;
EZ3.BufferAttribute.TANGENT_LENGTH = 4;
EZ3.BufferAttribute.BITANGENT_LENGTH = 3;
