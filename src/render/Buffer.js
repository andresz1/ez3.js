/**
 * @class Buffer
 */

EZ3.Buffer = function(data, dynamic) {
  this._id = null;
  this._ranges = [];
  this._data = data || [];
  this._dynamic = dynamic || false;
  this.dirty = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

Object.defineProperty(EZ3.Buffer.prototype, 'data', {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Buffer.prototype, 'ranges', {
  get: function() {
    return this._ranges;
  },
  set: function(ranges) {
    this._ranges = ranges;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Buffer.prototype, 'dynamic', {
  get: function() {
    return this._dynamic;
  },
  set: function(dynamic) {
    this._dynamic = dynamic;
    this.dirty = true;
  }
});
