var EZ3 = {
  VERSION: '1.0.0',
  Signal: signals.Signal
};

EZ3.Engine = function(canvas, options) {
  this.canvas = canvas || document.createElement('canvas');
  this.canvas.width = canvas.width || 800;
  this.canvas.height = canvas.height || 600;
  try {
    this.gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch(e) {
    throw new Error('WebGl not supported');
  }
  this.setViewport(0, 0, this.canvas.width, this.canvas.height);
};

EZ3.Engine.prototype.setViewport = function(x, y, width, height) {
  this.gl.viewport(x, y, width, height);
};



EZ3.Key = function() {

};

EZ3.Key.prototype.

EZ3.Keyboard = function(domElement) {
  this._domElement = domElement;

  this.enabled = true;
};

EZ3.Keyboard.prototype.enable = function() {
  this.enabled = true;
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;
};

EZ3.Geometry = function(data) {
  this._uv = [];
  this._indices = [];
  this._normals = [];
  this._vertices = [];
  this._tangents = [];
  this._binormals = [];
  this._maxPoint = vec3.create();
  this._minPoint = vec3.create();
  this._midPoint = vec3.create();
};

EZ3.Geometry.prototype.initArray = function(size, value) {

  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });

};

EZ3.Geometry.prototype.calculateNormals = function() {

  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  var temporalNormals = initArray(this.vertices.length, 0);
  var temporalAppearances = initArray(this.vertices.length / 3, 0);

  for(k = 0; k < this.indices.length; k += 3) {

    x = 3 * this.indices[k + 0];
    y = 3 * this.indices[k + 1];
    z = 3 * this.indices[k + 2];

    point0 = vec3.create(this.vertices[x + 0], this.vertices[x + 1], this.vertices[x + 2]);
    point1 = vec3.create(this.vertices[y + 0], this.vertices[y + 1], this.vertices[y + 2]);
    point2 = vec3.create(this.vertices[z + 0], this.vertices[z + 1], this.vertices[z + 2]);

    vec3.subtract(vector0, point1, point0);
    vec3.subtract(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if(normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    temporalNormals[x + 0] += normal[0];
    temporalNormals[x + 1] += normal[1];
    temporalNormals[x + 2] += normal[2];

    temporalNormals[y + 0] += normal[0];
    temporalNormals[y + 1] += normal[1];
    temporalNormals[y + 2] += normal[2];

    temporalNormals[z + 0] += normal[0];
    temporalNormals[z + 1] += normal[1];
    temporalNormals[z + 2] += normal[2];

    ++temporalAppearances[x / 3];
    ++temporalAppearances[y / 3];
    ++temporalAppearances[z / 3];

  }

  for(k = 0; k < this._vertices.length / 3; ++k){

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this._normals.push(temporalNormals[x] / temporalAppearances[k]);
    this._normals.push(temporalNormals[y] / temporalAppearances[k]);
    this._normals.push(temporalNormals[z] / temporalAppearances[k]);

  }

  temporalNormals.splice(0, temporalNormals.length);
  temporalAppearances.splice(0, temporalAppearances.length);

};

EZ3.Geometry.prototype.updateMaxPoint = function(x, y, z) {

  this._maxPoint[0] = Math.max(this._maxPoint[0], x);
  this._maxPoint[1] = Math.max(this._maxPoint[1], y);
  this._maxPoint[2] = Math.max(this._maxPoint[2], z);

};

EZ3.Geometry.prototype.updateMinPoint = function(x, y, z) {

  this._minPoint[0] = Math.min(this._minPoint[0], x);
  this._minPoint[1] = Math.min(this._minPoint[1], y);
  this._minPoint[2] = Math.min(this._minPoint[2], z);

};

EZ3.Geometry.prototype.calculateMidPoint = function () {

    this._midPoint[0] = (this._maxPoint[0] + this._minPoint[0]) * 0.5;
    this._midPoint[0] = (this._maxPoint[1] + this._minPoint[1]) * 0.5;
    this._midPoint[0] = (this._maxPoint[2] + this._minPoint[2]) * 0.5;

};

EZ3.Geometry.prototype.calculateTangents = function() {

};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};


EZ3.ASTROIDAL_ELLIPSOID = function(radiusx, radiusy, radiusz, stacks, slices) {

  this._slices = slices;
  this._stacks = stacks;
  this._radiusx = radiusx;
  this._radiusy = radiusy;
  this._radiusz = radiusz;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;
  this.HALF_PI = this.PI / 2;
  this.DOUBLE_PI = 2.0 * this.PI;

  this.create();

};

EZ3.ASTROIDAL_ELLIPSOID.prototype.create = function() {

  var s, t, cosS, cosT, sinS, sinT, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u - this.PI;
      rho = this.PI * v - this.HALF_PI;

      cosS = Math.pow(Math.cos(phi), 3.0);
      cosT = Math.pow(Math.cos(rho), 3.0);
      sinS = Math.pow(Math.sin(phi), 3.0);
      sinT = Math.pow(Math.sin(rho), 3.0);

      vertex[0] = (this._radiusx * cosT * cosS);
      vertex[1] = (this._radiusy * sinT);
      vertex[2] = (this._radiusz * cosT * sinS);

      normal[0] = vertex[0] / this._xradius;
      normal[1] = vertex[1] / this._yradius;
      normal[2] = vertex[2] / this._zradius;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 0) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 1));

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 1) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 0));

    }
  }
};

EZ3.BOX = function(width, height, depth) {

  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth = this._width / 2.0;
  this._halfDepth = this._depth / 2.0;
  this._halfHeight = this._height / 2.0;

  this.create();

};

EZ3.BOX.prototype.create = function() {

  // 0
  this.vertices.push(this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 1
  this.vertices.push(-this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 2
  this.vertices.push(-this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 3
  this.vertices.push(this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 4
  this.vertices.push(this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 5
  this.vertices.push(-this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 6
  this.vertices.push(-this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 7
  this.vertices.push(this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(-this._halfDepth);

};

EZ3.CONE = function(base, height, slices, stacks) {

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;
  this.DOUBLE_PI = 2.0 * this.PI;

  this.create();

};

EZ3.CONE.prototype.create = function() {

  var s, t, u, v, radius, actualHeight, vertex, normal, step, S, T;

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  actualHeight = this._height;
  step = (this._height - this._base) / this._slices;

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      radius = Math.abs(this._height - actualHeight) * 0.5;

      vertex[0] = radius * Math.cos(this.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = radius * Math.sin(this.DOUBLE_PI * v);

      normal[0] = vertex[0];
      normal[1] = vertex[1];
      normal[2] = vertex[2];

      if(normal[0] !== 0.0 || normal[1] !== 0.0 || normal[2] !== 0.0)
        vec3.normalize(normal, normal);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.uv.push(u);
      this.uv.push(v);

      actualHeight -= step;

      if(actualHeight < this._base)
        break;

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 0) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 1));

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 1) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

};


EZ3.ELLIPSOID = function(xRadius, yRadius, zRadius, slices, stacks) {

  this.slices = slices;
  this.stacks = stacks;
  this.xRadius = xRadius;
  this.yRadius = yRadius;
  this.zRadius = zRadius;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;
  this.HALF_PI = this.PI / 2;
  this.DOUBLE_PI = 2.0 * this.PI;

  this.create();

};

EZ3.ELLIPSOID.prototype.create = function() {

  var s, t, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this.slices - 1);
  T = 1.0 / (this.stacks - 1);

  for(s = 0; s < this.slices; ++s) {
    for(t = 0; t < this.stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u;
      rho = this.PI * v;

      vertex[0] = (this.xRadius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this.yRadius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this.zRadius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this.xRadius;
      normal[1] = vertex[1] / this.yRadius;
      normal[2] = vertex[2] / this.zRadius;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this.slices - 1; ++s) {
    for(t = 0; t < this.stacks - 1; ++t) {

      this.indices.push((s + 0) * this.stacks + (t + 0));
      this.indices.push((s + 0) * this.stacks + (t + 1));
      this.indices.push((s + 1) * this.stacks + (t + 1));

      this.indices.push((s + 0) * this.stacks + (t + 0));
      this.indices.push((s + 1) * this.stacks + (t + 1));
      this.indices.push((s + 1) * this.stacks + (t + 0));

    }
  }

};

EZ3.SPHERE = function(radius, slices, stacks) {

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;
  this.HALF_PI = this.PI / 2.0;
  this.DOUBLE_PI = 2.0 * this.PI;

  this.create();

};

EZ3.SPHERE.prototype.create = function() {

  var s, t, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u;
      rho = this.PI * v;

      vertex[0] = (this.radius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this.radius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this.radius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this._radius;
      normal[1] = vertex[1] / this._radius;
      normal[2] = vertex[2] / this._radius;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 0) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 1));

      this.indices.push((s + 0) * this._stacks + (t + 0));
      this.indices.push((s + 1) * this._stacks + (t + 1));
      this.indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

};

EZ3.TORUS = function(innerRadius, outerRadius, sides, rings) {

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;
  this.DOUBLE_PI = 2.0 * this.PI;

  this.create();

};

EZ3.TORUS.prototype.create = function() {

  var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, S, R;

  S = 1.0 / (this._sides - 1);
  R = 1.0 / (this._rings - 1);

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._sides; ++s){
    for(r = 0; r < this._rings; ++r){

      u = s * S;
      v = r * R;

      rho = this.DOUBLE_PI * u;
      phi = this.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex[0] = (this._innerRadius + this._outerRadius * cosR) * cosS;
      vertex[1] = (this._outerRadius * sinR);
      vertex[2] = (this._innerRadius + this._outerRadius * cosR) * sinS;

      normal[0] = vertex[0] - this._innerRadius * cosS;
      normal[1] = vertex[1];
      normal[2] = vertex[2] - this._innerRadius * sinS;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._sides - 1; ++s){
    for(r = 0; r < this._rings - 1; ++r){

      this.indices.push((s + 0) * this._rings + (r + 0));
      this.indices.push((s + 0) * this._rings + (r + 1));
      this.indices.push((s + 1) * this._rings + (r + 1));

      this.indices.push((s + 0) * this._rings + (r + 0));
      this.indices.push((s + 1) * this._rings + (r + 1));
      this.indices.push((s + 1) * this._rings + (r + 0));

    }
  }

};
