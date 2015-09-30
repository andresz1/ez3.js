/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._index = {};
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, programAttributes) {
  var extension = gl.getExtension('OES_vertex_array_object');
  var k;

  if (extension) {
    extension.bindVertexArrayOES(this._id);
  } else {
    for (k in this._vertex)
      this._vertex[k].bind(gl, programAttributes);
  }
};

EZ3.ArrayBuffer.prototype.unbind = function(gl) {
  var extension = gl.getExtension('OES_vertex_array_object');
  var k;

  if (extension) {
    extension.bindVertexArrayOES(null);
  } else {
    for (k = 0; k < this._vertex.length; k++)
      this._vertex[k].unbind(gl);
  }
};

EZ3.ArrayBuffer.prototype.render = function(gl, mode, name) {
  if(this._index[name]) {
    this._index[name].bind(gl);
    this._index[name].render(gl, mode);
    this._index[name].unbind(gl);
  } else {
    this._vertex[name].render(gl, mode);
  }
};

EZ3.ArrayBuffer.prototype.add = function(name, buffer) {
  if (buffer instanceof EZ3.IndexBuffer)
    this._index[name] = buffer;
   else if (buffer instanceof EZ3.VertexBuffer)
    this._vertex[name] = buffer;
};

EZ3.ArrayBuffer.prototype.update = function(gl, programAttributes) {
  var extension = gl.getExtension('OES_vertex_array_object');
  var k;

  if(extension) {

    if(!this._id)
      this._id = extension.createVertexArrayOES();

    extension.bindVertexArrayOES(this._id);

    for(k in this._index)
      if(this._index[k].dirty) {
        this._index[k].update(gl);
        this._index[k].dirty = false;
      }

    for(k in this._vertex)
      if(this._vertex[k].dirty) {
        this._vertex[k].update(gl);
        this._vertex[k].bind(gl, programAttributes);
        this._vertex[k].dirty = false;
      }

    extension.bindVertexArrayOES(null);

  } else {

    for(k in this._index)
      if(this._index[k].dirty) {
        this._index[k].update(gl);
        this._index[k].dirty = false;
      }

    for(k in this._vertex)
      if(this._vertex[k].dirty) {
        this._vertex[k].update(gl);
        this._vertex[k].dirty = false;
      }
  }
};

EZ3.ArrayBuffer.prototype.get = function(name) {
  if(this._index[name] !== undefined)
    return this._index[name];
  else
    return this._vertex[name];
};
