EZ3.Torus = function(innerRadius, outerRadius, sides, rings) {
  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  var that = this;

  function _create() {
    var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, totalSides, totalRings;

    totalSides = 1.0 / (that._sides - 1);
    totalRings = 1.0 / (that._rings - 1);

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < that._sides; ++s){
      for(r = 0; r < that._rings; ++r){
        u = s * totalSides;
        v = r * totalRings;

        rho = EZ3.Geometry.DOUBLE_PI * u;
        phi = EZ3.Geometry.DOUBLE_PI * v;

        cosS = Math.cos(rho);
        cosR = Math.cos(phi);
        sinS = Math.sin(rho);
        sinR = Math.sin(phi);

        vertex[0] = (that._innerRadius + that._outerRadius * cosR) * cosS;
        vertex[1] = (that._outerRadius * sinR);
        vertex[2] = (that._innerRadius + that._outerRadius * cosR) * sinS;

        normal[0] = vertex[0] - that._innerRadius * cosS;
        normal[1] = vertex[1];
        normal[2] = vertex[2] - that._innerRadius * sinS;

        vec3.normalize(normal, normal);

        that._uv.push(u);
        that._uv.push(v);

        that._normals.push(normal[0]);
        that._normals.push(normal[1]);
        that._normals.push(normal[2]);

        that._vertices.push(vertex[0]);
        that._vertices.push(vertex[1]);
        that._vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < that._sides - 1; ++s){
      for(r = 0; r < that._rings - 1; ++r){
        that._indices.push((s + 0) * that._rings + (r + 0));
        that._indices.push((s + 0) * that._rings + (r + 1));
        that._indices.push((s + 1) * that._rings + (r + 1));

        that._indices.push((s + 0) * that._rings + (r + 0));
        that._indices.push((s + 1) * that._rings + (r + 1));
        that._indices.push((s + 1) * that._rings + (r + 0));
      }
    }

    that._buffer.fill(EZ3.Buffer.VERTEX, that._vertices.length, that._vertices);
    that._buffer.fill(EZ3.Buffer.NORMAL, that._normals.length, that._normals);
    that._buffer.fill(EZ3.Buffer.INDEX, that._indices.length, that._indices);
    that._buffer.fill(EZ3.Buffer.UV, that._uv.length, that._uv);
  }

  _create();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;
