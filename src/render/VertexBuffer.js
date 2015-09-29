/**
 * @class VertexBuffer
 * @extends Buffer
 */

EZ3.VertexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);
  this._stride = 0;
  this._attributes = {};
};

EZ3.VertexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.VertexBuffer.prototype.constructor = EZ3.VertexBuffer;

EZ3.VertexBuffer.prototype._create = function(gl) {
  var hint = (this._dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

  this._id = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this._id);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), hint);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

EZ3.VertexBuffer.prototype.bind = function(gl, programAttributes) {
  var type = gl.FLOAT;
  var stride = this._stride;
  var bufferAttributes = this._attributes;
  var normalized;
  var offset;
  var layout;
  var size;
  var k;

  gl.bindBuffer(gl.ARRAY_BUFFER, this._id);

  for (k in bufferAttributes) {
    layout = programAttributes[k];
    size = bufferAttributes[k].size;
    offset = bufferAttributes[k].offset;
    normalized = bufferAttributes[k].normalized;

    if (location >= 0) {
      gl.enableVertexAttribArray(layout);
      gl.vertexAttribPointer(layout, size, type, normalized, stride, offset);
    }
  }
};

EZ3.VertexBuffer.prototype.unbind = function(gl) {
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  var bytes = 4;
  var usage;
  var length;
  var dispose;

  if (this._id && gl.isBuffer(this._id)) {

    gl.bindBuffer(gl.ARRAY_BUFFER, this._id);
    usage = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE);
    length = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);

    dispose = bytes * this.data.length !== length;
    dispose = dispose || ((usage === gl.STATIC_DRAW) && this._dynamic);
    dispose = dispose || ((usage === gl.DYNAMIC_DRAW) && !this._dynamic);

    if (dispose) {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.deleteBuffer(this._id);
      this._create(gl);
    } else if (this._dynamic) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.data));
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  } else {
    this._create(gl);
  }
};

EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  if (attribute instanceof EZ3.VertexBufferAttribute) {
    this._stride += 4 * attribute.size;
    this._attributes[name] = attribute;
  }
};

EZ3.VertexBuffer.prototype.getAttribute = function(name) {
  return this._attributes[name];
};
