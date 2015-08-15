EZ3.Engine = function(canvas, options) {
  this.device = EZ3.Device;
  this.renderer = null;
  this.inputManager = null;

  this.device.onReady(this._init, this, [canvas, options]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  this.renderer = new EZ3.Renderer(canvas, options);
  this.inputManager = new EZ3.inputManager(this.device, canvas);
};
