/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._index = {};
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, programAttributes, name) {
  var extension = gl.getExtension('OES_vertex_array_object');
  var k;

  if (extension) {
    if (!this._id)
      this._id = extension.createVertexArrayOES();

    extension.bindVertexArrayOES(this._id);

    for (k in this._vertex) {
      if(this._vertex[k].dirty) {
        this._vertex[k].bind(gl, programAttributes);
        this._vertex[k].update(gl);
        this._vertex[k].dirty = false;
      }
    }
  } else {
    for (k in this._vertex) {
      this._vertex[k].bind(gl, programAttributes);

      if(this._vertex[k].dirty) {
        this._vertex[k].update(gl);
        this._vertex[k].dirty = false;
      }
    }
  }

  if (name && this._index[name]) {
    this._index[name].bind(gl);

    if(this._index[name].dirty) {
      this._index[name].update(gl);
      this._index[name].dirty = false;
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