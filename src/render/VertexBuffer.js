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

EZ3.VertexBuffer.prototype.bind = function(gl, programAttributes) {
  var type = gl.FLOAT;
  var stride = this._stride;
  var bufferAttributes = this._attributes;
  var normalized;
  var offset;
  var layout;
  var size;
  var k;

  if(!(this._id && gl.isBuffer(this._id)))
    this._id = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, this._id);

  for (k in bufferAttributes) {
    layout = programAttributes[k];
    size = bufferAttributes[k].size;
    offset = bufferAttributes[k].offset;
    normalized = bufferAttributes[k].normalized;

    if (layout >= 0) {
      gl.enableVertexAttribArray(layout);
      gl.vertexAttribPointer(layout, size, type, normalized, stride, offset);
    }
  }
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  var bytes = 4;
  var hint = (this._dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var usage = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE);
  var length = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
  var offset;
  var array;
  var k;

  if ((bytes * this.data.length !== length) || (usage !== hint)) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), hint);
  } else {
    if(this.ranges.length) {
      for(k = 0; k < this.ranges.length; k++) {
        offset = this.ranges[k].left * 4;
        array = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(array));
      }
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(array));
    }
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
