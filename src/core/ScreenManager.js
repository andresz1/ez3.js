/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(device, time, renderer, input, cache) {
  this._device = device;
  this._time = time;
  this._renderer = renderer;
  this._input = input;
  this._cache = cache;
  this._screens = [];
};

EZ3.ScreenManager.prototype.add = function(screen) {
  if (screen instanceof EZ3.Screen) {
    screen.manager = this;
    screen.device = this._device;
    screen.time = this._time;
    screen.renderer = this._renderer;
    screen.input = this._input;
    screen.cache = this._cache;
    screen.loader = new EZ3.Loader(this._cache);

    if (screen.load) {
      screen.load();
      screen.loader.onComplete.add(screen.create.bind(screen));
      screen.loader.start();
    } else {
      screen.create();
    }

    this._screens.unshift(screen);
  }
};

EZ3.ScreenManager.prototype.update = function() {
  for (var i = 0; i < this._screens.length; i++) {
    this._renderer.render(this._screens[i]);
    this._screens[i].update();
  }
};
