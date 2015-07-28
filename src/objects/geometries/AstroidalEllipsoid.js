EZ3.ASTROIDAL_ELLIPSOID = function(radiusx, radiusy, radiusz, stacks, slices) {

  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._radiusx = radiusx;
  this._radiusy = radiusy;
  this._radiusz = radiusz;

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
