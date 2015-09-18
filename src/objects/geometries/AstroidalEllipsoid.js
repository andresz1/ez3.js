/**
 * @class AstroidalEllipsoid
 * @extends Geometry
 */

EZ3.AstroidalEllipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  this.update();
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.AstroidalEllipsoid.prototype.update = function() {
  var u, v;
  var vertex;
  var output;
  var phi, rho;
  var cosS, cosT, sinS, sinT;
  var vertices, uvs, indices;
  var s, t;

  vertex = new EZ3.Vector3();

  uvs = [];
  indices = [];
  vertices = [];

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.DOUBLE_PI * u - EZ3.PI;
      rho = EZ3.PI * v - EZ3.HALF_PI;

      cosS = Math.pow(Math.cos(phi), 3.0);
      cosT = Math.pow(Math.cos(rho), 3.0);
      sinS = Math.pow(Math.sin(phi), 3.0);
      sinT = Math.pow(Math.sin(rho), 3.0);

      vertex.x = (this.radiuses.x * cosT * cosS);
      vertex.y = (this.radiuses.y * sinT);
      vertex.z = (this.radiuses.z * cosT * sinS);

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 0) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 1));

      indices.push((s + 0) * this.resolution.y + (t + 0));
      indices.push((s + 1) * this.resolution.y + (t + 1));
      indices.push((s + 1) * this.resolution.y + (t + 0));
    }
  }

  this.uvs.data = uvs;
  this.uvs.dynamic = true;

  this.indices.data = indices;
  this.indices.dynamic = true;

  this.vertices.data = vertices;
  this.vertices.dynamic = true;

  this.mergeVertices();
};

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    if(radiuses instanceof EZ3.Vector3){
      this._radiuses.copy(radiuses);
      this.dirty = true;
    }
  }
});

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'resolution', {
  get: function() {
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2){
      this._resolution.copy(resolution);
      this.dirty = true;
    }
  }
});
