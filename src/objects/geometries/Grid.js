/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(width, height) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

  var that = this;

  function _create() {
    var index0, index1, index2, index3, z, x;

    for (z = 0; z < that._height + 1; ++z) {
      for (x = 0; x < that._width + 1; ++x) {
        that.vertices.push(x);
        that.vertices.push(0);
        that.vertices.push(z);

        that.uvs.push(x / that._width);
        that.uvs.push(z / that._height);
      }
    }

    for (z = 0; z < that._height; ++z) {
      for (x = 0; x < that._width; ++x) {
        index0 = z * (that._height + 1) + x;
        index1 = index0 + 1;
        index2 = index0 + (that._height + 1);
        index3 = index2 + 1;

        that.indices.push(index0);
        that.indices.push(index2);
        that.indices.push(index1);

        that.indices.push(index1);
        that.indices.push(index2);
        that.indices.push(index3);
      }
    }

    that.calculateNormals();

  }

  _create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;
