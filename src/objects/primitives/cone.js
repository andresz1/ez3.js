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
