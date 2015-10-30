/**
 * @class Buffer
 */

EZ3.Buffer = function(data, dynamic) {
  this._id = null;

  this.ranges = [];
  this.data = data || [];
  this.dynamic = dynamic || false;
  this.usage = null;
  this.length = null;
  this.dirty = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;
