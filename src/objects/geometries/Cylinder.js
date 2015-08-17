EZ3.Cylinder = function(radius, base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._radius = radius;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  var scope = this;

  function _create () {
    var s, t, u, v, actualHeight, vertex, normal, step, totalSlices, totalStacks;

    totalSlices = 1.0 / (scope._slices - 1);
    totalStacks = 1.0 / (scope._stacks - 1);

    actualHeight = scope._height;
    step = (scope._height - scope._base) / scope._slices;

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < scope._slices; ++s) {
      for(t = 0; t < scope._stacks; ++t) {

        u = s * totalSlices;
        v = t * totalStacks;

        vertex[0] = scope._radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex[1] = actualHeight;
        vertex[2] = scope._radius * Math.sin(EZ3.DOUBLE_PI * v);

        vec3.set(normal, vertex[0], vertex[1], vertex[2]);
        vec3.normalize(normal, normal);

        scope.vertices.push(vertex[0]);
        scope.vertices.push(vertex[1]);
        scope.vertices.push(vertex[2]);

        scope.uv.push(u);
        scope.uv.push(v);

      }

      actualHeight -= step;

      if(actualHeight < scope._base)
        break;

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

    scope.calculateNormals();

  }

  _create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;
