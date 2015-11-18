/**
 * @class VertexBuffer
 * @extends Buffer
 */

EZ3.VertexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  this._attributes = {};
  this._stride = 0;
};

EZ3.VertexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.VertexBuffer.prototype.constructor = EZ3.VertexBuffer;

EZ3.VertexBuffer.prototype.isValid = function(gl, attributes) {
  var k;

  for (k in this._attributes)
    if (attributes[k] >= 0)
      return true;

  return false;
};

EZ3.VertexBuffer.prototype.bind = function(gl, attributes, state) {
  var type = gl.FLOAT;
  var normalized;
  var offset;
  var layout;
  var size;
  var k;

  EZ3.Buffer.prototype.bind.call(this, gl, gl.ARRAY_BUFFER);

  for (k in this._attributes) {
    layout = attributes[k];
    size = this._attributes[k].size;
    offset = this._attributes[k].offset;
    normalized = this._attributes[k].normalized;

    if (layout >= 0) {
      if (state) {
        if (!state.attribute[layout]) {
          gl.enableVertexAttribArray(layout);
          state.attribute[layout] = true;
        }
        gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
      } else {
        gl.enableVertexAttribArray(layout);
        gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
      }
    }
  }
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  EZ3.Buffer.prototype.update.call(this, gl, gl.ARRAY_BUFFER, 4);
};

EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  this._stride += 4 * attribute.size;
  this._attributes[name] = attribute;
};
