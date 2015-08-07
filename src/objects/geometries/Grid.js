EZ3.Grid = function(width, height) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

  var scope = this;

  function _create() {
    var index0, index1, index2, index3, z, x;

    for(z = 0; z < scope._height + 1; ++z) {
      for(x = 0; x < scope._width + 1; ++x) {
        scope._vertices.push(x);
        scope._vertices.push(0);
        scope._vertices.push(z);

        scope._uv.push(x / scope._width);
        scope._uv.push(z / scope._height);
      }
    }

    for(z = 0; z < scope._height; ++z) {
      for(x = 0; x < scope._width; ++x) {
        index0 = z * (scope._height + 1) + x;
        index1 = index0 + 1;
        index2 = index0 + (scope._height + 1);
        index3 = index2 + 1;

        scope._indices.push(index0);
        scope._indices.push(index2);
        scope._indices.push(index1);

        scope._indices.push(index1);
        scope._indices.push(index2);
        scope._indices.push(index3);
      }
    }

    scope.calculateNormals();

    scope._buffer.fill(EZ3.Buffer.VERTEX, scope._vertices.length, scope._vertices);
    scope._buffer.fill(EZ3.Buffer.NORMAL, scope._normals.length, scope._normals);
    scope._buffer.fill(EZ3.Buffer.INDEX, scope._indices.length, scope._indices);
    scope._buffer.fill(EZ3.Buffer.UV, scope._uv.length, scope._uv);
  }

  _create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;
