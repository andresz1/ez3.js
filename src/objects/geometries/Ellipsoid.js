EZ3.Ellipsoid = function(xRadius, yRadius, zRadius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var scope = this;

  function _create() {
    var s, t, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (scope._slices - 1);
    totalStacks = 1.0 / (scope._stacks - 1);

    for(s = 0; s < scope._slices; ++s) {
      for(t = 0; t < scope._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex[0] = (scope._xRadius * Math.cos(phi) * Math.sin(rho));
        vertex[1] = (scope._yRadius * Math.sin(rho - EZ3.HALF_PI));
        vertex[2] = (scope._zRadius * Math.sin(phi) * Math.sin(rho));

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

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;
