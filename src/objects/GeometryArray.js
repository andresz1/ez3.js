/**
 * @class GeometryArray
 */

EZ3.GeometryArray = function(config) {
  this._data = config.data || [];
  this._offset = config.offset || 0;
  this._stride = config.stride || 0;
  this._dynamic = config.dynamic || false;
  this._normalized = config.normalized || false;
  this.dirty = true;
};

EZ3.GeometryArray.prototype.constructor = EZ3.GeometryArray;

Object.defineProperty(EZ3.GeometryArray.prototype, 'data', {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.GeometryArray.prototype, 'offset', {
  get: function() {
    return this._offset;
  },
  set: function(offset) {
    this._offset = offset;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.GeometryArray.prototype, 'stride', {
  get: function() {
    return this._stride;
  },
  set: function(stride) {
    this._stride = stride;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.GeometryArray.prototype, 'dynamic', {
  get: function() {
    return this._dynamic;
  },
  set: function(dynamic) {
    this._dynamic = dynamic;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.GeometryArray.prototype, 'normalized', {
  get: function() {
    return this._normalized;
  },
  set: function(normalized) {
    this._normalized = normalized;
    this.dirty = true;
  }
});
