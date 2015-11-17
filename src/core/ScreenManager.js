/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(canvas, bounds, renderer, time, input) {
  this._screens = [];

  this.canvas = canvas;
  this.bounds = bounds;
  this.renderer = renderer;
  this.time = time;
  this.input = input;
  this.fullScreeneded = false;
};

EZ3.ScreenManager.prototype._addScreenEventListeners = function(screen) {
  var device = EZ3.Device;
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
  var events;
  var i;
  var j;

  for (i in inputs) {
    events = inputs[i];

    for (j in events) {
      if (screen[events[j]])
        this.input[i][j].add(screen[events[j]], screen);
    }
  }

  if (screen.onResize)
    device.onResize.add(screen.onResize, screen);
};

EZ3.ScreenManager.prototype._removeScreenEventListeners = function(screen) {
  var device = EZ3.Device;
  var inputs = {
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
  var events;
  var i;
  var j;

  for (i in inputs) {
    events = inputs[i];

    for (j = 0; j < events.length; j++)
      screen.input[i][events[j]].removeAll(screen);
  }

  device.onResize.removeAll(screen);
};

EZ3.ScreenManager.prototype._processFullScreenChange = function() {
  var device = EZ3.Device;

  this.fullScreened = !this.fullScreened;

  if (!this.fullScreened) {
    this.canvas.removeEventListener(device.fullScreenChange, this._onFullScreenChange, true);
    delete this._onFullScreenChange;
  }
};

EZ3.ScreenManager.prototype.add = function(screen) {
  var onComplete;

  if (!this.get(screen.id)) {
    screen.manager = this;

    if (screen.load) {
      screen.load();

      if (screen.onLoadProgress)
        screen.requests.onProgress.add(screen.onLoadProgress, screen);

      onComplete = function(assets, failed, loaded) {
        if (screen.onLoadProgress)
          screen.requests.onProgress.remove(screen.onLoadProgress, screen);

        screen.requests.onComplete.remove(onComplete, this);

        screen.create.call(screen, assets, failed, loaded);

        this._addScreenEventListeners(screen);
        this._screens.unshift(screen);
      };

      screen.requests.onComplete.add(onComplete, this);

      screen.requests.send();
    } else {
      screen.create();
      this._addScreenEventListeners(screen);
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
      this._removeScreenEventListeners(this._screens[i]);
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

EZ3.ScreenManager.prototype.requestFullScreen = function() {
  var device = EZ3.Device;
  var that;

  if (device.requestFullScreen && !this.fullScreened) {
    that = this;

    this._onFullScreenChange = function(event) {
      that._processFullScreenChange(event);
    };

    this.canvas.addEventListener(device.fullScreenChange, this._onFullScreenChange, true);
    this.canvas[device.requestFullScreen]();
  }
};

EZ3.ScreenManager.prototype.exitFullScreen = function() {
  var device = EZ3.Device;

  if (device.exitFullScreen && this.fullScreened)
    document[device.exitFullScreen]();
};
