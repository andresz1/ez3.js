/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

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
