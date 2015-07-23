EZ3.SPHERE = function(radius, slices, stacks) {
  this.PI = Math.PI;
  this.HALF_PI = this.PI / 2;
  this.vertices = [];
  this.normals = [];
  this.uv = [];
  this.indices = [];
  this.radius = radius;
  this.slices = slices;
  this.stacks = stacks;
};

EZ3.SPHERE.prototype.create = function() {

  var s, t, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this.slices - 1);
  T = 1.0 / (this.stacks - 1);

  for(s = 0; s < this.slices; ++s) {
    for(t = 0; t < this.stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = Math.PI * s * S;
      rho = Math.PI * t * T;

      vertex[0] = (this.radius * Math.cos(2 * phi) * Math.sin(rho));
      vertex[1] = (this.radius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this.radius * Math.sin(2 * phi) * Math.sin(rho));

      normal[0] = vertex[0] / this.radius;
      normal[1] = vertex[1] / this.radius;
      normal[2] = vertex[2] / this.radius;
      vec3.normalize(normal, normal);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.uv.push(u);
      this.uv.push(v);

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
