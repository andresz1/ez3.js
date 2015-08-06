EZ3.Grid = function(width, height) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

  this._create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Grid.prototype._create = function() {
  var index0, index1, index2, index3, z, x;

  for(z = 0; z < this._height + 1; ++z) {
    for(x = 0; x < this._width + 1; ++x) {
      this._vertices.push(x);
      this._vertices.push(0);
      this._vertices.push(z);

      this._uv.push(x / this._width);
      this._uv.push(z / this._height);
    }
  }

  for(z = 0; z < this._height; ++z) {
    for(x = 0; x < this._width; ++x) {
      index0 = z * (this._height + 1) + x;
      index1 = index0 + 1;
      index2 = index0 + (this._height + 1);
      index3 = index2 + 1;

      this._indices.push(index0);
      this._indices.push(index2);
      this._indices.push(index1);

      this._indices.push(index1);
      this._indices.push(index2);
      this._indices.push(index3);
    }
  }

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};
