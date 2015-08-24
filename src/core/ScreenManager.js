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
  var inputs, events;
  var i, j;

  if (screen instanceof EZ3.Screen) {
    screen.manager = this;
    screen.device = this._device;
    screen.time = this._time;
    screen.renderer = this._renderer;
    screen.input = this._input;
    screen.cache = this._cache;
    screen.loader = new EZ3.Loader(this._cache);

    inputs = {
      keyboard: [
        'onKeyPress',
        'onKeyDown',
        'onKeyUp'
      ],
      mouse: [
        'onMousePress',
        'onMouseMove',
        'onMouseUp'
      ],
      touch: [
        'onTouchPress',
        'onTouchMove',
        'onTouchUp'
      ]
    };

    for (i in inputs) {
      events = inputs[i];

      for (j = 0; j < events.length; j++) {
        if (screen.input[i][events[j]] !== EZ3.Screen.prototype[i])
          screen.input[i][events[j]].add(screen[events[j]], screen);
      }
    }

    if (screen.load) {
      screen.load();
      screen.loader.onComplete.add(screen.create, screen);
      screen.loader.start();
    } else
      screen.create();

    this._screens.unshift(screen);

    return screen;
  }
};

EZ3.ScreenManager.prototype.get = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++)
    if (this._screens[i].id === id)
      return this._screens[i];
};

EZ3.ScreenManager.prototype.remove = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++)
    if (this._screens[i].id === id)
      return this._screens.splice(i, 1);
};

EZ3.ScreenManager.prototype.update = function() {
  var i;

  for (i = 0; i < this._screens.length; i++) {
    this._renderer.render(this._screens[i]);
    this._screens[i].update();
  }
};
