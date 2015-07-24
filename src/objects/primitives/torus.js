EZ3.TORUS = function(innerRadius, outerRadius, sides, rings) {

  this.sides = sides;
  this.rings = rings;
  this.innerRadius = innerRadius;
  this.outerRadius = outerRadius;

  this.uv = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];

  this.PI = Math.PI;

  this.create();

};

EZ3.TORUS.prototype.create = function() {

  var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, S, R;

  S = 1.0 / (this.sides - 1);
  R = 1.0 / (this.rings - 1);

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < sides; ++s){
    for(r = 0; r < rings; ++r){

      u = s * S;
      v = r * R;

      rho = 2.0 * this.PI * s * S;
      phi = 2.0 * this.PI * r * R;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex[0] = (this.innerRadius + this.outerRadius * cosR) * cosS;
      vertex[1] = (this.outerRadius * sinR);
      vertex[2] = (this.innerRadius + this.outerRadius * cosR) * sinS;

      normal[0] = vertex[0] - this.innerRadius * cosS;
      normal[1] = vertex[1];
      normal[2] = vertex[2] - this.innerRadius * sinS;

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

  for(s = 0; s < this.sides - 1; ++s){
    for(r = 0; r < this.rings - 1; ++r){

      this.indices.push((s + 0) * this.rings + (r + 0));
      this.indices.push((s + 0) * this.rings + (r + 1));
      this.indices.push((s + 1) * this.rings + (r + 1));

      this.indices.push((s + 0) * this.rings + (r + 0));
      this.indices.push((s + 1) * this.rings + (r + 1));
      this.indices.push((s + 1) * this.rings + (r + 0));

    }
  }


};
