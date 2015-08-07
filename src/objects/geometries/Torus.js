EZ3.Torus = function(innerRadius, outerRadius, sides, rings) {
  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  var scope = this;

  function _create() {
    var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, totalSides, totalRings;

    totalSides = 1.0 / (scope._sides - 1);
    totalRings = 1.0 / (scope._rings - 1);

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < scope._sides; ++s){
      for(r = 0; r < scope._rings; ++r){
        u = s * totalSides;
        v = r * totalRings;

        rho = EZ3.Geometry.DOUBLE_PI * u;
        phi = EZ3.Geometry.DOUBLE_PI * v;

        cosS = Math.cos(rho);
        cosR = Math.cos(phi);
        sinS = Math.sin(rho);
        sinR = Math.sin(phi);

        vertex[0] = (scope._innerRadius + scope._outerRadius * cosR) * cosS;
        vertex[1] = (scope._outerRadius * sinR);
        vertex[2] = (scope._innerRadius + scope._outerRadius * cosR) * sinS;

        normal[0] = vertex[0] - scope._innerRadius * cosS;
        normal[1] = vertex[1];
        normal[2] = vertex[2] - scope._innerRadius * sinS;

        vec3.normalize(normal, normal);

        scope._uv.push(u);
        scope._uv.push(v);

        scope._normals.push(normal[0]);
        scope._normals.push(normal[1]);
        scope._normals.push(normal[2]);

        scope._vertices.push(vertex[0]);
        scope._vertices.push(vertex[1]);
        scope._vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < scope._sides - 1; ++s){
      for(r = 0; r < scope._rings - 1; ++r){
        scope._indices.push((s + 0) * scope._rings + (r + 0));
        scope._indices.push((s + 0) * scope._rings + (r + 1));
        scope._indices.push((s + 1) * scope._rings + (r + 1));

        scope._indices.push((s + 0) * scope._rings + (r + 0));
        scope._indices.push((s + 1) * scope._rings + (r + 1));
        scope._indices.push((s + 1) * scope._rings + (r + 0));
      }
    }

    scope._buffer.fill(EZ3.Buffer.VERTEX, scope._vertices.length, scope._vertices);
    scope._buffer.fill(EZ3.Buffer.NORMAL, scope._normals.length, scope._normals);
    scope._buffer.fill(EZ3.Buffer.INDEX, scope._indices.length, scope._indices);
    scope._buffer.fill(EZ3.Buffer.UV, scope._uv.length, scope._uv);
  }

  _create();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;
