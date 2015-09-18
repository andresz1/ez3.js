/**
 * @class Torus
 * @extends Geometry
 */

EZ3.Torus = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  this._radiuses = radiuses;
  this._resolution = resolution;

  this.update();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.update = function() {
  var u, v;
  var result;
  var rho, phi;
  var vertex;
  var cosS, cosR, sinS, sinR;
  var vertices, uvs, indices;
  var s, r;

  vertex = new EZ3.Vector3();

  uvs = [];
  indices = [];
  vertices = [];

  for (s = 0; s < this.resolution.x; ++s) {
    for (r = 0; r < this.resolution.y; ++r) {
      u = s / (this.resolution.x - 1);
      v = r / (this.resolution.y - 1);

      rho = EZ3.DOUBLE_PI * u;
      phi = EZ3.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex.x = (this.radiuses.x + this.radiuses.y * cosR) * cosS;
      vertex.y = (this.radiuses.y * sinR);
      vertex.z = (this.radiuses.x + this.radiuses.y * cosR) * sinS;

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (r = 0; r < this.resolution.y - 1; ++r) {
      indices.push((s + 0) * this.resolution.y + (r + 0));
      indices.push((s + 0) * this.resolution.y + (r + 1));
      indices.push((s + 1) * this.resolution.y + (r + 1));

      indices.push((s + 0) * this.resolution.y + (r + 0));
      indices.push((s + 1) * this.resolution.y + (r + 1));
      indices.push((s + 1) * this.resolution.y + (r + 0));
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

Object.defineProperty(EZ3.Torus.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    if(radiuses instanceof EZ3.Vector2)
      this._radiuses.copy(radiuses);
  }
});

Object.defineProperty(EZ3.Torus.prototype, 'resolution', {
  get: function(){
    return this._resolution;
  },
  set: function(resolution) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution.copy(resolution);
  }
});
