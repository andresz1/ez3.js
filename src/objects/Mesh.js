/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this._uv = null;
  this._color = null;
  this._index = null;
  this._normal = null;
  this._vertex = null;
  this._tangent = null;
  this._bitangent = null;

  this._material = (material instanceof EZ3.Material) ? material : null;
  this._geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype._setupBuffer = function(gl) {
  if (this._geometry) {

    var geometry = this._geometry;

    if (geometry.uvs.dirty) {
      geometry.uvs.dirty = false;

      if (!this._uv)
        this._uv = new EZ3.Buffer();

      this._uv.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.uvs, geometry.uvs.dynamic);
    }

    if (geometry.colors.dirty) {
      geometry.colors.dirty = false;

      if (!this._color)
        this._color = new EZ3.Buffer();

      this._color.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.colors, geometry.colors.dynamic);
    }

    if (geometry.normals.dirty) {
      geometry.normals.dirty = false;

      if (!this._normal)
        this._normal = new EZ3.Buffer();

      this._normal.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.normals, geometry.normals.dynamic);
    }

    if (geometry.vertices.dirty) {
      geometry.vertices.dirty = false;

      if (!this._vertex)
        this._vertex = new EZ3.Buffer();

      this._vertex.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.vertices, geometry.vertices.dynamic);
    }

    if (geometry.tangents.dirty) {
      geometry.tangents.dirty = false;

      if (!this._tangent)
        this._tangent = new EZ3.Buffer();

      this._tangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.tangents, geometry.tangents.dynamic);
    }

    if (geometry.bitangents.dirty) {
      geometry.bitangents.dirty = false;

      if (!this._bitangent)
        this._bitangent = new EZ3.Buffer();

      this._bitangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.bitangents, geometry.bitangents.dynamic);
    }

    if (geometry.indices.dirty) {
      geometry.indices.dirty = false;

      if (!this._index)
        this._index = new EZ3.Buffer();

      this._index.update(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT, geometry.indices, geometry.indices.dynamic);
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

EZ3.Mesh.prototype.render = function(gl) {
  if (this._geometry) {
    var geometry = this._geometry;
    var program = this._material.program;

    if (this._uv)
      this._uv.setup(gl, gl.ARRAY_BUFFER, program.attribute.uv, EZ3.Buffer.UV_LENGTH, gl.FLOAT, geometry.uvs.normalized, geometry.uvs.stride, geometry.uvs.offset);

    if (this._color)
      this._color.setup(gl, gl.ARRAY_BUFFER, program.attribute.color, EZ3.Buffer.COLOR_LENGTH, gl.FLOAT, geometry.colors.normalized, geometry.colors.stride, geometry.colors.offset);

    if (this._normal)
      this._normal.setup(gl, gl.ARRAY_BUFFER, program.attribute.normal, EZ3.Buffer.NORMAL_LENGTH, gl.FLOAT, geometry.normals.normalized, geometry.normals.stride, geometry.normals.offset);

    if (this._vertex)
      this._vertex.setup(gl, gl.ARRAY_BUFFER, program.attribute.vertex, EZ3.Buffer.VERTEX_LENGTH, gl.FLOAT, geometry.vertices.normalized, geometry.vertices.stride, geometry.vertices.offset);

    if (this._tangent)
      this._tangent.setup(gl, gl.ARRAY_BUFFER, program.attribute.tangent, EZ3.Buffer.TANGENT_LENGTH, gl.FLOAT, geometry.tangents.normalized, geometry.tangents.stride, geometry.tangents.offset);

    if (this._bitangent)
      this._bitangent.setup(gl, gl.ARRAY_BUFFER, program.attribute.bitangent, EZ3.Buffer.BITANGENT_LENGTH, gl.FLOAT, geometry.bitangents.normalized, geometry.bitangents.stride, geometry.bitangents.offset);

    if (this._index && this._index.data.length) {
      this._index.setup(gl, gl.ELEMENT_ARRAY_BUFFER);
      gl.drawElements(gl.TRIANGLES, this._index.data.length, gl.UNSIGNED_SHORT, 0);
    } else if (this._vertex && this._vertex.data.length)
      gl.drawArrays(gl.TRIANGLES, 0, this._vertex.data.length / 3);
  }
};

Object.defineProperty(EZ3.Mesh.prototype, "material", {
  get: function() {
    return this._material;
  },
  set: function(material) {
    if (material instanceof EZ3.Material) {
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
    if (geometry instanceof EZ3.Geometry)
      this._geometry = geometry;
  }
});

EZ3.Mesh.prototype.setup = function(gl) {
  this._setupProgram(gl);
  this._setupBuffer(gl);
};
