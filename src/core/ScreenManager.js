/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(device, time, renderer, input) {
  this._device = device;
  this._time = time;
  this._renderer = renderer;
  this._input = input;
  this._screens = [];
};

EZ3.ScreenManager.prototype._addEventListeners = function(screen) {
  var inputs, events;
  var i, j;

  inputs = {
    keyboard: {
      onKeyPress: 'onKeyPress',
      onKeyDown: 'onKeyDown',
      onKeyUp: 'onKeyUp'
    },
    mouse: {
      onPress: 'onMousePress',
      onMove: 'onMouseMove',
      onUp: 'onMouseUp'
    },
    touch: {
      onPress: 'onTouchPress',
      onMove: 'onTouchMove',
      onUp: 'onTouchUp'
    }
  };

  for (i in inputs) {
    events = inputs[i];

    for (j in events) {
      if (screen[events[j]] !== EZ3.Screen.prototype[events[j]])
        screen.input[i][j].add(screen[events[j]], screen);
    }
  }
};

EZ3.ScreenManager.prototype._removeEventListeners = function(screen) {
  var inputs, events;
  var i, j;

  inputs = {
    keyboard: [
      'onKeyPress',
      'onKeyDown',
      'onKeyUp'
    ],
    mouse: [
      'onPress',
      'onMove',
      'onUp'
    ],
    touch: [
      'onPress',
      'onMove',
      'onUp'
    ]
  };

  for (i in inputs) {
    events = inputs[i];

    for (j = 0; j < events.length; j++)
      screen.input[i][events[j]].removeAll(screen);
  }
};

EZ3.ScreenManager.prototype.add = function(screen) {
  if (screen instanceof EZ3.Screen) {
    screen.manager = this;
    screen.device = this._device;
    screen.time = this._time;
    screen.renderer = this._renderer;
    screen.input = this._input;
    screen.load = new EZ3.LoadManager();

    this._addEventListeners(screen);

    if (screen.preload) {
      screen.preload();
      // check empty ?
      screen.load.onComplete.add(screen.create, screen);
      screen.load.start();
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

  for (i = 0; i < this._screens.length; i++) {
    if (this._screens[i].id === id) {
      this._removeEventListeners(this._screens[i]);
      return this._screens.splice(i, 1);
    }
  }
};

EZ3.ScreenManager.prototype.update = function() {
  var i;

  this._renderer.clear();

  for (i = 0; i < this._screens.length; i++) {
    this._renderer.render(this._screens[i]);
    this._screens[i].update();
  }
};
