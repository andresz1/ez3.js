EZ3.Sphere = function(radius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

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

        vertex[0] = (scope._radius * Math.cos(phi) * Math.sin(rho));
        vertex[1] = (scope._radius * Math.sin(rho - EZ3.HALF_PI));
        vertex[2] = (scope._radius * Math.sin(phi) * Math.sin(rho));

        normal[0] = vertex[0] / scope._radius;
        normal[1] = vertex[1] / scope._radius;
        normal[2] = vertex[2] / scope._radius;

        vec3.normalize(normal, normal);

        scope.uv.push(u);
        scope.uv.push(v);

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

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;
