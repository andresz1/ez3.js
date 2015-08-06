EZ3.Buffer = function() {

  this._buffer = [];
  this._bufferSize = {};
  this._bufferData = {};

  this._buffer[EZ3.Buffer.UV] = -1;
  this._buffer[EZ3.Buffer.INDEX] = -1;
  this._buffer[EZ3.Buffer.VERTEX] = -1;
  this._buffer[EZ3.Buffer.NORMAL] = -1;
  this._buffer[EZ3.Buffer.TANGENT] = -1;
  this._buffer[EZ3.Buffer.BITANGENT] = -1;

};

EZ3.Buffer.VERTEX = 0;
EZ3.Buffer.NORMAL = 1;
EZ3.Buffer.INDEX = 2;
EZ3.Buffer.UV = 3;
EZ3.Buffer.TANGENT = 4;
EZ3.Buffer.BITANGENT = 5;

EZ3.Buffer.VERTEX_LAYOUT = 0;
EZ3.Buffer.NORMAL_LAYOUT = 1;
EZ3.Buffer.UV_LAYOUT = 2;
EZ3.Buffer.TANGENT_LAYOUT = 3;
EZ3.Buffer.BITANGENT_LAYOUT = 4;

EZ3.Buffer.VERTEX_SIZE = 3;
EZ3.Buffer.NORMAL_SIZE = 3;
EZ3.Buffer.UV_SIZE = 2;
EZ3.Buffer.TANGENT_SIZE = 4;
EZ3.Buffer.BITANGENT_SIZE = 3;

EZ3.Buffer.prototype.fill = function(buffer, size, data) {
  this._bufferData[buffer] = data;
  this._bufferSize[buffer] = size;
};

EZ3.Buffer.prototype.draw = function(gl) {

  gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
  gl.enableVertexAttribArray(EZ3.Buffer.VERTEX_LAYOUT);
  gl.vertexAttribPointer(EZ3.Buffer.VERTEX_LAYOUT, EZ3.Buffer.VERTEX_SIZE, gl.FLOAT, false, 0, 0);

  if(this._bufferSize[EZ3.Buffer.NORMAL]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.enableVertexAttribArray(EZ3.Buffer.NORMAL_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.NORMAL_LAYOUT, EZ3.Buffer.NORMAL_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.UV]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.enableVertexAttribArray(EZ3.Buffer.UV_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.UV_LAYOUT, EZ3.Buffer.UV_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.TANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.TANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.TANGENT_LAYOUT, EZ3.Buffer.TANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.BITANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.BITANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.BITANGENT_LAYOUT, EZ3.Buffer.BITANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.INDEX]){
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.drawElements(gl.TRIANGLES, this._bufferSize[EZ3.Buffer.INDEX], gl.UNSIGNED_SHORT, 0);
  }else{
    gl.drawArrays(gl.TRIANGLES, 0, this._bufferSize[EZ3.Buffer.VERTEX] / 3);
  }

};

EZ3.Buffer.prototype.init = function(gl) {

  if(this._bufferSize[EZ3.Buffer.VERTEX]) {
    this._buffer[EZ3.Buffer.VERTEX] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.VERTEX]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.NORMAL]) {
    this._buffer[EZ3.Buffer.NORMAL] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.NORMAL]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.INDEX]) {
    this._buffer[EZ3.Buffer.INDEX] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._bufferData[EZ3.Buffer.INDEX]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.UV]) {
    this._buffer[EZ3.Buffer.UV] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.UV]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.TANGENT]) {
    this._buffer[EZ3.Buffer.TANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.TANGENT]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.BITANGENT]) {
    this._buffer[EZ3.Buffer.BITANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.BITANGENT]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

};