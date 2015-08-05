EZ3.Cylinder = function(radius, base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._radius = radius;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Cylinder.prototype._create = function() {

  var s, t, u, v, actualHeight, vertex, normal, step, totalSlices, totalStacks;

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  actualHeight = this._height;
  step = (this._height - this._base) / this._slices;

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * totalSlices;
      v = t * totalStacks;

      vertex[0] = this._radius * Math.cos(EZ3.Geometry.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = this._radius * Math.sin(EZ3.Geometry.DOUBLE_PI * v);

      vec3.set(normal, vertex[0], vertex[1], vertex[2]);
      vec3.normalize(normal, normal);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._uv.push(u);
      this._uv.push(v);

    }

    actualHeight -= step;

    if(actualHeight < this._base)
      break;

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

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};
