EZ3.Cylinder = function(radius, base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._radius = radius;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  var that = this;

  function _create () {
    var u, v;
    var vertex, normal;
    var actualHeight, step;
    var totalSlices, totalStacks;
    var s, t;

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    actualHeight = that._height;
    step = (that._height - that._base) / that._slices;

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {

        u = s * totalSlices;
        v = t * totalStacks;

        vertex[0] = that._radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex[1] = actualHeight;
        vertex[2] = that._radius * Math.sin(EZ3.DOUBLE_PI * v);

        vec3.set(normal, vertex[0], vertex[1], vertex[2]);
        vec3.normalize(normal, normal);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);

        that.uvs.push(u);
        that.uvs.push(v);

      }

      actualHeight -= step;

      if(actualHeight < that._base)
        break;

    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

    that.calculateNormals();

  }

  _create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;
