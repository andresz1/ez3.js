/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._index = {};
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, attributes, index) {
  var extension = gl.getExtension('OES_vertex_array_object');
  var buffer;
  var k;

  if (extension) {
    if (!this._id)
      this._id = extension.createVertexArrayOES();

    extension.bindVertexArrayOES(this._id);

    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes) && buffer.dirty) {
        buffer.bind(gl, attributes);
        buffer.update(gl);
        buffer.dirty = false;
      }
    }
  } else {
    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes)) {
        buffer.bind(gl, attributes);

        if (buffer.dirty) {
          buffer.update(gl);
          buffer.dirty = false;
        }
      }
    }
  }

  if (index) {
    index.bind(gl);

    if (index.dirty) {
      index.update(gl);
      index.dirty = false;
    }
  }
};

EZ3.ArrayBuffer.prototype.add = function(name, buffer) {
  if (buffer instanceof EZ3.IndexBuffer)
    this._index[name] = buffer;
  else if (buffer instanceof EZ3.VertexBuffer)
    this._vertex[name] = buffer;
};

EZ3.ArrayBuffer.prototype.get = function(name) {
  if (this._index[name])
    return this._index[name];
  else
    return this._vertex[name];
};
