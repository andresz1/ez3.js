EZ3.Mesh = function(data) {
  EZ3.Entity.call(this);

  this._buffer = new EZ3.Buffer();
  this.dynamic = data.dynamic || false;
  this.material = data.material || null;
  this.geometry = (data.geometry instanceof EZ3.Geometry) ? data.geometry : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.init = function(gl) {
  var hint = (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

  if(this.geometry.verticesNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.VERTEX, this.geometry.vertices.length, this.geometry.vertices, hint);
    this.geometry.verticesNeedUpdate = false;
  }

  if(this.geometry.normalsNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.NORMAL, this.geometry.normals.length, this.geometry.normals, hint);
    this.geometry.normalsNeedUpdate = false;
  }

  if(this.geometry.uvNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.UV, this.geometry.uv.length, this.geometry.uv, hint);
    this.geometry.uvNeedUpdate = false;
  }

  if(this.geometry.tangentsNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.TANGENTS, this.geometry.tangents.length, this.geometry.tangents, hint);
    this.geometry.tangentNeedUpdate = false;
  }

  if(this.geometry.bitangentsNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.BITANGENTS, this.geometry.bitangents.length, this.geometry.bitangents, hint);
    this.geometry.bitangentsNeedUpdate = false;
  }

  if(this.geometry.indicesNeedUpdate){
    this._buffer.init(gl, EZ3.Buffer.INDEX, this.geometry.indices.length, this.geometry.indices, hint);
    this.geometry.indicesNeedUpdate = false;
  }
};

EZ3.Mesh.prototype.draw = function(gl) {
  if(this.geometry.indices.length){
    this._buffer.draw(gl, EZ3.ELEMENTS_DRAW, this.geometry.indices.length);
  }else{
    this._buffer.draw(gl, EZ3.ARRAYS_DRAW, this.geometry.vertices.length);
  }
};
