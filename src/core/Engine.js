/**
 * @class Engine
 */

EZ3.Engine = function(canvas, options) {
  this.device = EZ3.Device;
  this.input = null;
  this.screens = null;

  this._animationFrame = null;
  this._time = null;
  this._renderer = null;

  this.device.onReady(this._init, this, [canvas, options]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  this._animationFrame = new EZ3.AnimationFrame(this.device, false);
  this._time = new EZ3.Time();
  this._renderer = new EZ3.Renderer(canvas, options);
  this.input = new EZ3.InputManager(this.device, canvas);
  this.screens = new EZ3.ScreenManager(this._device, this._time, this._renderer, this.input);


  this._renderer.initContext();
  this._time.start();
  this._update();
};

EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this._time.update();
  this._animationFrame.request(this._update.bind(this));
};
