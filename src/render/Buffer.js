/**
 * @class Buffer
 */

EZ3.Buffer = function() {
  this._size = [];
  this._buffer = [];
  this._layout = [];

  this._size[EZ3.Buffer.UV] = 2;
  this._size[EZ3.Buffer.VERTEX] = 3;
  this._size[EZ3.Buffer.NORMAL] = 3;
  this._size[EZ3.Buffer.TANGENT] = 4;
  this._size[EZ3.Buffer.BITANGENT] = 3;

  this._buffer[EZ3.Buffer.UV] = -1;
  this._buffer[EZ3.Buffer.INDEX] = -1;
  this._buffer[EZ3.Buffer.VERTEX] = -1;
  this._buffer[EZ3.Buffer.NORMAL] = -1;
  this._buffer[EZ3.Buffer.TANGENT] = -1;
  this._buffer[EZ3.Buffer.BITANGENT] = -1;

  this._layout[EZ3.Buffer.UV] = -1;
  this._layout[EZ3.Buffer.VERTEX] = -1;
  this._layout[EZ3.Buffer.NORMAL] = -1;
  this._layout[EZ3.Buffer.TANGENT] = -1;
  this._layout[EZ3.Buffer.BITANGENT] = -1;
};

EZ3.Buffer.prototype.draw = function(gl, draw, size) {
  if (~this._buffer[EZ3.Buffer.BITANGENT] && ~this._layout[EZ3.Buffer.BITANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.enableVertexAttribArray(this._layout[EZ3.Buffer.BITANGENT]);
    gl.vertexAttribPointer(this._layout[EZ3.Buffer.BITANGENT], this._size[EZ3.Buffer.BITANGENT], gl.FLOAT, false, 0, 0);
  }

  if (~this._buffer[EZ3.Buffer.TANGENT] && ~this._layout[EZ3.Buffer.TANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.enableVertexAttribArray(this._layout[EZ3.Buffer.TANGENT]);
    gl.vertexAttribPointer(this._layout[EZ3.Buffer.TANGENT], this._size[EZ3.Buffer.TANGENT], gl.FLOAT, false, 0, 0);
  }

  if (~this._buffer[EZ3.Buffer.UV] && ~this._layout[EZ3.Buffer.UV]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.enableVertexAttribArray(this._layout[EZ3.Buffer.UV]);
    gl.vertexAttribPointer(this._layout[EZ3.Buffer.UV], this._size[EZ3.Buffer.UV], gl.FLOAT, false, 0, 0);
  }

  if (~this._buffer[EZ3.Buffer.NORMAL] && ~this._layout[EZ3.Buffer.NORMAL]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.enableVertexAttribArray(this._layout[EZ3.Buffer.NORMAL]);
    gl.vertexAttribPointer(this._layout[EZ3.Buffer.NORMAL], this._size[EZ3.Buffer.NORMAL], gl.FLOAT, false, 0, 0);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
  gl.enableVertexAttribArray(this._layout[EZ3.Buffer.VERTEX]);
  gl.vertexAttribPointer(this._layout[EZ3.Buffer.VERTEX], this._size[EZ3.Buffer.VERTEX], gl.FLOAT, false, 0, 0);

  if (draw === EZ3.ELEMENTS_DRAW) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
  } else {
    gl.drawArrays(gl.TRIANGLES, 0, size / 3);
  }
};

EZ3.Buffer.prototype.setup = function(gl, id, size, data, hint) {
  if (id === EZ3.Buffer.VERTEX) {

    this._buffer[EZ3.Buffer.VERTEX] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  } else if (id === EZ3.Buffer.NORMAL) {

    this._buffer[EZ3.Buffer.NORMAL] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  } else if (id === EZ3.Buffer.UV) {

    this._buffer[EZ3.Buffer.UV] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  } else if (id === EZ3.Buffer.TANGENT) {

    this._buffer[EZ3.Buffer.TANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  } else if (id === EZ3.Buffer.BITANGENT) {

    this._buffer[EZ3.Buffer.BITANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  } else if (id == EZ3.Buffer.INDEX) {

    this._buffer[EZ3.Buffer.INDEX] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), hint);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  }
};

EZ3.Buffer.prototype.setupLayout = function(buffer, layout) {
  if(layout !== undefined)
    this._layout[buffer] = layout;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

EZ3.Buffer.VERTEX = 0;
EZ3.Buffer.NORMAL = 1;
EZ3.Buffer.INDEX = 2;
EZ3.Buffer.UV = 3;
EZ3.Buffer.TANGENT = 4;
EZ3.Buffer.BITANGENT = 5;
