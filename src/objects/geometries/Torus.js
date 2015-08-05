EZ3.Torus = function(innerRadius, outerRadius, sides, rings) {
  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  this._create();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Torus.prototype._create = function() {

  var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, totalSides, totalRings;

  totalSides = 1.0 / (this._sides - 1);
  totalRings = 1.0 / (this._rings - 1);

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._sides; ++s){
    for(r = 0; r < this._rings; ++r){

      u = s * totalSides;
      v = r * totalRings;

      rho = EZ3.Geometry.DOUBLE_PI * u;
      phi = EZ3.Geometry.DOUBLE_PI * v;

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

  for(s = 0; s < this._sides - 1; ++s){
    for(r = 0; r < this._rings - 1; ++r){

      this._indices.push((s + 0) * this._rings + (r + 0));
      this._indices.push((s + 0) * this._rings + (r + 1));
      this._indices.push((s + 1) * this._rings + (r + 1));

      this._indices.push((s + 0) * this._rings + (r + 0));
      this._indices.push((s + 1) * this._rings + (r + 1));
      this._indices.push((s + 1) * this._rings + (r + 0));

    }
  }

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};
