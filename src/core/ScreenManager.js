/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(canvas, renderer, time, input) {
  this._screens = [];

  this.canvas = canvas;
  this.bounds = canvas.getBoundingClientRect();
  this.renderer = renderer;
  this.time = time;
  this.input = input;

  this.fullScreeneded = false;
};

EZ3.ScreenManager.prototype._addEventListeners = function(screen) {
  var inputs = {
    keyboard: {
      onKeyPress: 'onKeyPress',
      onKeyDown: 'onKeyDown',
      onKeyUp: 'onKeyUp'
    },
    mouse: {
      onPress: 'onMousePress',
      onMove: 'onMouseMove',
      onUp: 'onMouseUp',
      onWheel: 'onMouseWheel'
    },
    touch: {
      onPress: 'onTouchPress',
      onMove: 'onTouchMove',
      onUp: 'onTouchUp'
    }
  };
  var device = EZ3.Device;
  var events;
  var i;
  var j;

  for (i in inputs) {
    events = inputs[i];

    for (j in events) {
      if (screen[events[j]] !== EZ3.Screen.prototype[events[j]])
        screen.input[i][j].add(screen[events[j]], screen);
    }
  }

  if (screen.onResize)
    device.onResize.add(screen.onResize, screen);
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
      screen.input[i][events[j]].remove(screen[events[j]], screen);
  }
};

EZ3.ScreenManager.prototype._processFullScreenChange = function() {
  this.fullScreened = !this.fullScreened;

  if (!this.fullScreened) {
    this.canvas.removeEventListener(this._device.fullScreenChange, this._onFullScreenChange, true);
    delete this._onFullScreenChange;
  }
};

EZ3.ScreenManager.prototype.add = function(screen) {
  if (screen instanceof EZ3.Screen && !this.get(screen.id)) {
    screen.manager = this;
    screen.input = this.input;

    if (screen.preload) {
      screen.preload();
      screen.load.onComplete.add(screen.create, screen);
      screen.load.onComplete.add(function() {
        this._addEventListeners(screen);
        this._screens.unshift(screen);
      }, this);

      screen.load.start();
    } else {
      screen.create();
      this._addEventListeners(screen);
      this._screens.unshift(screen);
    }

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
  var screen;
  var i;

  this.renderer.clear();

  for (i = 0; i < this._screens.length; i++) {
    screen = this._screens[i];

    this.renderer.viewport(screen.position, screen.size);
    this.renderer.render(screen.scene, screen.camera);
    this._screens[i].update();
  }
};

EZ3.ScreenManager.prototype.fullScreen = function() {
  var that;

  if (this._device.requestFullScreen && !this.fullScreened) {
    that = this;

    this._onFullScreenChange = function(event) {
      that._processFullScreenChange(event);
    };

    this.canvas.addEventListener(this._device.fullScreenChange, this._onFullScreenChange, true);
    this.canvas[this._device.requestFullScreen]();
  }
};

EZ3.ScreenManager.prototype.windowed = function() {
  if (this._device.cancelFullScreen && this.fullScreened)
    this.canvas[this._device.cancelFullScreen]();
};
