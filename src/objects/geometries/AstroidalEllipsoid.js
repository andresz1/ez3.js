/**
 * @class AstroidalEllipsoid
 * @extends Geometry
 */

EZ3.AstroidalEllipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  if (radiuses !== undefined) {
    if(radiuses instanceof EZ3.Vector3)
      this._radiuses = radiuses;
    else
      this._radiuses = new EZ3.Vector3(1,1,1);
  }

  if (resolution !== undefined) {
    if(resolution instanceof EZ3.Vector2)
      this._resolution = resolution;
    else
      this._resolution = new EZ3.Vector2(5,5);
  }
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.AstroidalEllipsoid.prototype.generate = function() {
  var uvs = [];
  var indices= [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var buffer;
  var phi;
  var rho;
  var cosS;
  var cosT;
  var sinS;
  var sinT;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u - EZ3.Math.PI;
      rho = EZ3.Math.PI * v - EZ3.Math.HALF_PI;

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

  buffer = new EZ3.IndexBuffer(indices, false);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);

  this.mergeVertices();
};

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'radiuses', {
  get: function() {
    return this._radiuses;
  },
  set: function(radiuses) {
    if(radiuses instanceof EZ3.Vector3){
      this._radiuses.copy(radiuses);
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
    }
  }
});

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'regenerate', {
  get: function() {
    return this.radiuses.dirty || this.resolution.dirty;
  },
  set: function(regenerate) {
    this.radiuses.dirty = regenerate;
    this.resolution.dirty = regenerate;
  }
});
