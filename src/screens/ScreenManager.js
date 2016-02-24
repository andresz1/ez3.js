/**
 * @class EZ3.ScreenManager
 * @constructor
 * @param {HTMLElement} canvas
 * @param {HTMLRect} bounds
 * @param {EZ3.Renderer} renderer
 * @param {EZ3.Time} time
 * @param {EZ3.InputManager} input
 * @param {EZ3.Screen|Object|Function} screen
 */
EZ3.ScreenManager = function(canvas, bounds, renderer, time, input, screen) {
  /**
   * @property {EZ3.Screen|Object[]} _screens
   * @private
   */
  this._screens = [];

  /**
   * @property {HTMLElement} canvas
   */
  this.canvas = canvas;
  /**
   * @property {HTMLRect} bounds
   */
  this.bounds = bounds;
  /**
   * @property {EZ3.Renderer} renderer
   */
  this.renderer = renderer;
  /**
   * @property {EZ3.Time} time
   */
  this.time = time;
  /**
   * @property {EZ3.InputManager} input
   */
  this.input = input;
  /**
   * @property {EZ3.Vector4} clearColor
   * @default new EZ3.Vector4(0, 0, 0, 1)
   */
  this.clearColor = new EZ3.Vector4(0, 0, 0, 1);
  /**
   * @property {Boolean} fullScreeneded
   * @default false
   */
  this.fullScreeneded = false;

  if (screen)
    this.add('default', screen);
};

/**
 * @method EZ3.ScreenManager#_addScreenEventListeners
 * @param {EZ3.Screen|Object} screen
 */
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

/**
 * @method EZ3.ScreenManager#_removeScreenEventListeners
 * @param {EZ3.Screen|Object} screen
 */
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

/**
 * @method EZ3.ScreenManager#_processFullScreenChange
 */
EZ3.ScreenManager.prototype._processFullScreenChange = function() {
  var device = EZ3.Device;

  this.fullScreened = !this.fullScreened;

  if (!this.fullScreened) {
    this.canvas.removeEventListener(device.fullScreenChange, this._onFullScreenChange, true);
    delete this._onFullScreenChange;
  }
};

/**
 * @method EZ3.ScreenManager#add
 * @param {String} id
 * @param {EZ3.Screen|Object|Function} screen
 * @return {EZ3.Screen|Object}
 */
EZ3.ScreenManager.prototype.add = function(id, screen) {
  var Screen;
  var onComplete;

  if(!(screen instanceof EZ3.Screen)) {
    if (typeof screen === 'function') {
      Screen = screen;
      screen = new Screen();
    } else if (typeof screen !== 'object')
      return;

    screen.load = new EZ3.RequestManager();
    screen.scene = new EZ3.Scene();
    screen.camera = null;

    if (!screen.position)
      screen.position = new EZ3.Vector2();

    if (!screen.size)
      screen.size = new EZ3.Vector2(this.canvas.width, this.canvas.height);
  }

  screen.id = id;
  screen.manager = this;

  if (screen.preload) {
    screen.preload();

    if (screen.onLoadProgress)
      screen.load.onProgress.add(screen.onLoadProgress, screen);

    onComplete = function(assets, failed, loaded) {
      if (screen.onLoadProgress)
        screen.load.onProgress.remove(screen.onLoadProgress, screen);

      screen.load.onComplete.remove(onComplete, this);

      screen.create.call(screen, assets, failed, loaded);

      this._addScreenEventListeners(screen);
      this._screens.unshift(screen);
    };

    screen.load.onComplete.add(onComplete, this);

    screen.load.start();
  } else {
    screen.create();
    this._addScreenEventListeners(screen);
    this._screens.unshift(screen);
  }

  return screen;
};

/**
 * @method EZ3.ScreenManager#get
 * @param {String} id
 * @return {EZ3.Screen|Object}
 */
EZ3.ScreenManager.prototype.get = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++)
    if (this._screens[i].id === id)
      return this._screens[i];
};

/**
 * @method EZ3.ScreenManager#add
 * @param {String} id
 * @param {EZ3.Screen|Object} screen
 */
EZ3.ScreenManager.prototype.remove = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++) {
    if (this._screens[i].id === id) {
      this._removeScreenEventListeners(this._screens[i]);
      return this._screens.splice(i, 1);
    }
  }
};

/**
 * @method EZ3.ScreenManager#update
 */
EZ3.ScreenManager.prototype.update = function() {
  var screen;
  var i;

  this.renderer.clearColor(this.clearColor);
  this.renderer.clear();

  for (i = 0; i < this._screens.length; i++) {
    screen = this._screens[i];

    if (screen.world)
      screen.world.update();

    this._screens[i].update();

    this.renderer.render(screen.position, screen.size, screen.scene, screen.camera);
  }
};

/**
 * @method EZ3.ScreenManager#requestFullScreen
 */
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

/**
 * @method EZ3.ScreenManager#exitFullScreen
 */
EZ3.ScreenManager.prototype.exitFullScreen = function() {
  var device = EZ3.Device;

  if (device.exitFullScreen && this.fullScreened)
    document[device.exitFullScreen]();
};
