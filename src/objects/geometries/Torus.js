/**
 * @class Torus
 * @extends Geometry
 */

EZ3.Torus = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  if (radiuses !== undefined) {
    if(radiuses instanceof EZ3.Vector2)
      this._radiuses = radiuses;
    else
      this._radiuses = new EZ3.Vector2(0.5, 1.0);
  }

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(5,5);
  }
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var cosS;
  var cosR;
  var sinS;
  var sinR;
  var rho;
  var phi;
  var u;
  var v;
  var s;
  var r;

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

Object.defineProperty(EZ3.Torus.prototype, 'dirty', {
  get: function() {
    return this.radiuses.dirty || this.resolution.dirty;
  },
  set: function(dirty) {
    this.radiuses.dirty = dirty;
    this.resolution.dirty = dirty;
  }
});
