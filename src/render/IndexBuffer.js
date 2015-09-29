/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

EZ3.IndexBuffer.prototype._create = function(gl) {
  var extension = gl.getExtension('OES_element_index_uint');
  var hint = (this._dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var data;

  if (extension)
    data = new Uint32Array(this.data);
  else
    data = new Uint16Array(this.data);

  this._id = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, hint);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

EZ3.IndexBuffer.prototype.bind = function(gl) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
};

EZ3.IndexBuffer.prototype.unbind = function(gl) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

EZ3.IndexBuffer.prototype.render = function(gl, mode) {
  var length = this.data.length;
  var extension = gl.getExtension('OES_element_index_uint');
  var type = (extension) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

  gl.drawElements(mode, length, type, 0);
};

EZ3.IndexBuffer.prototype.update = function(gl) {
  var extension = gl.getExtension('OES_element_index_uint');
  var data;
  var bytes;
  var usage;
  var length;
  var dispose;

  if(this._id && gl.isBuffer(this._id)) {
    bytes = (extension) ? 4 : 2;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
    usage = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_USAGE);
    length = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE);

    dispose = bytes * this.data.length !== length;
    dispose = dispose || ((usage === gl.STATIC_DRAW) && this._dynamic);
    dispose = dispose || ((usage === gl.DYNAMIC_DRAW) && !this._dynamic);

    if(dispose) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.deleteBuffer(this._id);
      this._create(gl);
    } else {
      if(this._dynamic) {
        if (extension)
          data = new Uint32Array(this.data);
        else
          data = new Uint16Array(this.data);

        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, data);
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  } else {
    this._create(gl);
  }
};
