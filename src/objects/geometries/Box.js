EZ3.BOX = function(width, height, depth) {

  this.indices = [];
  this.vertices = [];

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth = this._width / 2.0;
  this._halfDepth = this._depth / 2.0;
  this._halfHeight = this._height / 2.0;

  this.create();

};

EZ3.BOX.prototype.create = function() {

  // 0
  this.vertices.push(this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 1
  this.vertices.push(-this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 2
  this.vertices.push(-this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 3
  this.vertices.push(this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(this._halfDepth);

  // 4
  this.vertices.push(this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 5
  this.vertices.push(-this._halfWidth);
  this.vertices.push(-this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 6
  this.vertices.push(-this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(-this._halfDepth);

  // 7
  this.vertices.push(this._halfWidth);
  this.vertices.push(this._halfHeight);
  this.vertices.push(-this._halfDepth);

};
