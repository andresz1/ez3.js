EZ3.Box = function(width, height, depth) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth  = this._width * 0.5;
  this._halfDepth  = this._depth * 0.5;
  this._halfHeight = this._height * 0.5;

  var that = this;

  function _create () {
    that._vertices = [
      +that._halfWidth, +that._halfHeight, +that._halfDepth,
      -that._halfWidth, +that._halfHeight, +that._halfDepth,
      -that._halfWidth, -that._halfHeight, +that._halfDepth,
      +that._halfWidth, -that._halfHeight, +that._halfDepth,
      +that._halfWidth, -that._halfHeight, -that._halfDepth,
      -that._halfWidth, -that._halfHeight, -that._halfDepth,
      -that._halfWidth, +that._halfHeight, -that._halfDepth,
      +that._halfWidth, +that._halfHeight, -that._halfDepth
    ];

    that._indices = [
      0, 1 ,2,
      0, 2, 3,
      7, 4, 5,
      7, 5, 6,
      6, 5, 2,
      6, 2, 1,
      7, 0, 3,
      7, 3, 4,
      7, 6, 1,
      7, 1, 0,
      3, 2, 5,
      3, 5, 4
    ];

    that._uv = [

    ];

    that.calculateNormals();

    that._buffer.fill(EZ3.Buffer.VERTEX, that._vertices.length, that._vertices);
    that._buffer.fill(EZ3.Buffer.NORMAL, that._normals.length, that._normals);
    that._buffer.fill(EZ3.Buffer.INDEX, that._indices.length, that._indices);
    //this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
  }

  _create();
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;
