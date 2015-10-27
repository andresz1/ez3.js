/**
 * @class Camera
 */

EZ3.Camera = function(position, target, up, mode, filter) {
  EZ3.Entity.call(this);

  this._filterBuffer = [];
  this._filter = filter || true;
  this._rotationAngles = new EZ3.Vector2();
  this._mode = mode || EZ3.Camera.PERSPECTIVE;

  this.fov = 70.0;
  this.aspectRatio = 1.0;
  this.planes = {};
  this.planes.near = 0.1;
  this.planes.far = 1000.0;
  this.look = new EZ3.Vector3(0, 0, -1);
  this.right = new EZ3.Vector3(1, 0, 0);

  if (position instanceof EZ3.Vector3)
    this.position = position;
  else
    this.position = new EZ3.Vector3(5, 5, 5);

  if (target instanceof EZ3.Vector3)
    this.target = target;
  else
    this.target = new EZ3.Vector3();

  if (up instanceof EZ3.Vector3)
    this.up = up;
  else
    this.up = new EZ3.Vector3(0, 1, 0);

  this._setupRotationAngles();
};

EZ3.Camera.prototype.constructor = EZ3.Camera;

EZ3.Camera.prototype._setupRotationAngles = function() {
  var yaw;
  var pitch;

  this.look = new EZ3.Vector3().sub(this.position, this.target).normalize();

  yaw = EZ3.Math.toDegrees(Math.atan2(this.look.z, this.look.x) + EZ3.Math.PI);
  pitch = EZ3.Math.toDegrees(Math.asin(this.look.y));

  this._rotationAngles.x = yaw;
  this._rotationAngles.y = pitch;
};

EZ3.Camera.prototype._filterMoves = function(dx, dy) {
  var averageX = 0;
  var averageY = 0;
  var averageTotal = 0;
  var currentWeight = 1.0;
  var k;

  if (!this._filterBuffer.length)
    for (k = 0; k < EZ3.Camera.FILTER_BUFFER_SIZE; ++k)
      this._filterBuffer.push(new EZ3.Vector2(dx, dy));

  for (k = EZ3.Camera.FILTER_BUFFER_SIZE - 1; k > 0; k--)
    this._filterBuffer[k] = this._filterBuffer[k - 1];

  this._filterBuffer[0] = new EZ3.Vector2(dx, dy);

  for (k = 0; k < EZ3.Camera.FILTER_BUFFER_SIZE; k++) {
    averageX += this._filterBuffer[k].x * currentWeight;
    averageY += this._filterBuffer[k].y * currentWeight;
    averageTotal += currentWeight;

    currentWeight *= EZ3.Camera.FILTER_WEIGHT;
  }

  return new EZ3.Vector2(averageX, averageY).scaleEqual(1.0 / averageTotal);
};

EZ3.Camera.prototype.rotate = function(dx, dy) {
  var rx;
  var ry;

  this._rotationAngles.x -= dx * EZ3.Camera.ROTATION_SPEED;
  this._rotationAngles.y += dy * EZ3.Camera.ROTATION_SPEED;

  if (this._filter) {
    rx = this._rotationAngles.x;
    ry = this._rotationAngles.y;
    this._rotationAngles = this._filterMoves(rx, ry);
  }
};

Object.defineProperty(EZ3.Camera.prototype, 'view', {
  get: function() {
    this._update();
    return new EZ3.Matrix4().lookAt(this.position, this.target, this.up);
  }
});

Object.defineProperty(EZ3.Camera.prototype, 'projection', {
  get: function() {
    if (this._mode === EZ3.Camera.PERSPECTIVE)
      return new EZ3.Matrix4().perspective(
        this.fov,
        this.aspectRatio,
        this.planes.near,
        this.planes.far
      );
    else
      return new EZ3.Matrix4().ortho(
        this.planes.left,
        this.planes.right,
        this.planes.bottom,
        this.planes.top,
        this.planes.near,
        this.planes.far
      );
  }
});

EZ3.Camera.PERSPECTIVE = 0;
EZ3.Camera.ORTHOGRAPHIC = 1;
EZ3.Camera.MOVE_SPEED = 50;
EZ3.Camera.ROTATION_SPEED = 300;
EZ3.Camera.FILTER_WEIGHT = 0.75;
EZ3.Camera.FILTER_BUFFER_SIZE = 10;