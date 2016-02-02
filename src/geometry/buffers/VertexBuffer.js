/**
 * @class EZ3.VertexBuffer
 * @extends EZ3.Buffer
 * @constructor
 * @param {Number[]} [data]
 * @param {Boolean} [need32Bits]
 */
EZ3.VertexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  /**
   * @property {Object} _attributes
   * @default {}
   * @private
   */
  this._attributes = {};
  /**
   * @property {Number} _stride
   * @private
   * @default 0
   */
  this._stride = 0;
};

EZ3.VertexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.VertexBuffer.prototype.constructor = EZ3.VertexBuffer;

/**
 * @method EZ3.VertexBuffer#isValid
 * @param {WebGLContext} gl
 * @param {Object} attributes
 * @return {Boolean}
 */
EZ3.VertexBuffer.prototype.isValid = function(gl, attributes) {
  var k;

  for (k in this._attributes)
    if (attributes[k] >= 0)
      return true;

  return false;
};

/**
 * @method EZ3.VertexBuffer#bind
 * @param {WebGLContext} gl
 * @param {Object} attributes
 * @param {EZ3.RendererState} state
 */
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
      if (state)
        state.enableVertexAttribArray(layout);
      else
        gl.enableVertexAttribArray(layout);
      gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
    }
  }
};

/**
 * @method EZ3.VertexBuffer#update
 * @param {WebGLContext} gl
 */
EZ3.VertexBuffer.prototype.update = function(gl) {
  EZ3.Buffer.prototype.update.call(this, gl, gl.ARRAY_BUFFER, 4);
};

/**
 * @method EZ3.VertexBuffer#addAttribute
 * @param {String} name
 * @param {EZ3.VertexBufferAttribute} attribute
 */
EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  this._stride += 4 * attribute.size;
  this._attributes[name] = attribute;
};
