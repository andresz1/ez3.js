/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this._buffers = {};

  this._uv = new EZ3.BufferGeometry();
  this._color = new EZ3.BufferGeometry();
  this._index = new EZ3.BufferGeometry();
  this._normal = new EZ3.BufferGeometry();
  this._vertex = new EZ3.BufferGeometry();
  this._tangent = new EZ3.BufferGeometry();
  this._bitangent = new EZ3.BufferGeometry();

  this._geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
  this._material = (material instanceof EZ3.MeshMaterial) ? material : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype._updateMathGeometry = function(geometry) {
  var mathematic = false;

  mathematic = mathematic || geometry instanceof EZ3.AstroidalEllipsoid;
  mathematic = mathematic || geometry instanceof EZ3.Box;
  mathematic = mathematic || geometry instanceof EZ3.Cone;
  mathematic = mathematic || geometry instanceof EZ3.Cylinder;
  mathematic = mathematic || geometry instanceof EZ3.Ellipsoid;
  mathematic = mathematic || geometry instanceof EZ3.Grid;
  mathematic = mathematic || geometry instanceof EZ3.Sphere;
  mathematic = mathematic || geometry instanceof EZ3.Torus;

  if(mathematic) {
    geometry.generate();
    geometry.dirty = false;
  }
};

EZ3.Mesh.prototype.render = function(gl) {
  var geometry = this.geometry;
  var material = this.material;
  var program = material.program;
  var target = gl.ARRAY_BUFFER;
  var type = gl.FLOAT;
  var layout;
  var fill;

  if(geometry) {

    this._updateMathGeometry(geometry);

    if (geometry.uvs.data.length) {
      if (geometry.uvs.dirty) {
        this.uv.update(gl, target, type, geometry.uvs);
        geometry.uvs.dirty = false;
      }

      layout = program.attributes.uv;
      this.uv.bind(gl, target, type, layout, geometry.uvs);
    }

    if (geometry.colors.data.length) {
      if (geometry.colors.dirty) {
        this.color.update(gl, target, type, geometry.colors);
        geometry.colors.dirty = false;
      }

      layout = program.attributes.color;
      this.color.bind(gl, target, type, layout, geometry.colors);
    }

    if (geometry.normals.data.length) {
      if (geometry.normals.dirty) {
        this.normal.update(gl, target, type, geometry.normals);
        geometry.normals.dirty = false;
      }

      layout = program.attributes.normal;
      this.normal.bind(gl, target, type, layout, geometry.normals);
    }

    if (geometry.tangents.data.length) {
      if (geometry.tangents.dirty) {
        this.tangent.update(gl, target, type, geometry.tangents);
        geometry.tangents.dirty = false;
      }

      layout = program.attributes.tangent;
      this.tangents.bind(gl, target, type, layout, geometry.tangents);
    }

    if (geometry.bitangents.data.length) {
      if (geometry.bitangents.dirty) {
        this.bitangent.update(gl, target, type, geometry.bitangents);
        geometry.bitangents.dirty = false;
      }

      layout = program.attributes.tangent;
      this.bitangent.bind(gl, target, type, layout, geometry.bitangents);
    }

    if (geometry.vertices.data.length) {
      if (geometry.vertices.dirty) {
        this.vertex.update(gl, target, type, geometry.vertices);
        geometry.vertices.dirty = false;
      }

      layout = program.attributes.vertex;
      this.vertex.bind(gl, target, type, layout, geometry.vertices);

      if (geometry.indices.data.length) {
        target = gl.ELEMENT_ARRAY_BUFFER;
        type = gl.UNSIGNED_SHORT;

        if (material.fill === EZ3.MeshMaterial.SOLID) {
          fill = gl.TRIANGLES;

          if (!geometry.triangulated)
            geometry.triangulate();

        } else {
          if(material.fill === EZ3.MeshMaterial.WIREFRAME)
            fill = gl.LINES;
          else
            fill = gl.POINTS;

          if (geometry.triangulated || geometry.indices.dirty)
            geometry.linearize();
        }

        if (geometry.indices.dirty) {
          this.index.update(gl, target, type, geometry.indices);
          geometry.indices.dirty = false;
        }

        this.index.bind(gl, target);
        gl.drawElements(fill, geometry.indices.data.length, type, 0);
      } else
        gl.drawArrays(fill, 0, geometry.vertices.data.length / 3);
    }
  }
};

Object.defineProperty(EZ3.Mesh.prototype, 'uv', {
  get: function() {
    return this._uv;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'color', {
  get: function() {
    return this._color;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'index', {
  get: function() {
    return this._index;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'normal', {
  get: function() {
    return this._normal;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'vertex', {
  get: function() {
    return this._vertex;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'tangent', {
  get: function() {
    return this._tangent;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'bitangent', {
  get: function() {
    return this._bitangent;
  }
});

Object.defineProperty(EZ3.Mesh.prototype, 'material', {
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

Object.defineProperty(EZ3.Mesh.prototype, 'geometry', {
  get: function() {
    return this._geometry;
  },
  set: function(geometry) {
    if (geometry instanceof EZ3.Geometry)
      this._geometry = geometry;
  }
});
