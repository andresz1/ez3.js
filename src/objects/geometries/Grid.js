EZ3.Grid = function(width, height) {

  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;
  this._create();

};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Grid._create = function() {

};
