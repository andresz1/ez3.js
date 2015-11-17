/**
 * @class Engine
 */

EZ3.Engine = function(canvas, options) {
  this._animationFrame = null;
  this._renderer = null;

  this.device = EZ3.Device;
  this.time = null;
  this.input = null;
  this.screens = null;

  this.device.onReady(this._init, this, [
    canvas,
    options
  ]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  var bounds = canvas.getBoundingClientRect();

  this._animationFrame = new EZ3.AnimationFrame(false);
  this._renderer = new EZ3.Renderer(canvas, options);

  this.time = new EZ3.Time();
  this.input = new EZ3.InputManager(canvas, bounds);
  this.screens = new EZ3.ScreenManager(canvas, bounds, this._renderer, this.time, this.input);

  this._renderer.initContext();
  this.time.start();
  this._update();
};

EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this.time.update();
  this._animationFrame.request(this._update.bind(this));
};
