EZ3.SPHERE = function(radius, slices, stacks) {

  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

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

      vertex[0] = (this._radius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this._radius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this._radius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this._radius;
      normal[1] = vertex[1] / this._radius;
      normal[2] = vertex[2] / this._radius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

};
