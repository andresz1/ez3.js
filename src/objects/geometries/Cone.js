EZ3.Cone = function(base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;

EZ3.Cone.prototype._create = function() {

  var s, t, u, v, radius, actualHeight, vertex, normal, step, totalSlices, totalStacks;

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

      radius = Math.abs(this._height - actualHeight) * 0.5;

      vertex[0] = radius * Math.cos(EZ3.Geometry.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = radius * Math.sin(EZ3.Geometry.DOUBLE_PI * v);

      normal[0] = vertex[0];
      normal[1] = vertex[1];
      normal[2] = vertex[2];

      vec3.normalize(normal, normal);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

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

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};
