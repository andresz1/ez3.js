EZ3.Sphere = function(radius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Sphere.prototype._create = function() {

  var s, t, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

  vertex = vec3.create();
  normal = vec3.create();

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * totalSlices;
      v = t * totalStacks;

      phi = EZ3.Geometry.DOUBLE_PI * u;
      rho = EZ3.Geometry.PI * v;

      vertex[0] = (this._radius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this._radius * Math.sin(rho - EZ3.Geometry.HALF_PI));
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

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};
