/**
 * @class EZ3.Engine
 * @constructor
 * @param {HTMLElement} canvas
 * @param {EZ3.Screen} [screen]
 * @param {Object} [options]
 */
EZ3.Engine = function(canvas, screen, options) {
  var device = EZ3.Device;

  /**
   * @property {EZ3.AnimationFrame} _animationFrame
   * @private
   */
  this._animationFrame = null;
  /**
   * @property {EZ3.Renderer} _renderer
   * @private
   */
  this._renderer = null;

  /**
   * @property {EZ3.Time} time
   */
  this.time = null;
  /**
   * @property {EZ3.Input} input
   */
  this.input = null;
  /**
   * @property {EZ3.ScreenManager} screens
   */
  this.screens = null;

  device.onReady(this._init, this, [
    canvas,
    screen,
    options
  ]);
};

/**
 * @method EZ3.Engine#_init
 * @private
 * @param {HTMLElement} canvas
 * @param {EZ3.Screen} [screen]
 * @param {Object} [options]
 */
EZ3.Engine.prototype._init = function(canvas, screen, options) {
  var bounds = canvas.getBoundingClientRect();

  this._animationFrame = new EZ3.AnimationFrame(false);
  this._renderer = new EZ3.Renderer(canvas, options);

  this.time = new EZ3.Time();
  this.input = new EZ3.InputManager(canvas, bounds);
  this.screens = new EZ3.ScreenManager(canvas, bounds, this._renderer, this.time, this.input, screen);

  this._renderer.initContext();
  this.time.start();
  this._update();
};

/**
 * @method EZ3.Engine#_update
 * @private
 */
EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this.time.update();
  this._animationFrame.request(this._update.bind(this));
};
