/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this._uv = new EZ3.Buffer();
  this._color = new EZ3.Buffer();
  this._index = new EZ3.Buffer();
  this._normal = new EZ3.Buffer();
  this._vertex = new EZ3.Buffer();
  this._tangent = new EZ3.Buffer();
  this._bitangent = new EZ3.Buffer();

  this._dynamic = false;
  this._material = (material instanceof EZ3.Material) ? material : null;
  this._geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype._setupBuffer = function(gl) {
  if (this._geometry) {

    if (this._geometry.uvs.dirty) {
      this._geometry.uvs.dirty = false;
      this._uv.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.uvs, gl.STATIC_DRAW);
    }

    if(this._geometry.colors.dirty) {
      this._geometry.colors.dirty = false;
      this._color.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.colors, gl.STATIC_DRAW);
    }

    if(this._geometry.normals.dity) {
      this._geometry.normals.dirty = false;
      this._normal.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.normals, gl.STATIC_DRAW);
    }

    if(this._geometry.vertices.dirty) {
      this._geometry.vertices.dirty = false;
      this._vertex.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.vertices, gl.STATIC_DRAW);
    }

    if(this._geometry.tangents.dirty) {
      this._geometry.tangents.dirty = false;
      this._tangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.tangents, gl.STATIC_DRAW);
    }

    if(this._geometry.bitangents.dirty) {
      this._geometry.bitangents.dirty = false;
      this._bitangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, this._geometry.bitangents, gl.STATIC_DRAW);
    }

    if(this._geometry.indices.dirty) {
      this._geometry.indices.dirty = false;
      this._index.update(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT, this._geometry.indices, gl.STATIC_DRAW);
    }
  }
};

EZ3.Mesh.prototype._setupProgram = function(gl) {
  if (this._material.dirty) {
    this._material.dirty = false;

    var programBuilder = new EZ3.GLSLProgramBuilder();
    this._material.program = programBuilder.buildProgram(gl, this._material);
  }
};

Object.defineProperty(EZ3.Mesh.prototype, "material", {
  get: function() {
    return this._material;
  },
  set: function(material) {
    if(material instanceof EZ3.Material){
      this._material = material;
      this._material.dirty = true;
    }
  }
});

Object.defineProperty(EZ3.Mesh.prototype, "geometry", {
  get: function() {
    return this._geometry;
  },
  set: function(geometry) {
    if(geometry instanceof EZ3.Geometry)
      this._geometry = geometry;
  }
});

EZ3.Mesh.prototype.setup = function(gl) {
  this._setupProgram(gl);
  this._setupBuffer(gl);
};

EZ3.Mesh.prototype.render = function(gl) {
  var program = this._material.program;

  if(this._index.id)
    this._index.setup(gl, gl.ELEMENT_ARRAY_BUFFER);

  if (this._uv.id && (typeof program.uvLayout !== undefined))
    this._uv.setup(gl, gl.ARRAY_BUFFER, program.uvLayout, EZ3.Buffer.UV_LENGTH, gl.FLOAT, false, 0, 0);

  if (this._color.id && (typeof program.colorLayout !== undefined))
    this._color.setup(gl, gl.ARRAY_BUFFER, program.colorLayout, EZ3.Buffer.COLOR_LENGTH, gl.FLOAT, false, 0, 0);

  if(this._normal.id && (typeof program.normalLayout !== undefined))
    this._normal.setup(gl, gl.ARRAY_BUFFER, program.normalLayout, EZ3.Buffer.NORMAL_LENGTH, gl.FLOAT, false, 0, 0);

  if(this._vertex.id && (typeof program.vertexLayout !== undefined))
    this._vertex.setup(gl, gl.ARRAY_BUFFER, program.vertexLayout, EZ3.Buffer.VERTEX_LENGTH, gl.FLOAT, false, 0, 0);

  if(this._tangent.id && (typeof program.tangentLayout !== undefined))
    this._tangent.setup(gl, gl.ARRAY_BUFFER, program.tangentLayout, EZ3.Buffer.TANGENT_LENGTH, gl.FLOAT, false, 0, 0);

  if(this._bitangent.id && (typeof program.bitangentLayout !== undefined))
    this._bitangent.setup(gl, gl.ARRAY_BUFFER, program.bitangentLayout, EZ3.Buffer.BITANGENT_LENGTH, gl.FLOAT, false, 0, 0);

  if(this._index.id)
    gl.drawElements(gl.TRIANGLES, this._index.data.length, gl.UNSIGNED_SHORT, 0);
  else if(this._vertex.id)
    gl.drawArrays(gl.TRIANGLES, 0, this._vertex.data.length / 3);
};
