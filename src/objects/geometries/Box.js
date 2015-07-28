EZ3.BOX = function(width, height, depth) {

  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth  = this._width * 0.5;
  this._halfDepth  = this._depth * 0.5;
  this._halfHeight = this._height * 0.5;

  this.create();

};

EZ3.BOX.prototype.create = function() {

  this._vertices = [
    +this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, +this._halfHeight, -this._halfDepth,
    +this._halfWidth, +this._halfHeight, -this._halfDepth
  ];

  this._indices = [

  ];

  calculateNormals();

};
