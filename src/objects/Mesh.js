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

  this._geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
  this._material = (material instanceof EZ3.MeshMaterial) ? material : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype._setupProgram = function(gl) {
  if (this.material.dirty) {
    this.material.dirty = false;
    this.material.program = new EZ3.GLSLProgram(gl, this.material.config);
  }
};

EZ3.Mesh.prototype._setupGeometryBuffers = function(gl) {
  if (this._geometry) {

    var geometry = this._geometry;

    if (geometry.uvs.dirty) {
      geometry.uvs.dirty = false;

      if (!this._uv)
        this._uv = new EZ3.BufferGeometry();

      this._uv.update(gl, {
        type: gl.FLOAT,
        data: geometry.uvs,
        target: gl.ARRAY_BUFFER,
        dynamic: geometry.uvs.dynamic
      });
    }

    if (geometry.colors.dirty) {
      geometry.colors.dirty = false;

      if (!this._color)
        this._color = new EZ3.BufferGeometry();

      this._color.update(gl, {
        type: gl.FLOAT,
        data: geometry.colors,
        target: gl.ARRAY_BUFFER,
        dynamic: geometry.colors.dynamic
      });
    }

    if (geometry.normals.dirty) {
      geometry.normals.dirty = false;

      if (!this._normal)
        this._normal = new EZ3.BufferGeometry();

      this._normal.update(gl, {
        type: gl.FLOAT,
        data: geometry.normals,
        target: gl.ARRAY_BUFFER,
        dynamic: geometry.normals.dynamic
      });
    }

    if (geometry.vertices.dirty) {
      geometry.vertices.dirty = false;

      if (!this._vertex)
        this._vertex = new EZ3.BufferGeometry();

      this._vertex.update(gl, {
        type: gl.FLOAT,
        data: geometry.vertices,
        target: gl.ARRAY_BUFFER,
        dynamic: geometry.vertices.dynamic
      });
    }

    if (geometry.tangents.dirty) {
      geometry.tangents.dirty = false;

      if (!this._tangent)
        this._tangent = new EZ3.BufferGeometry();

      this._tangent.update(gl, {
        type: gl.FLOAT,
        data: geometry.tangents,
        target: gl.ARRAY_BUFFER,
        dynamic: geometry.tangents.dynamic
      });
    }

    if (geometry.bitangents.dirty) {
      geometry.bitangents.dirty = false;

      if (!this._bitangent)
        this._bitangent = new EZ3.BufferGeometry();

      this._bitangent.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.bitangents,
        dynamic: geometry.bitangents.dynamic
      });
    }

    if (geometry.indices.dirty) {
      geometry.indices.dirty = false;

      if (!this._index)
        this._index = new EZ3.BufferGeometry();

      this._index.update(gl, {
        data: geometry.indices,
        type: gl.UNSIGNED_SHORT,
        target: gl.ELEMENT_ARRAY_BUFFER,
        dynamic: geometry.indices.dynamic
      });
    }
  }
};

EZ3.Mesh.prototype.render = function(gl) {
  if (this._geometry) {

    var length;
    var material = this.material;
    var geometry = this.geometry;
    var program = material.program;

    if (this._uv) {
      this._uv.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.uvs.offset,
        stride: geometry.uvs.stride,
        layout: program.attribute.uv,
        normalized: geometry.uvs.normalized,
        length: EZ3.BufferGeometry.UV_LENGTH
      });
    }

    if (this._color) {
      this._color.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.colors.offset,
        stride: geometry.colors.stride,
        layout: program.attribute.color,
        normalized: geometry.colors.normalized,
        length: EZ3.BufferGeometry.COLOR_LENGTH
      });
    }

    if (this._normal) {
      this._normal.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.normals.offset,
        stride: geometry.normals.stride,
        layout: program.attribute.normal,
        normalized: geometry.normals.normalized,
        length: EZ3.BufferGeometry.NORMAL_LENGTH
      });
    }

    if (this._vertex) {
      this._vertex.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.vertices.offset,
        stride: geometry.vertices.stride,
        layout: program.attribute.vertex,
        normalized: geometry.vertices.normalized,
        length: EZ3.BufferGeometry.VERTEX_LENGTH
      });
    }

    if (this._tangent) {
      this._tangent.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.tangents.offset,
        stride: geometry.tangents.stride,
        layout: program.attribute.tangent,
        normalized: geometry.tangents.normalized,
        length: EZ3.BufferGeometry.TANGENT_LENGTH
      });
    }

    if (this._bitangent) {
      this._bitangent.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.bitangents.offset,
        stride: geometry.bitangents.stride,
        layout: program.attribute.bitangent,
        normalized: geometry.bitangents.normalized,
        length: EZ3.BufferGeometry.BITANGENT_LENGTH
      });
    }

    if (this._index && geometry.indices.length) {
      length = geometry.indices.length;

      this._index.setup(gl, {
        target: gl.ELEMENT_ARRAY_BUFFER
      });

      if(material.fill === EZ3.MeshMaterial.SOLID)
        gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);

      else if(material.fill === EZ3.MeshMaterial.POINTS)
        gl.drawElements(gl.POINTS, length, gl.UNSIGNED_SHORT, 0);

      else if(material.fill === EZ3.MeshMaterial.WIREFRAME)
        gl.drawElements(gl.LINES, length, gl.UNSIGNED_SHORT, 0);
    }

    else if (this._vertex && geometry.vertices.length) {
      length = geometry.vertices.length / 3;

      if(material.fill === EZ3.MeshMaterial.SOLID)
        gl.drawArrays(gl.TRIANGLES, 0, length);

      else if(material.fill === EZ3.MeshMaterial.POINTS)
        gl.drawArrays(gl.POINTS, 0, length);

      else if(material.fill === EZ3.MeshMaterial.WIREFRAME)
        gl.drawArrays(gl.LINES, 0, length);
    }
  }
};

EZ3.Mesh.prototype.setup = function(gl) {
  this._setupProgram(gl);
  this._setupGeometryBuffers(gl);
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
