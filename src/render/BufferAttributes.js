/**
 * @class BufferAttributes
 */

EZ3.BufferAttributes = function(config) {
  this._data = config.data || [];
  this._offset = config.offset || 0;
  this._stride = config.stride || 0;
  this._dynamic = config.dynamic || false;
  this._normalized = config.normalized || false;
  this.dirty = true;
};

EZ3.BufferAttributes.prototype.constructor = EZ3.BufferAttributes;

Object.defineProperty(EZ3.BufferAttributes.prototype, 'data', {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttributes.prototype, 'offset', {
  get: function() {
    return this._offset;
  },
  set: function(offset) {
    this._offset = offset;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttributes.prototype, 'stride', {
  get: function() {
    return this._stride;
  },
  set: function(stride) {
    this._stride = stride;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttributes.prototype, 'dynamic', {
  get: function() {
    return this._dynamic;
  },
  set: function(dynamic) {
    this._dynamic = dynamic;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.BufferAttributes.prototype, 'normalized', {
  get: function() {
    return this._normalized;
  },
  set: function(normalized) {
    this._normalized = normalized;
    this.dirty = true;
  }
});
