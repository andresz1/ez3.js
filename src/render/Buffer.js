/**
 * @class Buffer
 */

EZ3.Buffer = function() {
  this._id = null;
  this._data = [];
};

Object.defineProperty(EZ3.Buffer.prototype, "id", {
  get: function() {
    return this._id;
  }
});

Object.defineProperty(EZ3.Buffer.prototype, "data", {
  get: function() {
    return this._data;
  },
  set: function(data) {
    this._data = data;
  }
});

EZ3.Buffer.prototype.setup = function(gl, bufferType, layout, unitLength, dataType, normalized, stride, pointer) {
  gl.bindBuffer(bufferType, this._id);
  if(layout !== undefined) {
    gl.enableVertexAttribArray(layout);
    gl.vertexAttribPointer(layout, unitLength, dataType, normalized, stride, pointer);
  }
};

EZ3.Buffer.prototype.update = function(gl, bufferType, dataType, data, hint) {
  if (data && data.length) {

    this._data = data;

    if (hint === gl.STATIC_DRAW) {

      if (!this._id) {

        this._id = gl.createBuffer();

        gl.bindBuffer(bufferType, this._id);

        if(dataType === gl.FLOAT)
          gl.bufferData(bufferType, new Float32Array(data), gl.STATIC_DRAW);
        else
          gl.bufferData(bufferType, new Uint16Array(data), gl.STATIC_DRAW);

        gl.bindBuffer(bufferType, null);

      }

    } else if (hint === gl.DYNAMIC_DRAW) {

      if (!this._id) {

        this._id = gl.createBuffer();

        gl.bindBuffer(bufferType, this._id);

        if(dataType === gl.FLOAT)
          gl.bufferData(bufferType, new Float32Array(data), gl.DYNAMIC_DRAW);
        else
          gl.bufferData(bufferType, new Uint16Array(data), gl.DYNAMIC_DRAW);

        gl.bindBuffer(bufferType, null);

      } else {

        gl.bindBuffer(bufferType, this._id);

        if(dataType === gl.FLOAT)
          gl.bufferSubData(bufferType, 0, new Float32Array(data));
        else
          gl.bufferSubData(bufferType, 0, new Uint16Array(data));

        gl.bindBuffer(bufferType, null);

      }
    }
  }
};

EZ3.Buffer.UV_LENGTH = 2;
EZ3.Buffer.COLOR_LENGTH = 3;
EZ3.Buffer.VERTEX_LENGTH = 3;
EZ3.Buffer.NORMAL_LENGTH = 3;
EZ3.Buffer.TANGENT_LENGTH = 4;
EZ3.Buffer.BITANGENT_LENGTH = 3;
