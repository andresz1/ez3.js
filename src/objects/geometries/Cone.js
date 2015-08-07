EZ3.Cone = function(base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  var scope = this;

  function _create() {

    var s, t, u, v, radius, actualHeight, vertex, normal, step, totalSlices, totalStacks;

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

        radius = Math.abs(scope._height - actualHeight) * 0.5;

        vertex[0] = radius * Math.cos(EZ3.Geometry.DOUBLE_PI * v);
        vertex[1] = actualHeight;
        vertex[2] = radius * Math.sin(EZ3.Geometry.DOUBLE_PI * v);

        normal[0] = vertex[0];
        normal[1] = vertex[1];
        normal[2] = vertex[2];

        vec3.normalize(normal, normal);

        scope._vertices.push(vertex[0]);
        scope._vertices.push(vertex[1]);
        scope._vertices.push(vertex[2]);

        scope._uv.push(u);
        scope._uv.push(v);

      }

      actualHeight -= step;

      if(actualHeight < scope._base)
        break;

    }

    for(s = 0; s < scope._slices - 1; ++s) {
      for(t = 0; t < scope._stacks - 1; ++t) {

        scope._indices.push((s + 0) * scope._stacks + (t + 0));
        scope._indices.push((s + 0) * scope._stacks + (t + 1));
        scope._indices.push((s + 1) * scope._stacks + (t + 1));

        scope._indices.push((s + 0) * scope._stacks + (t + 0));
        scope._indices.push((s + 1) * scope._stacks + (t + 1));
        scope._indices.push((s + 1) * scope._stacks + (t + 0));

      }
    }

    scope.calculateNormals();

    scope._buffer.fill(EZ3.Buffer.VERTEX, scope._vertices.length, scope._vertices);
    scope._buffer.fill(EZ3.Buffer.NORMAL, scope._normals.length, scope._normals);
    scope._buffer.fill(EZ3.Buffer.INDEX, scope._indices.length, scope._indices);
    scope._buffer.fill(EZ3.Buffer.UV, scope._uv.length, scope._uv);

  };

  _create();
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;
