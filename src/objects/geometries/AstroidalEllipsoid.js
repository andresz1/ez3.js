EZ3.AstroidalEllipsoid = function(xRadius, yRadius, zRadius, stacks, slices) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var that = this;

  function _create() {
    var s, t, cosS, cosT, sinS, sinT, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.Geometry.DOUBLE_PI * u - EZ3.Geometry.PI;
        rho = EZ3.Geometry.PI * v - EZ3.Geometry.HALF_PI;

        cosS = Math.pow(Math.cos(phi), 3.0);
        cosT = Math.pow(Math.cos(rho), 3.0);
        sinS = Math.pow(Math.sin(phi), 3.0);
        sinT = Math.pow(Math.sin(rho), 3.0);

        vertex[0] = (that._xRadius * cosT * cosS);
        vertex[1] = (that._yRadius * sinT);
        vertex[2] = (that._zRadius * cosT * sinS);

        normal[0] = vertex[0] / that._xRadius;
        normal[1] = vertex[1] / that._yRadius;
        normal[2] = vertex[2] / that._zRadius;

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

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that._indices.push((s + 0) * that._stacks + (t + 0));
        that._indices.push((s + 0) * that._stacks + (t + 1));
        that._indices.push((s + 1) * that._stacks + (t + 1));

        that._indices.push((s + 0) * that._stacks + (t + 0));
        that._indices.push((s + 1) * that._stacks + (t + 1));
        that._indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

    that._buffer.fill(EZ3.Buffer.VERTEX, that._vertices.length, that._vertices);
    that._buffer.fill(EZ3.Buffer.NORMAL, that._normals.length, that._normals);
    that._buffer.fill(EZ3.Buffer.INDEX, that._indices.length, that._indices);
    that._buffer.fill(EZ3.Buffer.UV, that._uv.length, that._uv);
  }

  _create();
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;
