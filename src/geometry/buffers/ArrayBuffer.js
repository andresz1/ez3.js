/**
 * @class EZ3.ArrayBuffer
 * @constructor
 */
EZ3.ArrayBuffer = function() {
  /**
   * @property {WebGLId} _id
   * @private
   */
  this._id = null;
  /**
   * @property {EZ3.IndexBuffer} _triangular
   * @private
   */
  this._triangular = null;
  /**
   * @property {EZ3.IndexBuffer} _linear
   * @private
   */
  this._linear = null;
  /**
   * @property {Object} _triangular
   * @private
   */
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

/**
 * @method EZ3.ArrayBuffer#bind
 * @param {WebGLContext} gl
 * @param {Object} attributes
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererExtensions} extensions
 * @param {Number} index
 */
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

/**
 * @method EZ3.ArrayBuffer#setLines
 * @param {Number[]} [data]
 * @param {Boolean} [need32Bits]
 * @param {Boolean} [dynamic]
 * @return {EZ3.IndexBuffer}
 */
EZ3.ArrayBuffer.prototype.setLines = function(data, need32Bits, dynamic) {
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
};

/**
 * @method EZ3.ArrayBuffer#setTriangles
 * @param {Number[]} [data]
 * @param {Boolean} [need32Bits]
 * @param {Boolean} [dynamic]
 * @return {EZ3.IndexBuffer}
 */
EZ3.ArrayBuffer.prototype.setTriangles = function(data, need32Bits, dynamic) {
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
};

/**
 * @method EZ3.ArrayBuffer#setPositions
 * @param {Number[]} [data]
 * @param {Boolean} [dynamic]
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.setPositions = function(data, dynamic) {
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

/**
 * @method EZ3.ArrayBuffer#setNormals
 * @param {Number[]} [data]
 * @param {Boolean} [dynamic]
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.setNormals = function(data, dynamic) {
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

/**
 * @method EZ3.ArrayBuffer#setUVs
 * @param {Number[]} [data]
 * @param {Boolean} [dynamic]
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.setUVs = function(data, dynamic) {
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

/**
 * @method EZ3.ArrayBuffer#setVertexBuffer
 * @param {String} name
 * @param {EZ3.VertexBuffer} buffer
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.setVertexBuffer = function(name, buffer) {
  this._vertex[name] = buffer;

  return buffer;
};

/**
 * @method EZ3.ArrayBuffer#getTriangles
 * @return {EZ3.IndexBuffer}
 */
EZ3.ArrayBuffer.prototype.getTriangles = function() {
  return this._triangular;
};

/**
 * @method EZ3.ArrayBuffer#getLines
 * @return {EZ3.IndexBuffer}
 */
EZ3.ArrayBuffer.prototype.getLines = function() {
  return this._linear;
};

/**
 * @method EZ3.ArrayBuffer#getPositions
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.getPositions = function() {
  return this._vertex.position;
};

/**
 * @method EZ3.ArrayBuffer#getNormals
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.getNormals = function() {
  return this._vertex.normal;
};

/**
 * @method EZ3.ArrayBuffer#getUVs
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.getUVs = function() {
  return this._vertex.uv;
};

/**
 * @method EZ3.ArrayBuffer#getVertexBuffer
 * @return {EZ3.VertexBuffer}
 */
EZ3.ArrayBuffer.prototype.getVertexBuffer = function(name) {
  return this._vertex[name];
};
