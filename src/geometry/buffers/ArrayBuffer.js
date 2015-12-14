/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._triangular = null;
  this._linear = null;
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, attributes, state, extensions, index) {
  var buffer;
  var k;

  if (extensions.vertexArrayObject) {
    if (!this._id)
      this._id = extensions.vertexArrayObject.createVertexArrayOES();

    extensions.vertexArrayObject.bindVertexArrayOES(this._id);

    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes) && buffer.needUpdate) {
        buffer.bind(gl, attributes);
        buffer.update(gl);
        buffer.needUpdate = false;
      }
    }
  } else {
    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes)) {
        buffer.bind(gl, attributes, state);

        if (buffer.needUpdate) {
          buffer.update(gl);
          buffer.needUpdate = false;
        }
      }
    }
  }

  if (index === EZ3.IndexBuffer.TRIANGULAR)
    buffer = this._triangular;
  else if (index === EZ3.IndexBuffer.LINEAR)
    buffer = this._linear;
  else
    return;

  buffer.bind(gl);

  if (buffer.needUpdate) {
    buffer.update(gl, extensions);
    buffer.needUpdate = false;
  }
};

EZ3.ArrayBuffer.prototype.addLinearBuffer = function(data, need32Bits, dynamic) {
  var buffer = this._linear;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;
    need32Bits = (need32Bits !== undefined) ? need32Bits : false;

    buffer = new EZ3.IndexBuffer(data, dynamic, need32Bits);
    this._linear = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    if (need32Bits !== undefined)
      buffer.need32Bits = need32Bits;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addTriangularBuffer = function(data, need32Bits, dynamic) {
  var buffer = this._triangular;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;
    need32Bits = (need32Bits !== undefined) ? need32Bits : false;

    buffer = new EZ3.IndexBuffer(data, dynamic, need32Bits);
    this._triangular = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    if (need32Bits !== undefined)
      buffer.need32Bits = need32Bits;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addPositionBuffer = function(data, dynamic) {
  var buffer = this._vertex.position;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
    this._vertex.position = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addNormalBuffer = function(data, dynamic) {
  var buffer = this._vertex.normal;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
    this._vertex.normal = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addUvBuffer = function(data, dynamic) {
  var buffer = this._vertex.uv;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    this._vertex.uv = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addVertexBuffer = function(name, buffer) {
  this._vertex[name] = buffer;

  return buffer;
};

EZ3.ArrayBuffer.prototype.getTriangularBuffer = function() {
  return this._triangular;
};

EZ3.ArrayBuffer.prototype.getLinearBuffer = function() {
  return this._linear;
};

EZ3.ArrayBuffer.prototype.getPositionBuffer = function() {
  return this._vertex.position;
};

EZ3.ArrayBuffer.prototype.getNormalBuffer = function() {
  return this._vertex.normal;
};

EZ3.ArrayBuffer.prototype.getUvBuffer = function() {
  return this._vertex.uv;
};

EZ3.ArrayBuffer.prototype.getVertexBuffer = function(name) {
  return this._vertex[name];
};
