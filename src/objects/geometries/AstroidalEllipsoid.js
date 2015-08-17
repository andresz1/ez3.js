EZ3.AstroidalEllipsoid = function(xRadius, yRadius, zRadius, stacks, slices) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var scope = this;

  function _create() {
    var s, t, cosS, cosT, sinS, sinT, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (scope._slices - 1);
    totalStacks = 1.0 / (scope._stacks - 1);

    for(s = 0; s < scope._slices; ++s) {
      for(t = 0; t < scope._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.DOUBLE_PI * u - EZ3.PI;
        rho = EZ3.PI * v - EZ3.HALF_PI;

        cosS = Math.pow(Math.cos(phi), 3.0);
        cosT = Math.pow(Math.cos(rho), 3.0);
        sinS = Math.pow(Math.sin(phi), 3.0);
        sinT = Math.pow(Math.sin(rho), 3.0);

        vertex[0] = (scope._xRadius * cosT * cosS);
        vertex[1] = (scope._yRadius * sinT);
        vertex[2] = (scope._zRadius * cosT * sinS);

        normal[0] = vertex[0] / scope._xRadius;
        normal[1] = vertex[1] / scope._yRadius;
        normal[2] = vertex[2] / scope._zRadius;

        vec3.normalize(normal, normal);

        scope.uvs.push(u);
        scope.uvs.push(v);

        scope.normals.push(normal[0]);
        scope.normals.push(normal[1]);
        scope.normals.push(normal[2]);

        scope.vertices.push(vertex[0]);
        scope.vertices.push(vertex[1]);
        scope.vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < scope._slices - 1; ++s) {
      for(t = 0; t < scope._stacks - 1; ++t) {
        scope.indices.push((s + 0) * scope._stacks + (t + 0));
        scope.indices.push((s + 0) * scope._stacks + (t + 1));
        scope.indices.push((s + 1) * scope._stacks + (t + 1));

        scope.indices.push((s + 0) * scope._stacks + (t + 0));
        scope.indices.push((s + 1) * scope._stacks + (t + 1));
        scope.indices.push((s + 1) * scope._stacks + (t + 0));
      }
    }

  }

  _create();
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;
