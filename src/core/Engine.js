/**
 * @class Engine
 */

EZ3.Engine = function(canvas, options) {
  this.device = EZ3.Device;
  this.time = null;
  this.animationFrame = null;
  this.renderer = null;
  this.inputManager = null;
  this.screens = [];

  this.device.onReady(this._init, this, [canvas, options]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  this.time = new EZ3.Time();
  this.animationFrame = new EZ3.AnimationFrame(this.device, false);
  this.renderer = new EZ3.Renderer(canvas, options);
  this.inputManager = new EZ3.InputManager(this.device, canvas);

  //this.renderer.initContext();
  this.time.start();
  this._update();
};

EZ3.Engine.prototype._update = function() {
  for (var i=0; i < this.screens.length; i++) {
    this.renderer.render(this.screens[i]);
    this.screens[i].update();
  }

  this.time.update();
  this.animationFrame.request(this._update.bind(this));
};
