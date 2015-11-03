var EZ3 = {
  VERSION: '1.0.0'
};

EZ3.extends = function(destination, source) {
  var k;

  for (k in source)
    if (source.hasOwnProperty(k))
      destination[k] = source[k];
};

/**
 * @class Camera
 */

EZ3.Camera = function(position, target, up, mode, filter) {
  EZ3.Entity.call(this);

  this._filterBuffer = [];
  this._filter = filter || true;
  this._rotationAngles = new EZ3.Vector2();
  this._mode = mode || EZ3.Camera.PERSPECTIVE;

  this.fov = 70.0;
  this.aspectRatio = 1.0;
  this.planes = {};
  this.planes.near = 0.1;
  this.planes.far = 1000.0;
  this.look = new EZ3.Vector3(0, 0, -1);
  this.right = new EZ3.Vector3(1, 0, 0);

  if (position instanceof EZ3.Vector3)
    this.position = position;
  else
    this.position = new EZ3.Vector3(5, 5, 5);

  if (target instanceof EZ3.Vector3)
    this.target = target;
  else
    this.target = new EZ3.Vector3();

  if (up instanceof EZ3.Vector3)
    this.up = up;
  else
    this.up = new EZ3.Vector3(0, 1, 0);

  this._setupRotationAngles();
};

EZ3.Camera.prototype.constructor = EZ3.Camera;

EZ3.Camera.prototype._setupRotationAngles = function() {
  var yaw;
  var pitch;

  this.look = new EZ3.Vector3().sub(this.position, this.target).normalize();

  yaw = EZ3.Math.toDegrees(Math.atan2(this.look.z, this.look.x) + EZ3.Math.PI);
  pitch = EZ3.Math.toDegrees(Math.asin(this.look.y));

  this._rotationAngles.x = yaw;
  this._rotationAngles.y = pitch;
};

EZ3.Camera.prototype._filterMoves = function(dx, dy) {
  var averageX = 0;
  var averageY = 0;
  var averageTotal = 0;
  var currentWeight = 1.0;
  var k;

  if (!this._filterBuffer.length)
    for (k = 0; k < EZ3.Camera.FILTER_BUFFER_SIZE; ++k)
      this._filterBuffer.push(new EZ3.Vector2(dx, dy));

  for (k = EZ3.Camera.FILTER_BUFFER_SIZE - 1; k > 0; k--)
    this._filterBuffer[k] = this._filterBuffer[k - 1];

  this._filterBuffer[0] = new EZ3.Vector2(dx, dy);

  for (k = 0; k < EZ3.Camera.FILTER_BUFFER_SIZE; k++) {
    averageX += this._filterBuffer[k].x * currentWeight;
    averageY += this._filterBuffer[k].y * currentWeight;
    averageTotal += currentWeight;

    currentWeight *= EZ3.Camera.FILTER_WEIGHT;
  }

  return new EZ3.Vector2(averageX, averageY).scaleEqual(1.0 / averageTotal);
};

EZ3.Camera.prototype.rotate = function(dx, dy) {
  var rx;
  var ry;

  this._rotationAngles.x -= dx * EZ3.Camera.ROTATION_SPEED;
  this._rotationAngles.y += dy * EZ3.Camera.ROTATION_SPEED;

  if (this._filter) {
    rx = this._rotationAngles.x;
    ry = this._rotationAngles.y;
    this._rotationAngles = this._filterMoves(rx, ry);
  }
};

Object.defineProperty(EZ3.Camera.prototype, 'view', {
  get: function() {
    this._update();
    return new EZ3.Matrix4().lookAt(this.position, this.target, this.up);
  }
});

Object.defineProperty(EZ3.Camera.prototype, 'projection', {
  get: function() {
    if (this._mode === EZ3.Camera.PERSPECTIVE)
      return new EZ3.Matrix4().perspective(
        this.fov,
        this.aspectRatio,
        this.planes.near,
        this.planes.far
      );
    else
      return new EZ3.Matrix4().ortho(
        this.planes.left,
        this.planes.right,
        this.planes.bottom,
        this.planes.top,
        this.planes.near,
        this.planes.far
      );
  }
});

EZ3.Camera.PERSPECTIVE = 0;
EZ3.Camera.ORTHOGRAPHIC = 1;
EZ3.Camera.MOVE_SPEED = 50;
EZ3.Camera.ROTATION_SPEED = 300;
EZ3.Camera.FILTER_WEIGHT = 0.75;
EZ3.Camera.FILTER_BUFFER_SIZE = 10;

/**
 * @class Cache
 */

EZ3.Cache = function() {
  this.ASSET = {};
  this.ASSET.IMAGE = 0;
  this.ASSET.DATA = 1;
  this.ASSET.ENTITY = 2;

  this._assets = [];
  this._assets[this.ASSET.IMAGE] = {};
  this._assets[this.ASSET.DATA] = {};
  this._assets[this.ASSET.ENTITY] = {};
};

EZ3.Cache = new EZ3.Cache();

EZ3.Cache.add = function(url, asset) {
  if (asset instanceof Image)
    this._assets[this.ASSET.IMAGE][url] = asset;
  else if (asset instanceof XMLHttpRequest)
    this._assets[this.ASSET.DATA][url] = asset;
  else if (asset instanceof EZ3.Entity)
    this._assets[this.ASSET.ENTITY][url] = asset;
};

EZ3.Cache.image = function(url) {
  return this._assets[this.ASSET.IMAGE][url];
};

EZ3.Cache.data = function(url) {
  return this._assets[this.ASSET.DATA][url];
};

EZ3.Cache.entity = function(url) {
  return this._assets[this.ASSET.ENTITY][url];
};

/**
 * @class Engine
 */

EZ3.Engine = function(canvas, options) {
  this._animationFrame = null;
  this._renderer = null;

  this.device = EZ3.Device;
  this.time = null;
  this.input = null;
  this.screens = null;

  this.device.onReady(this._init, this, [
    canvas,
    options
  ]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  this._animationFrame = new EZ3.AnimationFrame(false);
  this._renderer = new EZ3.Renderer(canvas, options);

  this.time = new EZ3.Time();
  this.input = new EZ3.InputManager(canvas);
  this.screens = new EZ3.ScreenManager(canvas, this._renderer, this.time, this.input);

  this._renderer.initContext();
  this.time.start();
  this._update();
};

EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this.time.update();
  this._animationFrame.request(this._update.bind(this));
};

/**
 * @class Entity
 */

EZ3.Entity = function() {
  this.parent = null;
  this.children = [];

  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();

  if(this instanceof EZ3.Mesh)
    this.normal = new EZ3.Matrix3();

  this.scale = new EZ3.Vector3(1, 1, 1);
  this.position = new EZ3.Vector3(0, 0, 0);
  this.rotation = new EZ3.Quaternion(1, 0, 0, 0);
};

EZ3.Entity.prototype.add = function(child) {
  if (child instanceof EZ3.Entity) {
    if (child.parent)
      child.parent.remove(child);

    child.parent = this;
    this.children.push(child);
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if (~position)
    this.children.splice(position, 1);
};

EZ3.Entity.prototype.updateWorld = function() {
  var k;

  if(this.position.dirty || this.rotation.dirty || this.scale.dirty) {
    this.model.fromRotationTranslation(this.model, this.rotation, this.position);
    this.model.scale(this.model, this.scale);

    this.scale.dirty = false;
    this.position.dirty = false;
    this.rotation.dirty = false;
  }

  if (!this.parent) {
    if(this.model.dirty) {

      this.world.copy(this.model);

      for(k = 0; k < this.children.length; k++)
        this.children[k].world.dirty = true;

      this.model.dirty = false;

      if(this instanceof EZ3.Mesh)
        this.normal.dirty = true;
    }
  } else {
    if(this.world.dirty || this.model.dirty) {

      this.world.mul(this.model, this.parent.world);

      for(k = 0; k < this.children.length; k++)
        this.children[k].world.dirty = true;

      this.model.dirty = false;
      this.world.dirty = false;

      if(this instanceof EZ3.Mesh)
        this.normal.dirty = true;
    }
  }
};

EZ3.Scene = function() {
  EZ3.Entity.call(this);
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;

/**
 * @class Screen
 */

EZ3.Screen = function(id, position, size) {
  this.id = id;
  this.position = position;
  this.size = size;
  this.load = new EZ3.LoadManager();
  this.scene = new EZ3.Scene();
  this.camera = null;
};

EZ3.Screen.prototype.onKeyPress = function() {};

EZ3.Screen.prototype.onKeyDown = function() {};

EZ3.Screen.prototype.onKeyUp = function() {};

EZ3.Screen.prototype.onMousePress = function() {};

EZ3.Screen.prototype.onMouseMove = function() {};

EZ3.Screen.prototype.onMouseUp = function() {};

EZ3.Screen.prototype.onTouchPress = function() {};

EZ3.Screen.prototype.onTouchMove = function() {};

EZ3.Screen.prototype.onTouchUp = function() {};

EZ3.Screen.prototype.create = function() {};

EZ3.Screen.prototype.update = function() {};

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

/**
 * @class Signal
 */

EZ3.Signal = function() {
  var that;

  this._bindings = [];
  this._prevParams = null;

  that = this;

  this.dispatch = function() {
    EZ3.Signal.prototype.dispatch.apply(that, arguments);
  };
};

EZ3.Signal.prototype._shouldPropagate = true;
EZ3.Signal.prototype.memorize = false;
EZ3.Signal.prototype.active = true;

EZ3.Signal.prototype._registerListener = function(listener, isOnce, listenerContext, priority) {
  var prevIndex, binding;

  prevIndex = this._indexOfListener(listener, listenerContext);

  if (prevIndex !== -1) {
    binding = this._bindings[prevIndex];

    if (binding.isOnce !== isOnce)
      throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
  } else {
    binding = new EZ3.SignalBinding(this, listener, isOnce, listenerContext, priority);
    this._addBinding(binding);
  }

  if (this.memorize && this._prevParams)
    binding.execute(this._prevParams);

  return binding;
};

EZ3.Signal.prototype._addBinding = function(binding) {
  var n;

  n = this._bindings.length;

  do {
    --n;
  } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);

  this._bindings.splice(n + 1, 0, binding);
};

EZ3.Signal.prototype._indexOfListener = function(listener, context) {
  var n, cur;

  n = this._bindings.length;

  while (n--) {
    cur = this._bindings[n];

    if (cur.listener === listener && cur.context === context)
      return n;
  }

  return -1;
};

EZ3.Signal.prototype.has = function(listener, context) {
  return this._indexOfListener(listener, context) !== -1;
};

EZ3.Signal.prototype.add = function(listener, listenerContext, priority) {
  return this._registerListener(listener, false, listenerContext, priority);
};

EZ3.Signal.prototype.addOnce = function(listener, listenerContext, priority) {
  return this._registerListener(listener, true, listenerContext, priority);
};

EZ3.Signal.prototype.remove = function(listener, context) {
  var i;

  i = this._indexOfListener(listener, context);

  if (i !== -1) {
    this._bindings[i]._destroy();
    this._bindings.splice(i, 1);
  }

  return listener;
};

EZ3.Signal.prototype.removeAll = function(context) {
  var n;

  n = this._bindings.length;

  if (context) {
    while (n--) {
      if (this._bindings[n].context === context) {
        this._bindings[n]._destroy();
        this._bindings.splice(n, 1);
      }
    }
  } else {
    while (n--)
      this._bindings[n]._destroy();

    this._bindings.length = 0;
  }
};

EZ3.Signal.prototype.getNumListeners = function() {
  return this._bindings.length;
};

EZ3.Signal.prototype.halt = function() {
  this._shouldPropagate = false;
};

EZ3.Signal.prototype.dispatch = function(params) {
  var paramsArr, n, bindings;

  if (!this.active)
    return;

  paramsArr = Array.prototype.slice.call(arguments);
  n = this._bindings.length;

  if (this.memorize)
    this._prevParams = paramsArr;

  if (!n)
    return;

  bindings = this._bindings.slice();
  this._shouldPropagate = true;

  do {
    n--;
  } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
};

EZ3.Signal.prototype.forget = function() {
  this._prevParams = null;
};

EZ3.Signal.prototype.dispose = function() {
  this.removeAll();
  delete this._bindings;
  delete this._prevParams;
};

/**
 * @class SignalBinding
 */

EZ3.SignalBinding = function(signal, listener, isOnce, listenerContext, priority) {
  this._signal = signal;
  this._priority = priority || 0;

  this.listener = listener;
  this.isOnce = isOnce;
  this.context = listenerContext;
};

EZ3.SignalBinding.prototype.active = true;
EZ3.SignalBinding.prototype.params = null;

EZ3.SignalBinding.prototype._destroy = function() {
  delete this._signal;
  delete this.listener;
  delete this.context;
};

EZ3.SignalBinding.prototype.execute = function(paramsArr) {
  var handlerReturn, params;

  if (this.active && !!this.listener) {
    params = this.params ? this.params.concat(paramsArr) : paramsArr;
    handlerReturn = this.listener.apply(this.context, params);
    if (this.isOnce) {
      this.detach();
    }
  }
  return handlerReturn;
};

EZ3.SignalBinding.prototype.detach = function() {
  return this.isBound() ? this._signal.remove(this.listener, this.context) : null;
};

EZ3.SignalBinding.prototype.isBound = function() {
  return (!!this._signal && !!this.listener);
};

/**
 * @class InputManager
 */

EZ3.InputManager = function(canvas) {
  this.keyboard = new EZ3.Keyboard();
  this.mouse = new EZ3.Mouse(canvas);
  this.touch = new EZ3.Touch(canvas);
};

/**
 * @class Keboard
 */

EZ3.Keyboard = function() {
  this._keys = [];

  this.enabled = false;
  this.onKeyPress = new EZ3.Signal();
  this.onKeyDown = new EZ3.Signal();
  this.onKeyUp = new EZ3.Signal();
};

EZ3.Keyboard.prototype.constructor = EZ3.Keyboard;

EZ3.Keyboard.prototype._processKeyDown = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Switch(event.keyCode);

  if(this._keys[event.keyCode].processDown())
    this.onKeyPress.dispatch(this._keys[event.keyCode]);

  this.onKeyDown.dispatch(this._keys[event.keyCode]);
};

EZ3.Keyboard.prototype._processKeyUp = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Switch(event.keyCode);

  this._keys[event.keyCode].processUp();
  this.onKeyUp.dispatch(this._keys[event.keyCode]);
};

EZ3.Keyboard.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onKeyDown = function(event) {
    that._processKeyDown(event);
  };
  this._onKeyUp = function(event) {
    that._processKeyUp(event);
  };

  window.addEventListener('keydown', this._onKeyDown, false);
	window.addEventListener('keyup', this._onKeyUp, false);
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;

  window.removeEventListener('keydown', this._onKeyDown);
	window.removeEventListener('keyup', this._onKeyUp);

  delete this._onKeyDown;
  delete this._onKeyUp;
};

EZ3.Keyboard.prototype.getKey = function(code) {
  if(!this._keys[code])
    this._keys[code] = new EZ3.Switch(code);

  return this._keys[code];
};

EZ3.Keyboard.A = 'A'.charCodeAt(0);
EZ3.Keyboard.B = 'B'.charCodeAt(0);
EZ3.Keyboard.C = 'C'.charCodeAt(0);
EZ3.Keyboard.D = 'D'.charCodeAt(0);
EZ3.Keyboard.E = 'E'.charCodeAt(0);
EZ3.Keyboard.F = 'F'.charCodeAt(0);
EZ3.Keyboard.G = 'G'.charCodeAt(0);
EZ3.Keyboard.H = 'H'.charCodeAt(0);
EZ3.Keyboard.I = 'I'.charCodeAt(0);
EZ3.Keyboard.J = 'J'.charCodeAt(0);
EZ3.Keyboard.K = 'K'.charCodeAt(0);
EZ3.Keyboard.L = 'L'.charCodeAt(0);
EZ3.Keyboard.M = 'M'.charCodeAt(0);
EZ3.Keyboard.N = 'N'.charCodeAt(0);
EZ3.Keyboard.O = 'O'.charCodeAt(0);
EZ3.Keyboard.P = 'P'.charCodeAt(0);
EZ3.Keyboard.Q = 'Q'.charCodeAt(0);
EZ3.Keyboard.R = 'R'.charCodeAt(0);
EZ3.Keyboard.S = 'S'.charCodeAt(0);
EZ3.Keyboard.T = 'T'.charCodeAt(0);
EZ3.Keyboard.U = 'U'.charCodeAt(0);
EZ3.Keyboard.V = 'V'.charCodeAt(0);
EZ3.Keyboard.W = 'W'.charCodeAt(0);
EZ3.Keyboard.X = 'X'.charCodeAt(0);
EZ3.Keyboard.Y = 'Y'.charCodeAt(0);
EZ3.Keyboard.Z = 'Z'.charCodeAt(0);
EZ3.Keyboard.ZERO = '0'.charCodeAt(0);
EZ3.Keyboard.ONE = '1'.charCodeAt(0);
EZ3.Keyboard.TWO = '2'.charCodeAt(0);
EZ3.Keyboard.THREE = '3'.charCodeAt(0);
EZ3.Keyboard.FOUR = '4'.charCodeAt(0);
EZ3.Keyboard.FIVE = '5'.charCodeAt(0);
EZ3.Keyboard.SIX = '6'.charCodeAt(0);
EZ3.Keyboard.SEVEN = '7'.charCodeAt(0);
EZ3.Keyboard.EIGHT = '8'.charCodeAt(0);
EZ3.Keyboard.NINE = '9'.charCodeAt(0);
EZ3.Keyboard.NUMPAD_0 = 96;
EZ3.Keyboard.NUMPAD_1 = 97;
EZ3.Keyboard.NUMPAD_2 = 98;
EZ3.Keyboard.NUMPAD_3 = 99;
EZ3.Keyboard.NUMPAD_4 = 100;
EZ3.Keyboard.NUMPAD_5 = 101;
EZ3.Keyboard.NUMPAD_6 = 102;
EZ3.Keyboard.NUMPAD_7 = 103;
EZ3.Keyboard.NUMPAD_8 = 104;
EZ3.Keyboard.NUMPAD_9 = 105;
EZ3.Keyboard.NUMPAD_MULTIPLY = 106;
EZ3.Keyboard.NUMPAD_ADD = 107;
EZ3.Keyboard.NUMPAD_ENTER = 108;
EZ3.Keyboard.NUMPAD_SUBTRACT = 109;
EZ3.Keyboard.NUMPAD_DECIMAL = 110;
EZ3.Keyboard.NUMPAD_DIVIDE = 111;
EZ3.Keyboard.F1 = 112;
EZ3.Keyboard.F2 = 113;
EZ3.Keyboard.F3 = 114;
EZ3.Keyboard.F4 = 115;
EZ3.Keyboard.F5 = 116;
EZ3.Keyboard.F6 = 117;
EZ3.Keyboard.F7 = 118;
EZ3.Keyboard.F8 = 119;
EZ3.Keyboard.F9 = 120;
EZ3.Keyboard.F10 = 121;
EZ3.Keyboard.F11 = 122;
EZ3.Keyboard.F12 = 123;
EZ3.Keyboard.F13 = 124;
EZ3.Keyboard.F14 = 125;
EZ3.Keyboard.F15 = 126;
EZ3.Keyboard.COLON = 186;
EZ3.Keyboard.EQUALS = 187;
EZ3.Keyboard.COMMA = 188;
EZ3.Keyboard.UNDERSCORE = 189;
EZ3.Keyboard.PERIOD = 190;
EZ3.Keyboard.QUESTION_MARK = 191;
EZ3.Keyboard.TILDE = 192;
EZ3.Keyboard.OPEN_BRACKET = 219;
EZ3.Keyboard.BACKWARD_SLASH = 220;
EZ3.Keyboard.CLOSED_BRACKET = 221;
EZ3.Keyboard.QUOTES = 222;
EZ3.Keyboard.BACKSPACE = 8;
EZ3.Keyboard.TAB = 9;
EZ3.Keyboard.CLEAR = 12;
EZ3.Keyboard.ENTER = 13;
EZ3.Keyboard.SHIFT = 16;
EZ3.Keyboard.CONTROL = 17;
EZ3.Keyboard.ALT = 18;
EZ3.Keyboard.CAPS_LOCK = 20;
EZ3.Keyboard.ESC = 27;
EZ3.Keyboard.SPACEBAR = 32;
EZ3.Keyboard.PAGE_UP = 33;
EZ3.Keyboard.PAGE_DOWN = 34;
EZ3.Keyboard.END = 35;
EZ3.Keyboard.HOME = 36;
EZ3.Keyboard.LEFT = 37;
EZ3.Keyboard.UP = 38;
EZ3.Keyboard.RIGHT = 39;
EZ3.Keyboard.DOWN = 40;
EZ3.Keyboard.PLUS = 43;
EZ3.Keyboard.MINUS = 44;
EZ3.Keyboard.INSERT = 45;
EZ3.Keyboard.DELETE = 46;
EZ3.Keyboard.HELP = 47;
EZ3.Keyboard.NUM_LOCK = 144;

/**
 * @class Mouse
 */

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;
  this._device = EZ3.Device;

  this.enabled = false;
  this.pointer = new EZ3.MousePointer(domElement);
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
  this.onLockChange = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this.onPress, this.onMove);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this.onMove);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

EZ3.Mouse.prototype._processMouseLockChange = function() {
  if (this.pointer.locked) {
    document.removeEventListener(this._device.pointerLockChange, this._onMouseLockChange, true);

    delete this._onMouseLockChange;
  }

  this.pointer.processLockChange(this.onLockChange);
};

EZ3.Mouse.prototype.lock = function() {
  var that;

  if (this._device.requestPointerLock && !this.pointer.locked) {
    that = this;

    this._onMouseLockChange = function(event) {
      that._processMouseLockChange(event);
    };

    document.addEventListener(this._device.pointerLockChange, this._onMouseLockChange, true);

    this._domElement[this._device.requestPointerLock]();
  }
};

EZ3.Mouse.prototype.unlock = function() {
  if (this._device.cancelPointerLock && this.pointer.locked)
    this._domElement[this._device.cancelPointerLock]();
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePress = function(event) {
    that._processMousePress(event);
  };

  this._onMouseMove = function(event) {
    that._processMouseMove(event);
  };

  this._onMouseUp = function(event) {
    that._processMouseUp(event);
  };

  this._onMouseWheel = function(event) {
    that._processMouseWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onMousePress, true);
  this._domElement.addEventListener('mousemove', this._onMouseMove, true);
  this._domElement.addEventListener('mouseup', this._onMouseUp, true);
  this._domElement.addEventListener('mousewheel', this._onMouseWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onMouseWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMouserDown, true);
  this._domElement.removeEventListener('mousemove', this._onMouseMove, true);
  this._domElement.removeEventListener('mouseup', this._onMouseUp, true);
  this._domElement.removeEventListener('mousewheel', this._onMouseWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onMouseWheel, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;
  delete this._onMouseWheel;
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.MIDDLE_BUTTON = 1;
EZ3.Mouse.RIGHT_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;

/**
 * @class Pointer
 */

EZ3.Pointer = function(domElement) {
  this._domElement = domElement;
  this._bound = domElement.getBoundingClientRect();
  console.log(this._bound);

  this.page = new EZ3.Vector2();
  this.client = new EZ3.Vector2();
  this.screen = new EZ3.Vector2();
  this.position = new EZ3.Vector2();
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Pointer.prototype.processPress = function(event) {
  EZ3.Pointer.prototype.processMove.call(this, event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  this.page.set(event.pageX, event.pageY);
  this.client.set(event.clientX, event.clientY);
  this.screen.set(event.screenX, event.screenY);

  this.position.x = Math.round((event.clientX - this._bound.left) / (this._bound.right - this._bound.left) * this._domElement.width);
  this.position.y = Math.round((event.clientY - this._bound.top) / (this._bound.bottom - this._bound.top) * this._domElement.height);
};

/**
 * @class Switch
 */

EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;

EZ3.Switch.prototype.processPress = function() {
  this._state = true;
};

EZ3.Switch.prototype.processDown = function() {
  var isUp = this.isUp();

  this._state = true;

  return isUp;
};

EZ3.Switch.prototype.processUp = function() {
  this._state = false;
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

/**
 * @class Touch
 */

EZ3.Touch = function(domElement) {
  this._device = EZ3.Device;
  this._domElement = domElement;
  this._pointers = [];

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

EZ3.Touch.prototype._searchPointerIndex = function(id) {
  for (var i = 0; i < this._pointers.length; i++)
    if (id === this._pointers[i].id)
      return i;

  return -1;
};

EZ3.Touch.prototype._processTouchPress = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var found = false;

    for (var j = 0; j < EZ3.Touch.MAX_NUM_OF_POINTERS; j++) {
      if (!this._pointers[j]) {
        this._pointers[j] = new EZ3.TouchPointer(this._domElement, j, event.changedTouches[i].identifier);
        found = true;
        break;
      } else if (this._pointers[j].isUp()) {
        this._pointers[j].id = event.changedTouches[i].identifier;
        found = true;
        break;
      }
    }

    if (found)
      this._pointers[j].processPress(event.changedTouches[i], this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processMove(event.changedTouches[i], this.onMove);
  }
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processUp(this.onUp);
  }
};

EZ3.Touch.prototype.enable = function() {
  if (this._device.touchDown) {
    var that = this;

    this.enabled = true;

    this._onTouchPress = function(event) {
      that._processTouchPress(event);
    };

    this._onTouchMove = function(event) {
      that._processTouchMove(event);
    };

    this._onTouchUp = function(event) {
      that._processTouchUp(event);
    };

    this._domElement.addEventListener(this._device.touchDown, this._onTouchPress, false);
    this._domElement.addEventListener(this._device.touchMove, this._onTouchMove, false);
    this._domElement.addEventListener(this._device.touchUp, this._onTouchUp, false);
  }
};

EZ3.Touch.prototype.disable = function() {
  if (this._device.touchDown) {
    this.enabled = false;

    this._domElement.removeEventListener(this._device.touchDown, this._onTouchPress, false);
    this._domElement.removeEventListener(this._device.touchMove, this._onTouchMove, false);
    this._domElement.removeEventListener(this._device.touchUp, this._onTouchUp, false);

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;
  }
};

EZ3.Touch.prototype.getPointer = function(code) {
  if (!this._pointers[code])
    this._pointers[code] = new EZ3.TouchPointer(this._domElement, code);

  return this._pointers[code];
};

EZ3.Touch.POINTER_1 = 0;
EZ3.Touch.POINTER_2 = 1;
EZ3.Touch.POINTER_3 = 2;
EZ3.Touch.POINTER_4 = 3;
EZ3.Touch.POINTER_5 = 4;
EZ3.Touch.POINTER_6 = 5;
EZ3.Touch.POINTER_7 = 6;
EZ3.Touch.POINTER_8 = 7;
EZ3.Touch.POINTER_9 = 8;
EZ3.Touch.POINTER_10 = 9;
EZ3.Touch.MAX_NUM_OF_POINTERS = 10;

/**
 * @class Light
 */

EZ3.Light = function() {
  EZ3.Entity.call(this);

  this.diffuse = new EZ3.Vector3(1.0, 1.0, 1.0);
  this.specular = new EZ3.Vector3(1.0, 1.0, 1.0);
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;

EZ3.Light.prototype.updateUniforms = function(gl, program, prefix) {
  program.loadUniformf(gl, prefix + 'diffuse', 3, this.diffuse);
  program.loadUniformf(gl, prefix + 'specular', 3, this.specular);
};

/**
 * @class Data
 */

EZ3.Data = function(url, crossOrigin, responseType) {
  this.url = url;
  this.crossOrigin = crossOrigin;
  this.responseType = responseType;
  this.content = new XMLHttpRequest();
};

EZ3.Data.prototype._processLoad = function(request, onLoad) {
  this._removeEventHandlers();
  onLoad(this.url, request);
};

EZ3.Data.prototype._processError = function(event, onError) {
  this._removeEventHandlers();
  onError(this.url, event);
};

EZ3.Data.prototype.load = function(onLoad, onError) {
  var that;

  that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function(event) {
    that._processError(event, onLoad);
  };

  this.content.open('GET', this.url, true);

  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  if (this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  if (this.responseType)
    this.content.responseType = this.responseType;

  this.content.send(null);
};

EZ3.Data.prototype._removeEventHandlers = function() {
  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

/**
 * @class Image
 */

EZ3.Image = function(url, crossOrigin) {
  this.url = url;
  this.crossOrigin = crossOrigin;
  this.content = new Image();
};

EZ3.Image.prototype._processLoad = function(image, onLoad) {
  this._removeEventHandlers();
  onLoad(this.url, image);
};

EZ3.Image.prototype._processError = function(event, onError) {
  this._removeEventHandlers();
  onError(this.url, event);
};

EZ3.Image.prototype.load = function(onLoad, onError) {
  var that;

  that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function(event) {
    that._processError(event, onLoad);
  };

  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  if (!this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.src = this.url;
};

EZ3.Image.prototype._removeEventHandlers = function() {
  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

/**
 * @class LoadManager
 */

EZ3.LoadManager = function() {
  this._cache = EZ3.Cache;
  this._files = {};

  this.started = false;
  this.filesToLoad = 0;
  this.loadedFiles = 0;
  this.failedFiles = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.LoadManager.prototype._processLoad = function(url, data) {
  this.loadedFiles++;

  this._cache.add(url, data);
  this._processProgress(url);
};

EZ3.LoadManager.prototype._processError = function(url, data) {
  this.failedFiles++;

  this._processProgress(url, data);
};

EZ3.LoadManager.prototype._processProgress = function(url, error) {
  var loadedFiles, failedFiles;

  this.onProgress.dispatch(url, error, this.loadedFiles, this.failedFiles, this.filesToLoad);

  if(this.filesToLoad === this.loadedFiles + this.failedFiles) {
    loadedFiles = this.loadedFiles;
    failedFiles = this.failedFiles;

    this._files = {};
    this.filesToLoad = 0;
    this.loadedFiles = 0;
    this.failedFiles = 0;
    this.started = false;

    this.onComplete.dispatch(failedFiles, loadedFiles);
  }
};

EZ3.LoadManager.prototype.data = function(url, crossOrigin, responseType) {
  var cached;

  cached = this._cache.data(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Data(url, crossOrigin, responseType);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.image = function(url, crossOrigin) {
  var cached;

  cached = this._cache.image(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Image(url, crossOrigin);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.obj = function(url, crossOrigin) {
  var cached;

  cached = this._cache.entity(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Obj(url, crossOrigin);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.start = function() {
  var i;

  if (!this.filesToLoad)
    this.onComplete.dispatch(0, 0);

  this.started = true;

  for (i in this._files)
    this._files[i].load(this._processLoad.bind(this), this._processError.bind(this));
};

/**
 * @class Obj
 */

EZ3.Obj = function(url, crossOrigin) {
  this.url = url;
  this.crossOrigin = crossOrigin;
  this.content = new EZ3.Entity();
};

EZ3.Obj.prototype._parseMaterial = function() {

};

EZ3.Obj.prototype._parse = function(data, onLoad, onError) {
  var that, patterns, lines, line, result;
  var mtllibs, materials, material, geometry, mesh, indices, vertices, normals, uvs;
  var i;

  function triangulate(face) {
    var data, i;

    data = [];
    face = face.trim().split(' ');

    for (i = 1; i < face.length - 1; i++)
      data.push(face[0], face[i], face[i + 1]);

    return data;
  }

  function processVertex(vertex) {
    var i;

    for (i = 1; i < 4; i++)
      vertices.push(parseFloat(vertex[i]));
  }

  function processNormal(normal) {
    var i;

    for (i = 1; i < 4; i++)
      normals.push(parseFloat(normal[i]));
  }

  function processUv(uv) {
    var i;

    for (i = 1; i < 3; i++)
      uvs.push(parseFloat(uv[i]));
  }

  function processFace1(face) {
    var i;
    for (i = 0; i < face.length; i++)
      indices.vertex.push(parseInt(face[i]) - 1);
  }

  function processFace2(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.uv.push(parseInt(point[1]) - 1);
    }
  }

  function processFace3(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.uv.push(parseInt(point[1]) - 1);
      indices.normal.push(parseInt(point[2]) - 1);
    }
  }

  function processFace4(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('//');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.normal.push(parseInt(point[1]) - 1);
    }
  }

  function computeNormals() {
    var indicesCount;
    var i, j, k;
    var buffer;

    indicesCount = [];

    buffer = new EZ3.VertexBuffer();
    buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
    geometry.buffers.add('normal', buffer);

    for (i = 0; i < vertices.length / 3; i++) {
      indicesCount.push(0);

      for (j = 0; j < 3; j++)
        buffer.data.push(0);
    }

    for (i = 0; i < indices.vertex.length; i++) {
      indicesCount[indices.vertex[i]]++;

      for (j = 0; j < 3; j++)
        buffer.data[3 * indices.vertex[i] + j] += normals[3 * indices.normal[i] + j];
    }

    for (i = 0, j = 0; i < vertices.length; i += 3, j++)
      for (k = 0; k < 3; k++)
        buffer.data[i + k] /= indicesCount[j];
  }

  function computeUvs() {
    var i, j;
    var buffer;

    buffer = new EZ3.VertexBuffer();
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    geometry.buffers.add('uv', buffer);

    for (i = 0; i < indices.vertex.length; i++)
      for (j = 0; j < 2; j++)
        buffer.data[2 * indices.vertex[i] + j] = uvs[2 * indices.uv[i] + j];
  }

  function processMesh() {
    var buffer;

    if (indices.vertex.length > 0 && vertices.length > 0) {
      buffer = new EZ3.IndexBuffer(indices.vertex, false, true);
      geometry.buffers.add('triangle', buffer);

      buffer = new EZ3.VertexBuffer(vertices);
      buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
      geometry.buffers.add('position', buffer);

      if (indices.normal.length && normals.length)
        computeNormals();

      if (indices.uv.length && uvs.length)
        computeUvs();

      console.log('2');

      that.content.add(mesh);

      material = new EZ3.MeshMaterial();
      geometry = new EZ3.Geometry();
      mesh = new EZ3.Mesh(geometry, material);

      indices.vertex = [];
      indices.normal = [];
      indices.uv = [];
    }
  }

  function processMaterials() {
    var load, data, tokens, baseUrl;
    var i;

    load = new EZ3.LoadManager();
    data = [];

    tokens = that.url.split('/');
    baseUrl = that.url.substr(0, that.url.length - tokens[tokens.length - 1].length);

    for (i = 0; i < mtllibs.length; i++)
      data.push(load.data(baseUrl + mtllibs[i]));

    load.onComplete.add(function() {
      var i;

      for (i = 0; i < data.length; i++)
        processMaterial(baseUrl, data[i].response, load);

      load.onComplete.removeAll();
      load.onComplete.add(function() {
        onLoad(that.url, that.content);
      });

      load.start();
    });

    load.start();
  }

  function processMaterial(baseUrl, data, load) {
    var lines, line, key, value, material;
    var i, j;

    lines = data.split('\n');

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      j = line.indexOf(' ');

      key = (j >= 0) ? line.substring(0, j) : line;
      key = key.toLowerCase();

      value = (j >= 0) ? line.substring(j + 1) : '';
      value = value.trim();

      if (key === 'newmtl') {
        material = materials[value];
      } else if (key === 'kd') {

      } else if (key === 'ka') {

      } else if (key === 'ks') {

      } else if (key === 'ns') {

      } else if (key === 'd') {

      } else if (key === 'map_ka') {

      } else if (key === 'map_kd') {

        material.diffuseMap = new EZ3.Texture(load.image(baseUrl + value));
      } else if (key === 'map_ks') {

      } else if (key === 'map_ns') {

      } else if (key === 'map_bump') {

      } else if (key === 'map_d') {

      }
    }
  }

  that = this;
  patterns = {
    obj: /^o/,
    group: /^g/,
    mtllib: /^mtllib/,
    usemtl: /^usemtl/,
    smooth: /^s/,
    vertex: /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    normal: /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    uv: /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    face1: /f\s(([\d]+[\s]){2,}[\d]+)+/,
    face2: /f\s((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face3: /f\s((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face4: /f\s((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/
  };
  mtllibs = [];
  materials = {};
  material = new EZ3.MeshMaterial();
  geometry = new EZ3.Geometry();
  mesh = new EZ3.Mesh(geometry, material);
  indices = {
    vertex: [],
    normal: [],
    uv: []
  };
  vertices = [];
  normals = [];
  uvs = [];
  lines = data.split('\n');

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    } else if ((result = patterns.vertex.exec(line))) {
      processVertex(result);
    } else if ((result = patterns.normal.exec(line))) {
      processNormal(result);
    } else if ((result = patterns.uv.exec(line))) {
      processUv(result);
    } else if ((result = patterns.face1.exec(line))) {
      processFace1(triangulate(result[1]));
    } else if ((result = patterns.face2.exec(line))) {
      processFace2(triangulate(result[1]));
    } else if ((result = patterns.face3.exec(line))) {
      processFace3(triangulate(result[1]));
    } else if ((result = patterns.face4.exec(line))) {
      processFace4(triangulate(result[1]));
    } else if (patterns.obj.test(line) || patterns.group.test(line)) {
      processMesh();
      mesh.name = line.substring(2).trim();
    } else if (patterns.mtllib.test(line)) {
      mtllibs.push(line.substring(7).trim());
    } else if (patterns.usemtl.test(line)) {
      processMesh();
      material.name = line.substring(7).trim();
      materials[material.name] = material;
    } else if (patterns.smooth.test(line)) {

    }
  }
  processMesh();
  processMaterials();
};

EZ3.Obj.prototype.load = function(onLoad, onError) {
  var that, load, data;

  that = this;
  load = new EZ3.LoadManager();

  data = load.data(this.url);
  load.onComplete.add(function() {
    that._parse(data.response, onLoad, onError);
  });

  load.start();

  return this.content;
};

/**
 * @class Material
 */

EZ3.Material = function(name) {
  this._name = name;

  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
  this.transparent = false;
  this.faceCulling = true;
  this.backFaceCulling = true;
  this.frontFaceCulling = false;
  this.depthTest = true;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest) {
    if (!state.capability[EZ3.RendererState.DEPTH_TEST].enabled) {
      gl.enable(gl.DEPTH_TEST);
      state.capability[EZ3.RendererState.DEPTH_TEST].enabled = true;
    }
    if (state.capability[EZ3.RendererState.DEPTH_TEST].value !== gl.LEQUAL) {
      gl.depthFunc(gl.LEQUAL);
      state.capability[EZ3.RendererState.DEPTH_TEST].value = gl.LEQUAL;
    }
  } else {
    if (state.capability[EZ3.RendererState.DEPTH_TEST].enabled) {
      gl.disable(gl.DEPTH_TEST);
      state.capability[EZ3.RendererState.DEPTH_TEST].enabled = false;
      state.capability[EZ3.RendererState.DEPTH_TEST].value = null;
    }
  }

  if (this.faceCulling) {
    if (!state.capability[EZ3.RendererState.CULL_FACE].enabled) {
      gl.enable(gl.CULL_FACE);
      state.capability[EZ3.RendererState.CULL_FACE].enabled = true;
    }
    if (this.backFaceCulling) {
      if(state.capability[EZ3.RendererState.CULL_FACE].value !== gl.BACK) {
        gl.cullFace(gl.BACK);
        state.capability[EZ3.RendererState.CULL_FACE].value = gl.BACK;
      }
    } else if(this.frontFaceCulling) {
      if(state.capability[EZ3.RendererState.CULL_FACE].value !== gl.FRONT) {
        gl.cullFace(gl.FRONT);
        state.capability[EZ3.RendererState.CULL_FACE].value = gl.FRONT;
      }
    }
  } else {
    if (state.capability[EZ3.RendererState.CULL_FACE].enabled) {
      gl.disable(gl.CULL_FACE);
      state.capability[EZ3.RendererState.CULL_FACE].enabled = false;
      state.capability[EZ3.RendererState.CULL_FACE].value = null;
    }
  }
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;

/**
 * @class BoundingBox
 */

EZ3.BoundingBox = function(maxPoint, minPoint) {

};

/**
 * @class BoundingSphere
 */

EZ3.BoundingSphere = function(center, radius) {

};

/**
 * @class Frustum
 */

/**
 * @class Math
 */

EZ3.Math = function() {
  this.PI = Math.PI;
  this.HALF_PI = this.PI * 0.5;
  this.DOUBLE_PI = 2.0 * this.PI;
  this.MAX_UINT = Math.pow(2, 32) - 1;
  this.MAX_USHORT = Math.pow(2, 16) - 1;
};

EZ3.Math = new EZ3.Math();

EZ3.Math.toRadians = function(x) {
  return x * EZ3.Math.PI / 180.0;
};

EZ3.Math.toDegrees = function(x) {
  return x * 180.0 / EZ3.Math.PI;
};

/**
 * @class Matrix3
 */

EZ3.Matrix3 = function(e00, e01, e02, e10, e11, e12, e20, e21, e22) {
  this.dirty = true;
  this._elements = [];

  this.init(
    e00 || 1, e01 || 0, e02 || 0,
    e10 || 0, e11 || 1, e12 || 0,
    e20 || 0, e21 || 0, e22 || 1
  );
};

EZ3.Matrix3.prototype.constructor = EZ3.Matrix3;

EZ3.Matrix3.prototype.init = function(e00, e01, e02, e10, e11, e12, e20, e21, e22) {
  this.elements = [
    e00, e01, e02,
    e10, e11, e12,
    e20, e21, e22
  ];

  return this;
};

EZ3.Matrix3.prototype.add = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2 = m2.elements;

  e[0] = em1[0] + em2[0];
  e[1] = em1[1] + em2[1];
  e[2] = em1[2] + em2[2];
  e[3] = em1[3] + em2[3];
  e[4] = em1[4] + em2[4];
  e[5] = em1[5] + em2[5];
  e[6] = em1[6] + em2[6];
  e[7] = em1[7] + em2[7];
  e[8] = em1[8] + em2[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.addEqual = function(m) {
  var em = m.elements;

  this.elements[0] += em[0];
  this.elements[1] += em[1];
  this.elements[2] += em[2];
  this.elements[3] += em[3];
  this.elements[4] += em[4];
  this.elements[5] += em[5];
  this.elements[6] += em[6];
  this.elements[7] += em[7];
  this.elements[8] += em[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.sub = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2 = m2.elements;

  e[0] = em1[0] - em2[0];
  e[1] = em1[1] - em2[1];
  e[2] = em1[2] - em2[2];
  e[3] = em1[3] - em2[3];
  e[4] = em1[4] - em2[4];
  e[5] = em1[5] - em2[5];
  e[6] = em1[6] - em2[6];
  e[7] = em1[7] - em2[7];
  e[8] = em1[8] - em2[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.subEqual = function(m) {
  var em = m.elements;

  this.elements[0] -= em[0];
  this.elements[1] -= em[1];
  this.elements[2] -= em[2];
  this.elements[3] -= em[3];
  this.elements[4] -= em[4];
  this.elements[5] -= em[5];
  this.elements[6] -= em[6];
  this.elements[7] -= em[7];
  this.elements[8] -= em[8];

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.scale = function(m, s) {
  var em = m.elements;

  this.elements[0] = em[0] * s;
  this.elements[1] = em[1] * s;
  this.elements[2] = em[2] * s;
  this.elements[3] = em[3] * s;
  this.elements[4] = em[4] * s;
  this.elements[5] = em[5] * s;
  this.elements[6] = em[6] * s;
  this.elements[7] = em[7] * s;
  this.elements[8] = em[8] * s;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.scaleEqual = function(s) {
  this.elements[0] *= s;
  this.elements[1] *= s;
  this.elements[2] *= s;
  this.elements[3] *= s;
  this.elements[4] *= s;
  this.elements[5] *= s;
  this.elements[6] *= s;
  this.elements[7] *= s;
  this.elements[8] *= s;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.mul = function(m1, m2) {
  var e = this.elements;
  var em1 = m1.elements;
  var em2;
  var a0;
  var a1;
  var a2;
  var a3;
  var a4;
  var a5;
  var a6;
  var a7;
  var a8;
  var b0;
  var b1;
  var b2;
  var b3;
  var b4;
  var b5;
  var b6;
  var b7;
  var b8;

  if (m2 !== undefined) {
    em2 = m2.elements;

    a0 = em1[0];
    a1 = em1[1];
    a2 = em1[2];
    a3 = em1[3];
    a4 = em1[4];
    a5 = em1[5];
    a6 = em1[6];
    a7 = em1[7];
    a8 = em1[8];

    b0 = em2[0];
    b1 = em2[1];
    b2 = em2[2];
    b3 = em2[3];
    b4 = em2[4];
    b5 = em2[5];
    b6 = em2[6];
    b7 = em2[7];
    b8 = em2[8];
  } else {
    a0 = e[0];
    a1 = e[1];
    a2 = e[2];
    a3 = e[3];
    a4 = e[4];
    a5 = e[5];
    a6 = e[6];
    a7 = e[7];
    a8 = e[8];

    b0 = em1[0];
    b1 = em1[1];
    b2 = em1[2];
    b3 = em1[3];
    b4 = em1[4];
    b5 = em1[5];
    b6 = em1[6];
    b7 = em1[7];
    b8 = em1[8];
  }

  this.elements[0] = a0 * b0 + a1 * b3 + a2 * b6;
  this.elements[1] = a0 * b1 + a1 * b4 + a2 * b7;
  this.elements[2] = a0 * b2 + a1 * b5 + a2 * b8;
  this.elements[3] = a3 * b0 + a4 * b3 + a5 * b6;
  this.elements[4] = a3 * b1 + a4 * b4 + a5 * b7;
  this.elements[5] = a3 * b2 + a4 * b5 + a5 * b8;
  this.elements[6] = a6 * b0 + a7 * b3 + a8 * b6;
  this.elements[7] = a6 * b1 + a7 * b4 + a8 * b7;
  this.elements[8] = a6 * b2 + a7 * b5 + a8 * b8;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.mulScale = function(m, sx, sy, sz, Prepend) {
  var em = m.elements;
  var e = this.elements;
  var prepend = Prepend || false;

  if (prepend) {
    e[0] = sx * em[0];
    e[1] = sx * em[1];
    e[2] = sx * em[2];
    e[3] = sy * em[3];
    e[4] = sy * em[4];
    e[5] = sy * em[5];
    e[6] = sz * em[6];
    e[7] = sz * em[7];
    e[8] = sz * em[8];
  } else {
    e[0] = em[0] * sx;
    e[1] = em[1] * sy;
    e[2] = em[2] * sz;
    e[3] = em[3] * sx;
    e[4] = em[4] * sy;
    e[5] = em[5] * sz;
    e[6] = em[6] * sx;
    e[7] = em[7] * sy;
    e[8] = em[8] * sz;
  }

  this.elements = e;

  return this;
};

EZ3.Matrix3.prototype.mulRotate = function(m, rad, ax, ay, az, Prepend) {
  var tm = m.elements;
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var c1 = 1 - c;
  var r00 = ax * ax * c1 + c;
  var r01 = ax * ay * c1 - az * s;
  var r02 = ax * az * c1 + ay * s;
  var r10 = ay * ax * c1 + az * s;
  var r11 = ay * ay * c1 + c;
  var r12 = ay * az * c1 - ax * s;
  var r20 = az * ax * c1 - ay * s;
  var r21 = az * ay * c1 + ax * s;
  var r22 = az * az * c1 + c;
  var a0 = tm[0];
  var a3 = tm[3];
  var a6 = tm[6];
  var a1 = tm[1];
  var a4 = tm[4];
  var a7 = tm[7];
  var a2 = tm[2];
  var a5 = tm[5];
  var a8 = tm[8];
  var prepend = Prepend || false;

  if (prepend) {
    this.elements[0] = r00 * a0 + r01 * a3 + r02 * a6;
    this.elements[1] = r00 * a1 + r01 * a4 + r02 * a7;
    this.elements[2] = r00 * a2 + r01 * a5 + r02 * a8;
    this.elements[3] = r10 * a0 + r11 * a3 + r12 * a6;
    this.elements[4] = r10 * a1 + r11 * a4 + r12 * a7;
    this.elements[5] = r10 * a2 + r11 * a5 + r12 * a8;
    this.elements[6] = r20 * a0 + r21 * a3 + r22 * a6;
    this.elements[7] = r20 * a1 + r21 * a4 + r22 * a7;
    this.elements[8] = r20 * a2 + r21 * a5 + r22 * a8;
  } else {
    this.elements[0] = a0 * r00 + a1 * r10 + a2 * r20;
    this.elements[1] = a0 * r01 + a1 * r11 + a2 * r21;
    this.elements[2] = a0 * r02 + a1 * r12 + a2 * r22;
    this.elements[3] = a3 * r00 + a4 * r10 + a5 * r20;
    this.elements[4] = a3 * r01 + a4 * r11 + a5 * r21;
    this.elements[5] = a3 * r02 + a4 * r12 + a5 * r22;
    this.elements[6] = a6 * r00 + a7 * r10 + a8 * r20;
    this.elements[7] = a6 * r01 + a7 * r11 + a8 * r21;
    this.elements[8] = a6 * r02 + a7 * r12 + a8 * r22;
  }

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.transpose = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var a0 = e[0];
  var a1 = e[1];
  var a2 = e[2];
  var a3 = e[3];
  var a4 = e[4];
  var a5 = e[5];
  var a6 = e[6];
  var a7 = e[7];
  var a8 = e[8];

  this.elements[0] = a0;
  this.elements[1] = a3;
  this.elements[2] = a6;
  this.elements[3] = a1;
  this.elements[4] = a4;
  this.elements[5] = a7;
  this.elements[6] = a2;
  this.elements[7] = a5;
  this.elements[8] = a8;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.setQuat = function(q) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var sx = q.s * x2;
  var sy = q.s * y2;
  var sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = xy + sz;
  this.elements[4] = 1 - xx - zz;
  this.elements[5] = yz - sx;
  this.elements[6] = xz - sy;
  this.elements[7] = yz + sx;
  this.elements[8] = 1 - xx - yy;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.invert = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var a0 = e[0];
  var a3 = e[3];
  var a6 = e[6];
  var a1 = e[1];
  var a4 = e[4];
  var a7 = e[7];
  var a2 = e[2];
  var a5 = e[5];
  var a8 = e[8];
  var b01 = a4 * a8 - a7 * a5;
  var b11 = a7 * a2 - a1 * a8;
  var b21 = a1 * a5 - a4 * a2;
  var dt = a0 * (b01) + a3 * (b11) + a6 * (b21);

  if (dt !== 0)
    dt = 1.0 / dt;

  this.elements[0] = dt * b01;
  this.elements[1] = dt * b11;
  this.elements[2] = dt * b21;
  this.elements[3] = dt * (a5 * a6 - a3 * a8);
  this.elements[4] = dt * (a0 * a8 - a2 * a6);
  this.elements[5] = dt * (a2 * a3 - a0 * a5);
  this.elements[6] = dt * (a3 * a7 - a4 * a6);
  this.elements[7] = dt * (a1 * a6 - a0 * a7);
  this.elements[8] = dt * (a0 * a4 - a1 * a3);

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.normalFromMat4 = function(m) {
  var em = m.elements;
  var a00 = em[0];
  var a01 = em[1];
  var a02 = em[2];
  var a03 = em[3];
  var a10 = em[4];
  var a11 = em[5];
  var a12 = em[6];
  var a13 = em[7];
  var a20 = em[8];
  var a21 = em[9];
  var a22 = em[10];
  var a23 = em[11];
  var a30 = em[12];
  var a31 = em[13];
  var a32 = em[14];
  var a33 = em[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;

  var det;

  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det)
    return null;

  det = 1.0 / det;

  this.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.elements[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.elements[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  this.elements[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.elements[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.elements[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  this.elements[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.elements[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.elements[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  this.dirty = true;

  return this;
};

EZ3.Matrix3.prototype.identity = function() {
  this.elements = [
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0
  ];

  return this;
};

EZ3.Matrix3.prototype.clone = function() {
  return new EZ3.Matrix3(
    this.elements[0],
    this.elements[1],
    this.elements[2],
    this.elements[3],
    this.elements[4],
    this.elements[5],
    this.elements[6],
    this.elements[7],
    this.elements[8]
  );
};

EZ3.Matrix3.prototype.copy = function(m) {
  this.elements = m.elements;
  return this;
};

EZ3.Matrix3.prototype.toArray = function() {
  return this.elements;
};

EZ3.Matrix3.prototype.toString = function() {
  return 'Matrix3[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[2].toFixed(4) + '\n' +
    this.elements[3].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + '\n' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + '\n]';
};

EZ3.Matrix3.prototype.testEqual = function(m) {
  if(m instanceof EZ3.Matrix3) {
    return m.elements[0] === this.elements[0] &&
           m.elements[1] === this.elements[1] &&
           m.elements[2] === this.elements[2] &&
           m.elements[3] === this.elements[3] &&
           m.elements[4] === this.elements[4] &&
           m.elements[5] === this.elements[5] &&
           m.elements[6] === this.elements[6] &&
           m.elements[7] === this.elements[7] &&
           m.elements[8] === this.elements[8];
  } else
    return false;
};

EZ3.Matrix3.prototype.set = EZ3.Matrix3.prototype.init;

Object.defineProperty(EZ3.Matrix3.prototype, 'elements', {
  get: function() {
    return this._elements;
  },
  set: function(e) {
    this._elements = e;
    this.dirty = true;
  }
});

/**
 * @class Matrix4
 */

EZ3.Matrix4 = function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
  this._elements = [];
  this.dirty = true;

  this.init(
    e00 || 1, e01 || 0, e02 || 0, e03 || 0,
    e10 || 0, e11 || 1, e12 || 0, e13 || 0,
    e20 || 0, e21 || 0, e22 || 1, e23 || 0,
    e30 || 0, e31 || 0, e32 || 0, e33 || 1
  );
};

EZ3.Matrix4.prototype.constructor = EZ3.Matrix4;

EZ3.Matrix4.prototype.init = function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
  this.elements = [
    e00, e01, e02, e03,
    e10, e11, e12, e13,
    e20, e21, e22, e23,
    e30, e31, e32, e33
  ];
  return this;
};

EZ3.Matrix4.prototype.transpose = function(m) {
  var e01;
  var e02;
  var e03;
  var e12;
  var e13;
  var e23;
  var em;

  if (m !== undefined) {
    em = m.elements;

    e01 = em[1];
    e02 = em[2];
    e03 = em[3];
    e12 = em[6];
    e13 = em[7];
    e23 = em[11];

    this.elements[1] = em[4];
    this.elements[2] = em[8];
    this.elements[3] = em[12];
    this.elements[4] = e01;
    this.elements[6] = em[9];
    this.elements[7] = em[13];
    this.elements[8] = e02;
    this.elements[9] = e12;
    this.elements[11] = em[14];
    this.elements[12] = e03;
    this.elements[13] = e13;
    this.elements[14] = e23;
  } else {
    em = this.elements;

    this.elements[0] = em[0];
    this.elements[1] = em[4];
    this.elements[2] = em[8];
    this.elements[3] = em[12];
    this.elements[4] = em[1];
    this.elements[5] = em[5];
    this.elements[6] = em[9];
    this.elements[7] = em[13];
    this.elements[8] = em[2];
    this.elements[9] = em[6];
    this.elements[10] = em[10];
    this.elements[11] = em[14];
    this.elements[12] = em[3];
    this.elements[13] = em[7];
    this.elements[14] = em[11];
    this.elements[15] = em[15];
  }

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.invert = function(m) {
  var a = m.elements;
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  var a30 = a[12];
  var a31 = a[13];
  var a32 = a[14];
  var a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det;

  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det)
    return null;

  det = 1.0 / det;

  this.elements[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  this.elements[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  this.elements[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  this.elements[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  this.elements[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  this.elements[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  this.elements[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  this.elements[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  this.elements[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  this.elements[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  this.elements[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  this.elements[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  this.elements[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  this.elements[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  this.elements[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  this.elements[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.mul = function(m1, m2) {
  var em1;
  var em2;
  var a00;
  var a01;
  var a02;
  var a03;
  var a10;
  var a11;
  var a12;
  var a13;
  var a20;
  var a21;
  var a22;
  var a23;
  var a30;
  var a31;
  var a32;
  var a33;
  var b00;
  var b01;
  var b02;
  var b03;
  var b10;
  var b11;
  var b12;
  var b13;
  var b20;
  var b21;
  var b22;
  var b23;
  var b30;
  var b31;
  var b32;
  var b33;

  if (m2 !== undefined) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  a00 = em1[0];
  a01 = em1[1];
  a02 = em1[2];
  a03 = em1[3];
  a10 = em1[4];
  a11 = em1[5];
  a12 = em1[6];
  a13 = em1[7];
  a20 = em1[8];
  a21 = em1[9];
  a22 = em1[10];
  a23 = em1[11];
  a30 = em1[12];
  a31 = em1[13];
  a32 = em1[14];
  a33 = em1[15];

  b00 = em2[0];
  b01 = em2[1];
  b02 = em2[2];
  b03 = em2[3];
  b10 = em2[4];
  b11 = em2[5];
  b12 = em2[6];
  b13 = em2[7];
  b20 = em2[8];
  b21 = em2[9];
  b22 = em2[10];
  b23 = em2[11];
  b30 = em2[12];
  b31 = em2[13];
  b32 = em2[14];
  b33 = em2[15];

  this.elements[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  this.elements[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  this.elements[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  this.elements[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

  this.elements[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  this.elements[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  this.elements[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  this.elements[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

  this.elements[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  this.elements[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  this.elements[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  this.elements[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

  this.elements[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  this.elements[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  this.elements[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  this.elements[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.translate = function(m, v) {
  var em = m.elements;
  var x = v.x;
  var y = v.y;
  var z = v.z;
  var a00 = em[0];
  var a01 = em[1];
  var a02 = em[2];
  var a03 = em[3];
  var a10 = em[0];
  var a11 = em[1];
  var a12 = em[2];
  var a13 = em[3];
  var a20 = em[0];
  var a21 = em[1];
  var a22 = em[2];
  var a23 = em[3];

  this.elements[0] = a00;
  this.elements[1] = a01;
  this.elements[2] = a02;
  this.elements[3] = a03;
  this.elements[4] = a10;
  this.elements[5] = a11;
  this.elements[6] = a12;
  this.elements[7] = a13;
  this.elements[8] = a20;
  this.elements[9] = a21;
  this.elements[10] = a22;
  this.elements[11] = a23;
  this.elements[12] = a00 * x + a10 * y + a20 * z + this.elements[12];
  this.elements[13] = a01 * x + a11 * y + a21 * z + this.elements[13];
  this.elements[14] = a02 * x + a12 * y + a22 * z + this.elements[14];
  this.elements[15] = a03 * x + a13 * y + a23 * z + this.elements[15];

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.scale = function(m, s) {
  var x = s.x;
  var y = s.y;
  var z = s.z;
  var em = m.elements;

  this.elements[0] = em[0] * x;
  this.elements[1] = em[1] * x;
  this.elements[2] = em[2] * x;
  this.elements[3] = em[3] * x;
  this.elements[4] = em[4] * y;
  this.elements[5] = em[5] * y;
  this.elements[6] = em[6] * y;
  this.elements[7] = em[7] * y;
  this.elements[8] = em[8] * z;
  this.elements[9] = em[9] * z;
  this.elements[10] = em[10] * z;
  this.elements[11] = em[11] * z;
  this.elements[12] = em[12];
  this.elements[13] = em[13];
  this.elements[14] = em[14];
  this.elements[15] = em[15];

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.setQuat = function(q) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var sx = q.s * x2;
  var sy = q.s * y2;
  var sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = 0;
  this.elements[4] = xy + sz;
  this.elements[5] = 1 - xx - zz;
  this.elements[6] = yz - sx;
  this.elements[7] = 0;
  this.elements[8] = xz - sy;
  this.elements[9] = yz + sx;
  this.elements[10] = 1 - xx - yy;
  this.elements[11] = 0;
  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = 0;
  this.elements[15] = 1;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.fromRotationTranslation = function(m, q, v) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var sx = q.s * x2;
  var sy = q.s * y2;
  var sz = q.s * z2;

  this.elements[0] = 1 - yy - zz;
  this.elements[1] = xy - sz;
  this.elements[2] = xz + sy;
  this.elements[3] = 0;
  this.elements[4] = xy + sz;
  this.elements[5] = 1 - xx - zz;
  this.elements[6] = yz - sx;
  this.elements[7] = 0;
  this.elements[8] = xz - sy;
  this.elements[9] = yz + sx;
  this.elements[10] = 1 - xx - yy;
  this.elements[11] = 0;
  this.elements[12] = v.x;
  this.elements[13] = v.y;
  this.elements[14] = v.z;
  this.elements[15] = 1;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2.0);
  var nf = 1.0 / (near - far);

  this.elements[0] = f / aspect;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;
  this.elements[4] = 0;
  this.elements[5] = f;
  this.elements[6] = 0;
  this.elements[7] = 0;
  this.elements[8] = 0;
  this.elements[9] = 0;
  this.elements[10] = (far + near) * nf;
  this.elements[11] = -1;
  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = (2 * far * near) * nf;
  this.elements[15] = 0;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);

  this.elements[0] = (near * 2) * rl;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;
  this.elements[4] = 0;
  this.elements[5] = (near * 2) * tb;
  this.elements[6] = 0;
  this.elements[7] = 0;
  this.elements[8] = (right + left) * rl;
  this.elements[9] = (top + bottom) * tb;
  this.elements[10] = (far + near) * nf;
  this.elements[11] = -1;
  this.elements[12] = 0;
  this.elements[13] = 0;
  this.elements[14] = (far * near * 2) * nf;
  this.elements[15] = 0;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);

  this.elements[0] = -2 * lr;
  this.elements[1] = 0;
  this.elements[2] = 0;
  this.elements[3] = 0;
  this.elements[4] = 0;
  this.elements[5] = -2 * bt;
  this.elements[6] = 0;
  this.elements[7] = 0;
  this.elements[8] = 0;
  this.elements[9] = 0;
  this.elements[10] = 2 * nf;
  this.elements[11] = 0;
  this.elements[12] = (left + right) * lr;
  this.elements[13] = (top + bottom) * bt;
  this.elements[14] = (far + near) * nf;
  this.elements[15] = 1;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.lookAt = function(eye, center, up) {
  var len;
  var x0;
  var x1;
  var x2;
  var y0;
  var y1;
  var y2;
  var z0;
  var z1;
  var z2;
  var upx;
  var upy;
  var upz;
  var eyex;
  var eyey;
  var eyez;
  var centerx;
  var centery;
  var centerz;

  upx = up.x;
  upy = up.y;
  upz = up.z;

  eyex = eye.x;
  eyey = eye.y;
  eyez = eye.z;

  centerx = center.x;
  centery = center.y;
  centerz = center.z;

  if (Math.abs(eyex - centerx) < 0.000001 &&
    Math.abs(eyey - centery) < 0.000001 &&
    Math.abs(eyez - centerz) < 0.000001) {
    return this.identity();
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);

  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;

  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  this.elements[0] = x0;
  this.elements[1] = y0;
  this.elements[2] = z0;
  this.elements[3] = 0;
  this.elements[4] = x1;
  this.elements[5] = y1;
  this.elements[6] = z1;
  this.elements[7] = 0;
  this.elements[8] = x2;
  this.elements[9] = y2;
  this.elements[10] = z2;
  this.elements[11] = 0;
  this.elements[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  this.elements[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  this.elements[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  this.elements[15] = 1;

  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.identity = function() {
  this.elements = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  return this;
};

EZ3.Matrix4.prototype.yawPitchRoll = function(yaw, pitch, roll) {
  var cosYaw = Math.cos(yaw);
  var sinYaw = Math.sin(yaw);
  var cosPitch = Math.cos(pitch);
  var sinPitch = Math.sin(pitch);
  var cosRoll = Math.cos(roll);
  var sinRoll = Math.sin(roll);

  this.elements[0] = cosYaw * cosRoll + sinYaw * sinPitch * sinRoll;
	this.elements[1] = sinRoll * cosPitch;
	this.elements[2] = -sinYaw * cosRoll + cosYaw * sinPitch * sinRoll;
	this.elements[3] = 0.0;
	this.elements[4] = -cosYaw * sinRoll + sinYaw * sinPitch * cosRoll;
	this.elements[5] = cosRoll * cosPitch;
	this.elements[6] = sinRoll * sinYaw + cosYaw * sinPitch * cosRoll;
	this.elements[7] = 0.0;
	this.elements[8] = sinYaw * cosPitch;
	this.elements[9] = -sinPitch;
	this.elements[10] = cosYaw * cosPitch;
	this.elements[11] = 0.0;
	this.elements[12] = 0.0;
	this.elements[13] = 0.0;
	this.elements[14] = 0.0;
	this.elements[15] = 1.0;

  return this;
};

EZ3.Matrix4.prototype.clone = function() {
  return new EZ3.Matrix4(
    this.elements[0],
    this.elements[1],
    this.elements[2],
    this.elements[3],
    this.elements[4],
    this.elements[5],
    this.elements[6],
    this.elements[7],
    this.elements[8],
    this.elements[9],
    this.elements[10],
    this.elements[11],
    this.elements[12],
    this.elements[13],
    this.elements[14],
    this.elements[15]
  );
};

EZ3.Matrix4.prototype.copy = function(m) {
  this.elements[0] = m.elements[0];
  this.elements[1] = m.elements[1];
  this.elements[2] = m.elements[2];
  this.elements[3] = m.elements[3];
  this.elements[4] = m.elements[4];
  this.elements[5] = m.elements[5];
  this.elements[6] = m.elements[6];
  this.elements[7] = m.elements[7];
  this.elements[8] = m.elements[8];
  this.elements[9] = m.elements[9];
  this.elements[10] = m.elements[10];
  this.elements[11] = m.elements[11];
  this.elements[12] = m.elements[12];
  this.elements[13] = m.elements[13];
  this.elements[14] = m.elements[14];
  this.elements[15] = m.elements[15];
  this.dirty = true;

  return this;
};

EZ3.Matrix4.prototype.toArray = function() {
  return this.elements;
};

EZ3.Matrix4.prototype.toString = function() {
  return 'Matrix4[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[3].toFixed(4) + '\n' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + '\n' +
    this.elements[8].toFixed(4) + ', ' +
    this.elements[9].toFixed(4) + ', ' +
    this.elements[10].toFixed(4) + ', ' +
    this.elements[11].toFixed(4) + '\n' +
    this.elements[12].toFixed(4) + ', ' +
    this.elements[13].toFixed(4) + ', ' +
    this.elements[14].toFixed(4) + ', ' +
    this.elements[15].toFixed(4) + '\n]';
};

EZ3.Matrix4.prototype.testEqual = function(m) {
  if(m instanceof EZ3.Matrix4) {
    return m.elements[0] === this.elements[0] &&
           m.elements[1] === this.elements[1] &&
           m.elements[2] === this.elements[2] &&
           m.elements[3] === this.elements[3] &&
           m.elements[4] === this.elements[4] &&
           m.elements[5] === this.elements[5] &&
           m.elements[6] === this.elements[6] &&
           m.elements[7] === this.elements[7] &&
           m.elements[8] === this.elements[8] &&
           m.elements[9] === this.elements[9] &&
           m.elements[10] === this.elements[10] &&
           m.elements[11] === this.elements[11] &&
           m.elements[12] === this.elements[12] &&
           m.elements[13] === this.elements[13] &&
           m.elements[14] === this.elements[14] &&
           m.elements[15] === this.elements[15];
  } else
    return false;
};


EZ3.Matrix4.prototype.set = EZ3.Matrix4.prototype.init;

Object.defineProperty(EZ3.Matrix4.prototype, 'elements', {
  get: function() {
    return this._elements;
  },
  set: function(e) {
    this._elements = e;
    this.dirty = true;
  }
});

/**
 * @class Plane
 */

/**
 * @class Quaternion
 */

EZ3.Quaternion = function(s, x, y, z) {
  this.s = (s !== undefined) ? s : 1;
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.dirty = true;
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

EZ3.Quaternion.prototype.init = function(s, x, y, z) {
  this.s = (s !== undefined) ? s : 1;
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

  return this;
};

EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 !== undefined) {
    this.s = q1.s + q2.s;
    this.x = q1.x + q2.x;
    this.y = q1.y + q2.y;
    this.z = q1.z + q2.z;
  } else {
    this.s += q1.s;
    this.x += q1.x;
    this.y += q1.y;
    this.z += q1.z;
  }

  return this;
};

EZ3.Quaternion.prototype.addTime = function(v, t) {
  var x;
  var y;
  var z;
  var qs;
  var qx;
  var qy;
  var qz;
  var ns;
  var nx;
  var ny;
  var nz;
  var s;

  x = v.x;
  y = v.y;
  z = v.z;

  qs = this.s;
  qx = this.x;
  qy = this.y;
  qz = this.z;

  t *= 0.5;

  ns = (-x * qx - y * qy - z * qz) * t;
  nx = (x * qs + y * qz - z * qy) * t;
  ny = (-x * qz + y * qs + z * qx) * t;
  nz = (x * qy - y * qx + z * qs) * t;

  qs += ns;
  qx += nx;
  qy += ny;
  qz += nz;

  s = 1 / Math.sqrt(qs * qs + qx * qx + qy * qy + qz * qz);

  this.s = qs * s;
  this.x = qx * s;
  this.y = qy * s;
  this.z = qz * s;

  return this;
};

EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 !== undefined) {
    this.s = q1.s - q2.s;
    this.x = q1.x - q2.x;
    this.y = q1.y - q2.y;
    this.z = q1.z - q2.z;
  } else {
    this.s -= q1.s;
    this.x -= q1.x;
    this.y -= q1.y;
    this.z -= q1.z;
  }

  this.dirty = true;

  return this;
};

EZ3.Quaternion.prototype.scale = function(q, s) {
  this.s = q.s * s;
  this.x = q.x * s;
  this.y = q.y * s;
  this.z = q.z * s;

  return this;
};

EZ3.Quaternion.prototype.mul = function(q1, q2) {
  var ax;
  var ay;
  var az;
  var as;
  var bx;
  var by;
  var bz;
  var bs;

  ax = q1.x;
  ay = q1.y;
  az = q1.z;
  as = q1.s;

  if (q2 !== undefined) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bs = q2.s;
  } else {
    bx = this.x;
    by = this.y;
    bz = this.z;
    bs = this.s;
  }

  this.s = as * bs - ax * bx - ay * by - az * bz;
  this.x = ax * bs + as * bx + ay * bz - az * by;
  this.y = ay * bs + as * by + az * bx - ax * bz;
  this.z = az * bs + as * bz + ax * by - ay * bx;

  return this;
};

EZ3.Quaternion.prototype.arc = function(v1, v2) {
  var x1;
  var y1;
  var z1;
  var x2;
  var y2;
  var z2;
  var cx;
  var cy;
  var cz;
  var d;

  x1 = v1.x;
  y1 = v1.y;
  z1 = v1.z;

  x2 = v2.x;
  y2 = v2.y;
  z2 = v2.z;

  d = x1 * x2 + y1 * y2 + z1 * z2;

  if (d === -1) {
    x2 = y1 * x1 - z1 * z1;
    y2 = -z1 * y1 - x1 * x1;
    z2 = x1 * z1 + y1 * y1;

    d = 1 / Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);

    this.s = 0;
    this.x = x2 * d;
    this.y = y2 * d;
    this.z = z2 * d;
  } else {
    cx = y1 * z2 - z1 * y2;
    cy = z1 * x2 - x1 * z2;
    cz = x1 * y2 - y1 * x2;

    this.s = Math.sqrt((1 + d) * 0.5);

    d = 0.5 / this.s;

    this.x = cx * d;
    this.y = cy * d;
    this.z = cz * d;
  }

  return this;
};

EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q !== undefined) {
    len = Math.sqrt(q.s * q.s + q.x * q.x + q.y * q.y + q.z * q.z);

    if (len > 0)
      len = 1.0 / len;

    this.s = q.s * len;
    this.x = q.x * len;
    this.y = q.y * len;
    this.z = q.z * len;
  } else {

    s2 = this.s * this.s;
    x2 = this.x * this.x;
    y2 = this.y * this.y;
    z2 = this.z * this.z;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0)
      len = 1.0 / len;

    this.s = this.s * len;
    this.x = this.x * len;
    this.y = this.y * len;
    this.z = this.z * len;
  }
  return this;
};

EZ3.Quaternion.prototype.invert = function(q) {
  if(q !== undefined) {
    this.s = q.s;
    this.x = -q.x;
    this.y = -q.y;
    this.z = -q.z;
  } else {
    this.s = +this.s;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }
  return this;
};

EZ3.Quaternion.prototype.length = function() {
  var s2 = this.s * this.s;
  var x2 = this.x * this.x;
  var y2 = this.y * this.y;
  var z2 = this.z * this.z;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

EZ3.Quaternion.prototype.testDiff = function(q) {
  var ds = (this.s !== q.s);
  var dx = (this.x !== q.x);
  var dy = (this.y !== q.y);
  var dz = (this.z !== q.z);

  return (ds || dx || dy || dz);
};

EZ3.Quaternion.prototype.fromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);
  this.x = sin2 * axis.x;
  this.y = sin2 * axis.y;
  this.z = sin2 * axis.z;
  this.s = Math.cos(0.5 * angle);

  return this;
};

EZ3.Quaternion.prototype.toMatrix3 = function(mode, q) {
  var matrix = new EZ3.Matrix3();
  var yy2;
  var xy2;
  var xz2;
  var yz2;
  var zz2;
  var wz2;
  var wy2;
  var wx2;
  var xx2;

  if(q) {
    yy2 = 2.0 * q.y * q.y;
    xy2 = 2.0 * q.x * q.y;
    xz2 = 2.0 * q.x * q.z;
    yz2 = 2.0 * q.y * q.z;
    zz2 = 2.0 * q.z * q.z;
    wz2 = 2.0 * q.s * q.z;
    wy2 = 2.0 * q.s * q.y;
    wx2 = 2.0 * q.s * q.x;
    xx2 = 2.0 * q.x * q.x;
  } else {
    yy2 = 2.0 * this.y * this.y;
    xy2 = 2.0 * this.x * this.y;
    xz2 = 2.0 * this.x * this.z;
    yz2 = 2.0 * this.y * this.z;
    zz2 = 2.0 * this.z * this.z;
    wz2 = 2.0 * this.s * this.z;
    wy2 = 2.0 * this.s * this.y;
    wx2 = 2.0 * this.s * this.x;
    xx2 = 2.0 * this.x * this.x;
  }

  matrix.elements[0] = - yy2 - zz2 + 1.0;
  matrix.elements[1] = xy2 - mode * wz2;
  matrix.elements[2] = xz2 + mode * wy2;

  matrix.elements[3] = xy2 + mode * wz2;
  matrix.elements[4] = - xx2 - zz2 + 1.0;
  matrix.elements[5] = yz2 - mode * wx2;

  matrix.elements[6] = xz2 - mode * wy2;
  matrix.elements[7] = yz2 + mode * wx2;
  matrix.elements[8] = - xx2 - yy2 + 1.0;

  return matrix;
};

EZ3.Quaternion.prototype.copy = function(q) {
  this.s = q.s;
  this.x = q.x;
  this.y = q.y;
  this.z = q.z;
  return this;
};

EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this.s, this.x, this.y, this.z);
};

EZ3.Quaternion.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var s = this.s.toFixed(4);

  return 'Quaternion[' + s + ', ' + x + ', ' + y + ', ' + z + ' ]';
};

Object.defineProperty(EZ3.Quaternion.prototype, 's', {
  get: function() {
    return this._s;
  },
  set: function(s) {
    this._s = s;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});

EZ3.Quaternion.NORMAL = 1.0;
EZ3.Quaternion.INVERSE = -1.0;

/**
 * @class Vector2
 */

EZ3.Vector2 = function(x, y) {
  this._x = x || 0;
  this._y = y || 0;
  this.dirty = true;
};

EZ3.Vector2.prototype.init = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  return this;
};

EZ3.Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
};

EZ3.Vector2.prototype.add = function(v1, v2) {
  this.x = v1.x + v2.x;
  this.y = v1.y + v2.y;
  return this;
};

EZ3.Vector2.prototype.addEqual = function(v) {
  this.x += v.x;
  this.y += v.y;
  return this;
};

EZ3.Vector2.prototype.sub = function(v1, v2) {
  this.x = v1.x - v2.x;
  this.y = v1.y - v2.y;
  return this;
};

EZ3.Vector2.prototype.subEqual = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

EZ3.Vector2.prototype.addScale = function(v, s) {
  this.x += v.x * s;
  this.y += v.y * s;
  return this;
};

EZ3.Vector2.prototype.scale = function(v, s) {
  this.x = v.x * s;
  this.y = v.y * s;
  return this;
};

EZ3.Vector2.prototype.scaleEqual = function(s) {
  this.x *= s;
  this.y *= s;
  return this;
};

EZ3.Vector2.prototype.div = function(v1, v2) {
  if (!v2.hasZero()) {
    this.x = v1.x / v2.x;
    this.y = v1.y / v2.y;
  }
  return this;
};

EZ3.Vector2.prototype.divEqual = function(v) {
  if (!v.hasZero()) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
  }
  return this;
};

EZ3.Vector2.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
    return v1.x * v2.x + v1.y * v2.y;
  else
    return this.x * v1.x + this.y * v1.y;
};

EZ3.Vector2.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.length = function(v) {
  if (v !== undefined)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector2.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x = v.x * l;
      this.y = v.y * l;
    }
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
    }
  }
  return this;
};

EZ3.Vector2.prototype.invert = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
  } else {
    this.x = -this.x;
    this.y = -this.y;
  }
  return this;
};

EZ3.Vector2.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  return this;
};

EZ3.Vector2.prototype.clone = function() {
  return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector2.prototype.toArray = function() {
  return [this.x, this.y];
};

EZ3.Vector2.prototype.testEqual = function(v) {
  if(v instanceof EZ3.Vector2)
    return ((this.x === v.x) && (this.y === v.y));
  else
    return false;
};

EZ3.Vector2.prototype.hasZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) || (v.y === 0.0));
  else
    return ((this.x === 0.0) || (this.y === 0.0));
};

EZ3.Vector2.prototype.testZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0));
};

EZ3.Vector2.prototype.testDiff = function(v) {
  return ((this.x !== v.x) && (this.y !== v.y));
};

EZ3.Vector2.prototype.toString = function() {
  return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};

Object.defineProperty(EZ3.Vector2.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector2.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

/**
 * @class Vector3
 */

EZ3.Vector3 = function(x, y, z) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this.dirty = true;
};

EZ3.Vector3.prototype.constructor = EZ3.Vector3;

EZ3.Vector3.prototype.init = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  return this;
};

EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

EZ3.Vector3.prototype.add = function(v1, v2) {
  this.x = v1.x + v2.x;
  this.y = v1.y + v2.y;
  this.z = v1.z + v2.z;
  return this;
};

EZ3.Vector3.prototype.addEqual = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  return this;
};

EZ3.Vector3.prototype.sub = function(v1, v2) {
  this.x = v1.x - v2.x;
  this.y = v1.y - v2.y;
  this.z = v1.z - v2.z;
  return this;
};

EZ3.Vector3.prototype.subEqual = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  return this;
};

EZ3.Vector3.prototype.addScale = function(v, s) {
  this.x += v.x * s;
  this.y += v.y * s;
  this.z += v.z * s;
};

EZ3.Vector3.prototype.scale = function(v, s) {
  this.x = v.x * s;
  this.y = v.y * s;
  this.z = v.z * s;
  return this;
};

EZ3.Vector3.prototype.scaleEqual = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;
  return this;
};

EZ3.Vector3.prototype.div = function(v1, v2) {
  if (v2 !== undefined) {
    if (!v2.hasZero()) {
      this.x = v1.x / v2.x;
      this.y = v1.y / v2.y;
      this.z = v1.z / v2.z;
    }
  } else {
    if (!v1.hasZero()) {
      this.x = this.x / v1.x;
      this.y = this.y / v1.y;
      this.z = this.z / v1.z;
    }
  }
  return this;
};

EZ3.Vector3.prototype.divEqual = function(v) {
  if (!v.hasZero()) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
  }
  return this;
};

EZ3.Vector3.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  else
    return this.x * v1.x + this.y * v1.y + this.z * v1.z;
};

EZ3.Vector3.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
    this.z = (v1.z > v2.z) ? v1.z : v2.z;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;

    if (this.z < v1.z)
      this.z = v1.z;
  }
  return this;
};

EZ3.Vector3.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
    this.z = (v1.z < v2.z) ? v1.z : v2.z;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;

    if (this.z > v1.z)
      this.z = v1.z;
  }
  return this;
};

EZ3.Vector3.prototype.len = function() {
  return this.x * this.x + this.y * this.y + this.z * this.z;
};

EZ3.Vector3.prototype.mul = function(o, v, m) {
  var e = m.elements;
  this.x = o.x + v.x * e[0] + v.y * e[1] + v.z * e[2];
  this.y = o.y + v.x * e[3] + v.y * e[4] + v.z * e[5];
  this.z = o.z + v.x * e[6] + v.y * e[7] + v.z * e[8];
  return this;
};

EZ3.Vector3.prototype.cross = function(v1, v2) {
  var x;
  var y;
  var z;

  if (v2 !== undefined) {
    x = v1.y * v2.z - v1.z * v2.y;
    y = v1.z * v2.x - v1.x * v2.z;
    z = v1.x * v2.y - v1.y * v2.x;
  } else {
    x = v1.y * this.z - v1.z * this.y;
    y = v1.z * this.x - v1.x * this.z;
    z = v1.x * this.y - v1.y * this.x;
  }

  this.x = x;
  this.y = y;
  this.z = z;

  return this;
};

EZ3.Vector3.prototype.mulMat = function(m, v) {
  var e = m.elements;
  var x;
  var y;
  var z;

  if (v !== undefined) {
    x = v.x;
    y = v.y;
    z = v.z;
  } else {
    x = this.x;
    y = this.y;
    z = this.z;
  }

  this.x = x * e[0] + y * e[1] + z * e[2];
  this.y = x * e[3] + y * e[4] + z * e[5];
  this.z = x * e[6] + y * e[7] + z * e[8];

  return this;
};

EZ3.Vector3.prototype.applyQuaternion = function(q) {
  var x = this.x;
  var y = this.y;
  var z = this.z;
  var qx = q.x;
  var qy = q.y;
  var qz = q.z;
  var qs = q.s;
  var ix = qs * x + qy * z - qz * y;
  var iy = qs * y + qz * x - qx * z;
  var iz = qs * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  this.x = ix * qs + iw * -qx + iy * -qz - iz * -qy;
  this.y = iy * qs + iw * -qy + iz * -qx - ix * -qz;
  this.z = iz * qs + iw * -qz + ix * -qy - iy * -qx;

  return this;
};

EZ3.Vector3.prototype.length = function(v) {
  if (v !== undefined)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {

    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x = v.x * l;
      this.y = v.y * l;
      this.z = v.z * l;
    }
  } else {

    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
    }
  }

  return this;
};

EZ3.Vector3.prototype.invert = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }
  return this;
};

EZ3.Vector3.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  return this;
};

EZ3.Vector3.prototype.clone = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

EZ3.Vector3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
};

EZ3.Vector3.prototype.testEqual = function(v) {
  if(v instanceof EZ3.Vector3)
    return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
  else
    return false;
};

EZ3.Vector3.prototype.hasZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) || (v.y === 0.0) || (v.z === 0.0));
  else
    return ((this.x === 0.0) || (this.y === 0.0) || (this.z === 0.0));
};

EZ3.Vector3.prototype.testZero = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0));
};

EZ3.Vector3.prototype.testDiff = function(v) {
  return ((this.x !== v.x) && (this.y !== v.y) && (this.z !== v.z));
};

EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);

  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

EZ3.Vector3.prototype.setPositionFromMatrix = function(m) {
  if (m instanceof EZ3.Matrix4) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];
  }

  return this;
};

EZ3.Vector3.prototype.set = EZ3.Vector3.prototype.init;

Object.defineProperty(EZ3.Vector3.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector3.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});

/**
 * @class Vec4
 */

EZ3.Vector4 = function(x, y, z, w) {
  this._x = x || 0;
  this._y = y || 0;
  this._z = z || 0;
  this._w = w || 0;
  this.dirty = true;
};

EZ3.Vector4.prototype.constructor = EZ3.Vector4;

EZ3.Vector4.prototype.init = function(x, y, z, w) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.w = w || 0;
  return this;
};

EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

EZ3.Vector4.prototype.add = function(v1, v2) {
  this.x = v1.x + v2.x;
  this.y = v1.y + v2.y;
  this.z = v1.z + v2.z;
  this.w = v1.w + v2.w;
  return this;
};

EZ3.Vector4.prototype.addEqual = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
  this.w += v.w;
  return this;
};

EZ3.Vector4.prototype.sub = function(v1, v2) {
  this.x = v1.x - v2.x;
  this.y = v1.y - v2.y;
  this.z = v1.z - v2.z;
  this.w = v1.w - v2.w;
  return this;
};

EZ3.Vector4.prototype.subEqual = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
  this.w -= v.w;
  return this;
};

EZ3.Vector4.prototype.addScale = function(v, s) {
  this.x += v.x * s;
  this.y += v.y * s;
  this.z += v.z * s;
  this.w += v.w * s;
  return this;
};

EZ3.Vector4.prototype.scale = function(v, s) {
  this.x = v.x * s;
  this.y = v.y * s;
  this.z = v.z * s;
  this.w = v.w * s;
  return this;
};

EZ3.Vector4.prototype.scaleEqual = function(s) {
  this.x *= s;
  this.y *= s;
  this.z *= s;
  this.w *= s;
  return this;
};

EZ3.Vector4.prototype.div = function(v1, v2) {
  if (v2 !== undefined) {
    if (!v2.hasZero()) {
      this.x = v1.x / v2.x;
      this.y = v1.y / v2.y;
      this.z = v1.z / v2.z;
      this.w = v1.w / v2.w;
    }
  } else {
    if (!v1.hasZero()) {
      this.x = this.x / v1.x;
      this.y = this.y / v1.y;
      this.z = this.z / v1.z;
      this.w = this.w / v1.w;
    }
  }
  return this;
};

EZ3.Vector4.prototype.divEqual = function(v) {
  if (!v.hasZero()) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    this.w /= v.w;
  }
  return this;
};

EZ3.Vector4.prototype.dot = function(v1, v2) {
  if (v2 !== undefined)
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
  else
    return this.x * v1.x + this.y * v1.y + this.z * v1.z + this.w * v1.w;
};

EZ3.Vector4.prototype.max = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x > v2.x) ? v1.x : v2.x;
    this.y = (v1.y > v2.y) ? v1.y : v2.y;
    this.z = (v1.z > v2.z) ? v1.z : v2.z;
    this.w = (v1.w > v2.w) ? v1.w : v2.w;
  } else {
    if (this.x < v1.x)
      this.x = v1.x;

    if (this.y < v1.y)
      this.y = v1.y;

    if (this.z < v1.z)
      this.z = v1.z;

    if (this.w < v1.w)
      this.w = v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.min = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = (v1.x < v2.x) ? v1.x : v2.x;
    this.y = (v1.y < v2.y) ? v1.y : v2.y;
    this.z = (v1.z < v2.z) ? v1.z : v2.z;
    this.w = (v1.w < v2.w) ? v1.w : v2.w;
  } else {
    if (this.x > v1.x)
      this.x = v1.x;

    if (this.y > v1.y)
      this.y = v1.y;

    if (this.z > v1.z)
      this.z = v1.z;

    if (this.w > v1.w)
      this.w = v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.len = function() {
  return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
};

EZ3.Vector4.prototype.mul = function(o, v, m) {
  var e = m.elements;

  this.x = o.x + v.x * e[0] + v.y * e[1] + v.z * e[2] + v.w * e[3];
  this.y = o.y + v.x * e[4] + v.y * e[5] + v.z * e[6] + v.w * e[7];
  this.z = o.z + v.x * e[8] + v.y * e[9] + v.z * e[10] + v.w * e[11];
  this.w = o.w + v.x * e[12] + v.y * e[13] + v.z * e[14] + v.w * e[15];
  return this;
};

EZ3.Vector4.prototype.mulMat = function(m, v) {
  var x, y, z, w;
  var e = m.elements;

  if (v !== undefined) {
    x = v.x;
    y = v.y;
    z = v.z;
    w = v.w;
  } else {
    x = this.x;
    y = this.y;
    z = this.z;
    w = this.w;
  }

  this.x = x * e[0] + y * e[4] + z * e[8] + w * e[12];
  this.y = x * e[1] + y * e[5] + z * e[9] + w * e[13];
  this.z = x * e[2] + y * e[6] + z * e[10] + w * e[14];
  this.w = x * e[3] + y * e[7] + z * e[11] + w * e[15];

  return this;
};

EZ3.Vector4.prototype.length = function(v) {
  if (v !== undefined)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector4.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {

    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x = v.x * l;
      this.y = v.y * l;
      this.z = v.z * l;
      this.w = v.w * l;
    }
  } else {

    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
  }

  return this;
};

EZ3.Vector4.prototype.invert = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
    this.z = -v.z;
    this.w = -v.w;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
  }
  return this;
};

EZ3.Vector4.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  this.w = v.w;
  return this;
};

EZ3.Vector4.prototype.clone = function() {
  return new EZ3.Vector4(this.x, this.y, this.z, this.w);
};

EZ3.Vector4.prototype.toArray = function() {
  return [this.x, this.y, this.z, this.w];
};

EZ3.Vector4.prototype.testEqual = function(v) {
  var x;
  var y;
  var z;
  var w;

  if(v instanceof EZ3.Vector4) {
    x = (this.x === v.x);
    y = (this.y === v.y);
    z = (this.z === v.z);
    w = (this.w === v.w);

    return (x && y && z && w);
  } else
    return false;
};

EZ3.Vector4.prototype.hasZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v !== undefined) {
    ex = (v.x === 0.0);
    ey = (v.y === 0.0);
    ez = (v.z === 0.0);
    ew = (v.w === 0.0);
  }else {
    ex = (this.x === 0.0);
    ey = (this.y === 0.0);
    ez = (this.z === 0.0);
    ew = (this.w === 0.0);
  }

  return (ex || ey || ez || ew);
};

EZ3.Vector4.prototype.testZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v !== undefined) {
    ex = (v.x === 0.0);
    ey = (v.y === 0.0);
    ez = (v.z === 0.0);
    ew = (v.w === 0.0);
  }else {
    ex = (this.x === 0.0);
    ey = (this.y === 0.0);
    ez = (this.z === 0.0);
    ew = (this.w === 0.0);
  }

  return (ex && ey && ez && ew);
};

EZ3.Vector4.prototype.testDiff = function(v) {
  var dx = (this.x !== v.x);
  var dy = (this.y !== v.y);
  var dz = (this.z !== v.z);
  var dw = (this.w !== v.w);

  return (dx && dy && dz && dw);
};

EZ3.Vector4.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Vector4[' + x + ', ' + y + ', ' + z + ', ' + w + ']';
};

EZ3.Vector4.prototype.toVec2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector4.prototype.toVec3 = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

Object.defineProperty(EZ3.Vector4.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;
    this.dirty = true;
  }
});

Object.defineProperty(EZ3.Vector4.prototype, 'w', {
  get: function() {
    return this._w;
  },
  set: function(w) {
    this._w = w;
    this.dirty = true;
  }
});

/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.buffers = new EZ3.ArrayBuffer();
};

EZ3.Geometry.prototype.processLinearIndices = function() {
  var lines = [];
  var triangles;
  var i;

  if (this.buffers.get('triangle')) {
    triangles = this.buffers.get('triangle').data;

    for (i = 0; i < triangles.length; i += 3) {
      lines.push(triangles[i]);
      lines.push(triangles[i + 1]);
      lines.push(triangles[i]);
      lines.push(triangles[i + 2]);
      lines.push(triangles[i + 1]);
      lines.push(triangles[i + 2]);
    }

    this.buffers.add('line', new EZ3.IndexBuffer(lines, false));
  }
};

EZ3.Geometry.prototype.processNormals = function() {
  var normals = [];
  var tmpNormals = [];
  var tmpAppearances = [];
  var normal = new EZ3.Vector3();
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var indices = this.buffers.get('triangle').data;
  var vertices = this.buffers.get('position').data;
  var buffer;
  var x;
  var y;
  var z;
  var k;

  for (k = 0; k < vertices.length / 3; ++k) {
    tmpNormals.push(0);
    tmpNormals.push(0);
    tmpNormals.push(0);
    tmpAppearances.push(0);
  }

  for (k = 0; k < indices.length; k += 3) {
    x = 3 * indices[k + 0];
    y = 3 * indices[k + 1];
    z = 3 * indices[k + 2];

    point0.set(vertices[x + 0], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y + 0], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z + 0], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    normal = vector1.cross(vector0);

    if (!normal.testZero())
      normal.normalize();

    tmpNormals[x + 0] += normal.x;
    tmpNormals[x + 1] += normal.y;
    tmpNormals[x + 2] += normal.z;

    tmpNormals[y + 0] += normal.x;
    tmpNormals[y + 1] += normal.y;
    tmpNormals[y + 2] += normal.z;

    tmpNormals[z + 0] += normal.x;
    tmpNormals[z + 1] += normal.y;
    tmpNormals[z + 2] += normal.z;

    ++tmpAppearances[x / 3];
    ++tmpAppearances[y / 3];
    ++tmpAppearances[z / 3];
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    normals.push(tmpNormals[x] / tmpAppearances[k]);
    normals.push(tmpNormals[y] / tmpAppearances[k]);
    normals.push(tmpNormals[z] / tmpAppearances[k]);
  }

  tmpNormals = [];
  tmpAppearances = [];
  
  buffer = new EZ3.VertexBuffer(normals, false);
  buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('normal', buffer);
};

EZ3.Geometry.prototype.processTangentsAndBitangents = function() {
  var tangents = [];
  var bitangents = [];
  var tmpTangents = [];
  var tmpBitangents = [];
  var point0 = new EZ3.Vector3();
  var point1 = new EZ3.Vector3();
  var point2 = new EZ3.Vector3();
  var normal = new EZ3.Vector3();
  var tangent = new EZ3.Vector3();
  var vector0 = new EZ3.Vector3();
  var vector1 = new EZ3.Vector3();
  var tmpNormal  = new EZ3.Vector3();
  var bitangent  = new EZ3.Vector3();
  var textPoint0 = new EZ3.Vector2();
  var textPoint1 = new EZ3.Vector2();
  var textPoint2 = new EZ3.Vector2();
  var textVector0 = new EZ3.Vector2();
  var textVector1 = new EZ3.Vector2();
  var uvs = this.uvs.data;
  var indices = this.indices.data;
  var normals = this.normals.data;
  var vertices = this.vertices.data;
  var handedness;
  var x;
  var y;
  var z;
  var vx;
  var vy;
  var vz;
  var tx;
  var ty;
  var tz;
  var r;
  var k;

  for (k = 0; k < vertices.length; ++k) {
    tmpTangents.push(0);
    tmpBitangents.push(0);
  }

  for (k = 0; k < indices.length; k += 3) {

    vx = 3 * indices[k + 0];
    vy = 3 * indices[k + 1];
    vz = 3 * indices[k + 2];

    tx = 2 * indices[k + 0];
    ty = 2 * indices[k + 1];
    tz = 2 * indices[k + 2];

    textPoint0.set(uvs[tx + 0], uvs[tx + 1]);
    textPoint1.set(uvs[ty + 0], uvs[ty + 1]);
    textPoint2.set(uvs[tz + 0], uvs[tz + 1]);

    point0.set(vertices[vx + 0], vertices[vx + 1], vertices[vx + 2]);
    point1.set(vertices[vy + 0], vertices[vy + 1], vertices[vy + 2]);
    point2.set(vertices[vz + 0], vertices[vz + 1], vertices[vz + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    textVector0.sub(textPoint1, textPoint0);
    textVector1.sub(textPoint2, textPoint0);

    r = 1.0 / (textVector0.x * textVector1.y - textVector1.x * textVector0.y);

    tangent.x = (textVector1.y * vector0.x - textVector0.y * vector1.x) * r;
    tangent.y = (textVector1.y * vector0.y - textVector0.y * vector1.y) * r;
    tangent.z = (textVector1.y * vector0.z - textVector0.y * vector1.z) * r;

    bitangent.x = (textVector0.x * vector1.x - textVector1.x * vector0.x) * r;
    bitangent.y = (textVector0.x * vector1.y - textVector1.x * vector0.y) * r;
    bitangent.z = (textVector0.x * vector1.z - textVector1.x * vector0.z) * r;

    tmpTangents[vx + 0] += tangent.x;
    tmpTangents[vy + 0] += tangent.y;
    tmpTangents[vz + 0] += tangent.z;

    tmpTangents[vx + 1] += tangent.x;
    tmpTangents[vy + 1] += tangent.y;
    tmpTangents[vz + 1] += tangent.z;

    tmpTangents[vx + 2] += tangent.x;
    tmpTangents[vy + 2] += tangent.y;
    tmpTangents[vz + 2] += tangent.z;

    tmpBitangents[vx + 0] += bitangent.x;
    tmpBitangents[vy + 0] += bitangent.y;
    tmpBitangents[vz + 0] += bitangent.z;

    tmpBitangents[vx + 1] += bitangent.x;
    tmpBitangents[vy + 1] += bitangent.y;
    tmpBitangents[vz + 1] += bitangent.z;

    tmpBitangents[vx + 2] += bitangent.x;
    tmpBitangents[vy + 2] += bitangent.y;
    tmpBitangents[vz + 2] += bitangent.z;
  }

  for (k = 0; k < vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    tangent.set(tmpTangents[x], tmpTangents[y], tmpTangents[z]);
    bitangent.set(tmpBitangents[x], tmpBitangents[y], tmpBitangents[z]);
    normal.set(normals[x], normals[y], normals[z]);

    tmpNormal.copy(normal);
    tmpNormal.scaleEqual(tmpNormal.dot(tangent));
    tangent.subEqual(tmpNormal);
    tangent.normalize();

    tmpNormal.copy(normal);
    handedness = (bitangent.dot(tmpNormal.cross(tangent))) < 0 ? -1 : 1;

    bitangents.push(bitangent.x, bitangent.y, bitangent.z);
    tangents.push(tangent.x, tangent.y, tangent.z, handedness);
  }

  tmpTangents = [];
  tmpBitangents = [];

  this.tangents.data = tangents;
  this.bitangents.data = bitangents;
};

/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._index = {};
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, attributes, state, index) {
  var buffer;
  var k;

  if (state.extension['OES_vertex_array_object']) {
    if (!this._id)
      this._id = state.extension['OES_vertex_array_object'].createVertexArrayOES();

    state.extension['OES_vertex_array_object'].bindVertexArrayOES(this._id);

    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.validate(gl, attributes) && buffer.dirty) {
        buffer.bind(gl, attributes);
        buffer.update(gl);
        buffer.dirty = false;
      }
    }
  } else {
    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.validate(gl, attributes)) {
        buffer.bind(gl, attributes, state);

        if (buffer.dirty) {
          buffer.update(gl);
          buffer.dirty = false;
        }
      }
    }
  }

  if (index) {
    index.bind(gl);

    if (index.dirty) {
      index.update(gl, state);
      index.dirty = false;
    }
  }
};

EZ3.ArrayBuffer.prototype.add = function(name, buffer) {
  if (buffer instanceof EZ3.IndexBuffer)
    this._index[name] = buffer;
  else if (buffer instanceof EZ3.VertexBuffer)
    this._vertex[name] = buffer;
};

EZ3.ArrayBuffer.prototype.get = function(name) {
  if (this._index[name])
    return this._index[name];
  else
    return this._vertex[name];
};

/**
 * @class Buffer
 */

EZ3.Buffer = function(data, dynamic) {
  this._id = null;

  this.ranges = [];
  this.data = data || [];
  this.dynamic = dynamic || false;
  this.usage = null;
  this.length = null;
  this.dirty = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

/**
 * @class BufferRange
 */

EZ3.BufferRange = function(left, right) {
  this.left = left;
  this.right = right;
};

/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, vertex, fragment, prefix) {
  this.used = 1;
  this._cache = {};
  this._shaders = [];
  this._uniform = {};
  this._attribute = {};
  this._program = null;
  this._create(gl, vertex, fragment, prefix);
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var infoLog;
  var message;
  var lineNumbers;
  var shader = gl.createShader(type);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    infoLog = gl.getShaderInfoLog(shader);
    lineNumbers = this._addLineNumbers(code);
    message = 'EZ3.GLSLProgram shader info log: ';
    console.log(message + infoLog + lineNumbers + '\n');
  } else {
    if (type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX] = shader;
    else if (type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, vertex, fragment, prefix) {
  var infoLog;
  var message;

  prefix = (prefix) ? prefix : '';

  this._compile(gl, gl.VERTEX_SHADER, prefix + vertex);
  this._compile(gl, gl.FRAGMENT_SHADER, prefix + fragment);

  this._program = gl.createProgram();

  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.VERTEX]);
  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.FRAGMENT]);

  gl.linkProgram(this._program);

  if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
    infoLog = gl.getProgramInfoLog(this._program, gl.LINK_STATUS);
    message = 'EZ3.GLSLProgram linking program error info log: ';
    console.log(message + infoLog + '\n');
  } else {
    this._loadUniforms(gl);
    this._loadAttributes(gl);

    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var totalUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
  var uniformInfo;

  for (var k = 0; k < totalUniforms; ++k) {
    uniformInfo = gl.getActiveUniform(this._program, k);
    this._addUniform(gl, uniformInfo.name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var totalAttrib = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
  var attributeInfo;

  for (var k = 0; k < totalAttrib; ++k) {
    attributeInfo = gl.getActiveAttrib(this._program, k);
    this._addAttribute(gl, attributeInfo.name);
  }
};

EZ3.GLSLProgram.prototype._addUniform = function(gl, name) {
  this.uniforms[name] = gl.getUniformLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._addAttribute = function(gl, name) {
  this.attributes[name] = gl.getAttribLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._addLineNumbers = function(code) {
  var codeLines = code.split('\n');

  for (var k = 0; k < codeLines.length; ++k)
    codeLines[k] = (k + 1) + ': ' + codeLines[k] + '\n\n';

  return codeLines;
};

EZ3.GLSLProgram.prototype._isCached = function(name, data) {
  var cached = this._cache[name];

  if (cached) {
    if (cached instanceof EZ3.Matrix3 || cached instanceof EZ3.Matrix4 ||
      cached instanceof EZ3.Vector2 || cached instanceof EZ3.Vector3 ||
      cached instanceof EZ3.Vector4)
      return cached.testEqual(data);
    else if (cached === data)
      return true;
    else
      return false;
  } else
    return false;
};

EZ3.GLSLProgram.prototype._caching = function(name, data) {
  if (data instanceof EZ3.Matrix3 || data instanceof EZ3.Matrix4 ||
    data instanceof EZ3.Vector2 || data instanceof EZ3.Vector3 ||
    data instanceof EZ3.Vector4)
    this._cache[name] = data.clone();
  else
    this._cache[name] = data;
};

EZ3.GLSLProgram.prototype.bind = function(gl) {
  gl.useProgram(this._program);
};

EZ3.GLSLProgram.prototype.loadUniformf = function(gl, name, size, data) {
  var v;

  if (!this._isCached(name, data)) {
    this._caching(name, data);

    if (size > 1)
      v = data.toArray();

    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1f(this.uniforms[name], data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2f(this.uniforms[name], v[0], v[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3f(this.uniforms[name], v[0], v[1], v[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4f(this.uniforms[name], v[0], v[1], v[2], v[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformi = function(gl, name, size, data) {
  var v;

  if (!this._isCached(name, data)) {
    this._caching(name, data);

    if (size > 1)
      v = data.toArray();

    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
        gl.uniform1i(this.uniforms[name], data);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
        gl.uniform2i(this.uniforms[name], v[0], v[1]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
        gl.uniform3i(this.uniforms[name], v[0], v[1], v[2]);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
        gl.uniform4i(this.uniforms[name], v[0], v[1], v[2], v[3]);
        break;
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, size, data) {
  var v;

  if (!this._isCached(name, data)) {
    this._caching(name, data);

    v = data.toArray();

    switch (size) {
      case EZ3.GLSLProgram.UNIFORM_SIZE_2X2:
        gl.uniformMatrix2fv(this.uniforms[name], false, v);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_3X3:
        gl.uniformMatrix3fv(this.uniforms[name], false, v);
        break;
      case EZ3.GLSLProgram.UNIFORM_SIZE_4X4:
        gl.uniformMatrix4fv(this.uniforms[name], false, v);
        break;
    }
  }
};

Object.defineProperty(EZ3.GLSLProgram.prototype, 'uniforms', {
  get: function() {
    return this._uniform;
  }
});

Object.defineProperty(EZ3.GLSLProgram.prototype, 'attributes', {
  get: function() {
    return this._attribute;
  }
});

EZ3.GLSLProgram.UNIFORM_SIZE_1D = 1;
EZ3.GLSLProgram.UNIFORM_SIZE_2D = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3D = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4D = 4;
EZ3.GLSLProgram.UNIFORM_SIZE_2X2 = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3X3 = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4X4 = 4;

EZ3.GLSLProgram.VERTEX = 0;
EZ3.GLSLProgram.FRAGMENT = 1;

/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.context = null;
  this.canvas = canvas;
  this.options = options;
  this.state = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._renderMesh = function(mesh, camera, lights) {
  var gl = this.context;
  var program = mesh.material.program;
  var modelView = new EZ3.Matrix4();
  var i;

  program.bind(gl);
  mesh.material.updateStates(gl, this.state);
  mesh.material.updateUniforms(gl, this.state);

  modelView.mul(mesh.world, camera.view);

  program.loadUniformf(gl, 'uEyePosition', 3, camera.position);
  program.loadUniformMatrix(gl, 'uModel', 4, mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', 4, modelView);
  program.loadUniformMatrix(gl, 'uProjection', 4, camera.projection);

  if (!lights.empty)
    program.loadUniformMatrix(gl, 'uNormal', 3, mesh.normal);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, program, i);

  mesh.render(gl, program.attributes, this.state);
};

EZ3.Renderer.prototype.initContext = function() {
  var that = this;
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];
  var i;

  for (i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context) {
      this.state = new EZ3.RendererState(this.context);
      break;
    }
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options.');

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
};

EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

EZ3.Renderer.prototype.viewport = function(position, size) {
  var gl = this.context;

  gl.viewport(position.x, position.y, size.x, size.y);
};

EZ3.Renderer.prototype.render = function(scene, camera) {
  var gl = this.context;
  var entities = [];
  var meshes = {
    common: [],
    opaque: [],
    transparent: []
  };
  var lights = {
    empty: true,
    point: [],
    directional: [],
    spot: []
  };
  var entity;
  var mesh;
  var i;

  entities.push(scene);

  while (entities.length) {
    entity = entities.pop();

    if (entity instanceof EZ3.PointLight)
      lights.point.push(entity);
    else if (entity instanceof EZ3.DirectionalLight)
      lights.directional.push(entity);
    else if (entity instanceof EZ3.SpotLight)
      lights.spot.push(entity);
    else if (entity instanceof EZ3.Mesh)
      meshes.common.push(entity);

    for (i = entity.children.length - 1; i >= 0; i--)
      entities.push(entity.children[i]);

    entity.updateWorld();
  }

  if (lights.point.length || lights.directional.length || lights.spot.length)
    lights.empty = false;

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];

    mesh.updateEssentialBuffers();

    if (!lights.empty) {
      mesh.updateIlluminationBuffers();
      mesh.updateNormal();
    }

    mesh.material.updateProgram(gl, lights, this.state);

    if (mesh.material.transparent)
      meshes.transparent.push(mesh);
    else
      meshes.opaque.push(mesh);
  }

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i], camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i], camera, lights);
};

/**
 * @class RendererState
 */

EZ3.RendererState = function(gl) {
  this.program = {};
  this.texture = {};
  this.extension = {};
  this.attribute = {};
  this.capability = {};
  this.currentTextureSlot = null;

  this._initCapabilities();
  this._initExtensions(gl);
};

EZ3.RendererState.prototype.constructor = EZ3.RendererState;

EZ3.RendererState.prototype._initCapabilities = function() {
  this.capability[EZ3.RendererState.DEPTH_TEST] = {
    enabled: false,
    value: null
  };
  this.capability[EZ3.RendererState.CULL_FACE] = {
    enabled: false,
    value: null
  };
  this.capability[EZ3.RendererState.BLENDING] = {
    enabled: false,
    blendEquation: null,
    blendFunc: {
      sfactor: null,
      dfactor: null
    }
  };
};

EZ3.RendererState.prototype._initExtensions = function(gl) {
  this.extension['OES_standard_derivatives'] = gl.getExtension('OES_standard_derivatives');
  this.extension['OES_vertex_array_object'] = gl.getExtension('OES_vertex_array_object');
  this.extension['OES_element_index_uint'] = gl.getExtension('OES_element_index_uint');
};

EZ3.RendererState.CULL_FACE = 0;
EZ3.RendererState.BLENDING = 1;
EZ3.RendererState.DEPTH_TEST = 2;

/**
* @class ShaderLibrary
*/

EZ3.ShaderLibrary = function() {
  this.mesh = {};
};

EZ3.ShaderLibrary = new EZ3.ShaderLibrary();

EZ3.ShaderLibrary['mesh'].vertex = "precision highp float;\r\n\r\nattribute vec3 position;\r\nattribute vec3 normal;\r\nattribute vec2 uv;\r\n\r\nuniform mat4 uModel;\r\nuniform mat3 uNormal;\r\nuniform mat4 uModelView;\r\nuniform mat4 uProjection;\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vPosition = vec3(uModel * vec4(position, 1.0));\r\n  vNormal = normalize(uNormal * normal);\r\n  vUv = uv;\r\n\r\n  gl_PointSize = 3.0;\r\n  gl_Position = uProjection * uModelView * vec4(position, 1.0);\r\n}\r\n";
EZ3.ShaderLibrary['mesh'].fragment = "precision highp float;\r\n\r\nstruct PointLight\r\n{\r\n\tvec3 position;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nstruct DirectionalLight\r\n{\r\n\tvec3 direction;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nstruct SpotLight\r\n{\r\n\tvec3 position;\r\n\tvec3 direction;\r\n\tfloat cutoff;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nuniform vec3 uEmissive;\r\nuniform vec3 uDiffuse;\r\nuniform vec3 uSpecular;\r\nuniform float uShininess;\r\n\r\nuniform vec3 uEyePosition;\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n  uniform PointLight uPointLights[MAX_POINT_LIGHTS];\r\n#endif\r\n\r\n#if MAX_DIRECTIONAL_LIGHTS > 0\r\n  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];\r\n#endif\r\n\r\n#ifdef EMISSIVE_MAP\r\nuniform sampler2D uEmissiveSampler;\r\n#endif\r\n\r\n#ifdef DIFFUSE_MAP\r\nuniform sampler2D uDiffuseSampler;\r\n#endif\r\n\r\n#ifdef SPECULAR_MAP\r\nuniform sampler2D uSpecularSampler;\r\n#endif\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\n#ifdef NORMAL_MAP\r\n#extension GL_OES_standard_derivatives : enable\r\n\r\nuniform sampler2D uNormalSampler;\r\n\r\nvec3 pertubNormal(vec3 v) {\r\n\tvec3 q0 = dFdx(v);\r\n\tvec3 q1 = dFdy(v);\r\n\r\n\tvec2 st0 = dFdx(vUv);\r\n\tvec2 st1 = dFdy(vUv);\r\n\r\n\tvec3 s = normalize(q0 * st1.t - q1 * st0.t);\r\n\tvec3 t = normalize(-q0 * st1.s + q1 * st0.s);\r\n\tvec3 n = normalize(vNormal);\r\n\r\n\tvec3 d = texture2D(uNormalSampler, vUv).xyz * 2.0 - 1.0;\r\n\r\n\treturn normalize(mat3(s, t, n) * d);\r\n}\r\n#endif\r\n\r\nvoid main() {\r\n\tvec3 emissive = uEmissive;\r\n\tvec3 diffuse = vec3(0.0, 0.0, 0.0);\r\n\tvec3 specular = vec3(0.0, 0.0, 0.0);\r\n\r\n\tvec3 v = normalize(uEyePosition - vPosition);\r\n\r\n#ifdef NORMAL_MAP\r\n\tvec3 n = pertubNormal(-v);\r\n#else\r\n\tvec3 n = vNormal;\r\n#endif\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n  for(int i = 0; i < MAX_POINT_LIGHTS; i++)\r\n  {\r\n    vec3 s = normalize(uPointLights[i].position - vPosition);\r\n\t\tfloat q = max(dot(s, n), 0.0);\r\n\r\n\t\tif (q > 0.0) {\r\n\t\t\tvec3 r = reflect(-s, n);\r\n\t\t\tfloat w = pow(max(dot(r, v), 0.0), uShininess);\r\n\r\n    \tdiffuse += uPointLights[i].diffuse * uDiffuse * q;\r\n\t\t\tspecular += uPointLights[i].specular * uSpecular * w;\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#if MAX_DIRECTIONAL_LIGHTS > 0\r\n  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++)\r\n  {\r\n\t\tfloat q = max(dot(uDirectionalLights[i].direction, n), 0.0);\r\n\r\n\t\tif (q > 0.0) {\r\n\t\t\tvec3 r = reflect(-uDirectionalLights[i].direction, n);\r\n\t\t\tfloat w = pow(max(dot(r, v), 0.0), uShininess);\r\n\r\n    \tdiffuse += uDirectionalLights[i].diffuse * uDiffuse * q;\r\n\t\t\tspecular += uDirectionalLights[i].specular * uSpecular * w;\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n  for(int i = 0; i < MAX_SPOT_LIGHTS; i++)\r\n  {\r\n\t\tvec3 s = normalize(uSpotLights[i].position - vPosition);\r\n\t\tfloat angle = max(dot(s, uSpotLights[i].direction), 0.0);\r\n\r\n\t\tif(angle > uSpotLights[i].cutoff) {\r\n\t\t\tfloat q = max(dot(uSpotLights[i].direction, n), 0.0);\r\n\r\n\t\t\tif (q > 0.0) {\r\n\t\t\t\tvec3 r = reflect(-s, n);\r\n\t\t\t\tfloat w = pow(max(dot(r, v), 0.0), uShininess);\r\n\r\n\t\t\t\tdiffuse += uSpotLights[i].diffuse * uDiffuse * q;\r\n\t\t\t\tspecular += uSpotLights[i].specular * uSpecular * w;\r\n\t\t\t}\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#ifdef EMISSIVE_MAP\r\n  emissive *= vec3(texture2D(uEmissiveSampler, vUv));\r\n#endif\r\n\r\n#ifdef DIFFUSE_MAP\r\n\tdiffuse *= vec3(texture2D(uDiffuseSampler, vUv));\r\n#endif\r\n\r\n#ifdef SPECULAR_MAP\r\n\tspecular *= vec3(texture2D(uSpecularSampler, vUv))\r\n#endif\r\n\r\n  gl_FragColor = vec4(emissive + diffuse + specular, 1.0);\r\n}\r\n";
/**
 * @class VertexBufferAttribute
 */

EZ3.VertexBufferAttribute = function(size, offset, normalized) {
  this.size = size;
  this.offset = 4 * offset || 0;
  this.normalized = normalized || false;
};

/**
 * @class AnimationFrame
 */

EZ3.AnimationFrame = function(timeOut) {
  var device = EZ3.Device;

  this._id = 0;

  if (!device.requestAnimationFrame || timeOut) {
    this._onRequestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };

    this._onCancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  } else {
    this._onRequestAnimationFrame = function(callback) {
      return window[device.requestAnimationFrame](callback);
    };

    this._onCancelAnimationFrame = function(id) {
      window[device.cancelAnimationFrame](id);
    };
  }
};

EZ3.AnimationFrame.prototype.request = function(callback) {
  this._id = this._onRequestAnimationFrame(callback);
};

EZ3.AnimationFrame.prototype.cancel = function() {
  this._onCancelAnimationFrame(this._id);
};

/**
 * @class Device
 */

EZ3.Device = function() {
  this.ready = false;
  this.onResize = new EZ3.Signal();
  this.operatingSystem = 0;
  this.requestAnimationFrame = null;
  this.cancelAnimationFrame = null;
  this.touchDown = null;
  this.touchMove = null;
  this.touchUp = null;
  this.scroll = null;
  this.requestFullScreen = null;
  this.cancelFullScreen = null;
  this.fullScreenChange = null;
  this.fullScreenError = null;
  this.requestPointerLock = null;
  this.cancelPointerLock = null;
  this.pointerLockChange = null;
  this.pointerLockError = null;
};

EZ3.Device = new EZ3.Device();

EZ3.Device._check = function() {
  var that = this;

  function checkOperatingSystem() {
    if (/Playstation Vita/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.PSVITA;
    else if (/Kindle/.test(navigator.userAgent) || /\bKF[A-Z][A-Z]+/.test(navigator.userAgent) || /Silk.*Mobile Safari/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.KINDLE;
    else if (/Android/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.ANDROID;
    else if (/CrOS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.CRHOMEOS;
    else if (/iP[ao]d|iPhone/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.IOS;
    else if (/Linux/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.LINUX;
    else if (/Mac OS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.MACOS;
    else if (/Windows/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS;

    if (/Windows Phone/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE;
  }

  function checkAnimationFrame() {
    if (window.requestAnimationFrame) {
      that.requestAnimationFrame = 'requestAnimationFrame';
      that.cancelAnimationFrame = 'cancelAnimationFrame';
    } else if (window.webkitRequestAnimationFrame) {
      that.requestAnimationFrame = 'webkitRequestAnimationFrame';
      that.cancelAnimationFrame = 'webkitCancelAnimationFrame';
    } else if (window.mozRequestAnimationFrame) {
      that.requestAnimationFrame = 'mozRequestAnimationFrame';
      that.cancelAnimationFrame = 'mozCancelAnimationFrame';
    } else if (window.msRequestAnimationFrame) {
      that.requestAnimationFrame = 'msRequestAnimationFrame';
      that.cancelAnimationFrame = 'msCancelAnimationFrame';
    } else if (window.oRequestAnimationFrake) {
      that.requestAnimationFrame = 'oRequestAnimationFrame';
      that.cancelAnimationFrame = 'oCancelAnimationFrame';
    }
  }

  function checkInput() {
    if ('ontouchstart' in document.documentElement || window.navigator.maxTouchPoints) {
      that.touchDown = 'touchstart';
      that.touchMove = 'touchmove';
      that.touchUp = 'touchend';
    } else if (window.navigator.pointerEnabled) {
      that.touchDown = 'pointerdown';
      that.touchMove = 'pointermove';
      that.touchUp = 'pointerup';
    } else if (window.navigator.msPointerEnabled) {
      that.touchDown = 'MSPointerDown';
      that.touchMove = 'MSPointerMove';
      that.touchUp = 'MSPointerUp';
    }

    if ('onwheel' in window || 'WheelEvent' in window) {
      that.wheel = 'wheel';
    } else if ('onmousewheel' in window) {
      that.wheel = 'mousewheel';
    } else if ('MouseScrollEvent' in window) {
      that.wheel = 'DOMMouseScroll';
    }
  }

  function checkFullScreen() {
    if (document.fullscreenEnabled) {
      that.requestFullScreen = 'requestFullscreen';
      that.cancelFullScreen = 'exitFullscreen';
      that.fullScreenChange = 'fullscreenchange';
      that.fullScreenError = 'fullscreenerror';
    } else if (document.webkitFullscreenEnabled) {
      that.requestFullScreen = 'webkitRequestFullscreen';
      that.cancelFullScreen = 'webkitExitFullscreen';
      that.fullScreenChange = 'webkitfullscreenchange';
      that.fullScreenError = 'webkitfullscreenerror';
    } else if (document.mozFullScreenEnabled) {
      that.requestFullScreen = 'mozRequestFullscreen';
      that.cancelFullScreen = 'mozCancelFullScreen';
      that.fullScreenChange = 'mozfullscreenchange';
      that.fullScreenError = 'mozfullscreenerror';
    } else if (document.msFullscreenEnabled) {
      that.requestFullScreen = 'msRequestFullscreen';
      that.cancelFullScreen = 'msExitFullscreen';
      that.fullScreenChange = 'MSFullscreenChange';
      that.fullScreenError = 'MSFullscreenError';
    }
  }

  function checkPointerLock() {
    if ('pointerLockElement' in document) {
      that.requestPointerLock = 'requestPointerLock';
      that.cancelPointerLock = 'exitPointerLock';
      that.pointerLockChange = 'pointerlockchange';
      that.pointerLockCancel = 'pointerlockerror';
    } else if ('webkitPointerLockElement' in document) {
      that.requestPointerLock = 'webkitRequestPointerLock';
      that.cancelPointerLock = 'webkitExitPointerLock';
      that.pointerLockChange = 'webkitpointerlockchange';
      that.pointerLockCancel = 'webkitpointerlockerror';
    } else if ('mozPointerLockElement' in document) {
      that.requestPointerLock = 'mozRequestPointerLock';
      that.cancelPointerLock = 'mozExitPointerLock';
      that.pointerLockChange = 'mozpointerlockchange';
      that.pointerLockCancel = 'mozpointerlockerror';
    }
  }

  checkOperatingSystem();
  checkAnimationFrame();
  checkFullScreen();
  checkPointerLock();
  checkInput();
};

EZ3.Device._isReady = function() {
  var that;

  if (!document.body)
    window.setTimeout(this._isReady, 20);
  else if (!this.ready) {
    that = this;

    document.removeEventListener('deviceready', this._onReady);
    document.removeEventListener('DOMContentLoaded', this._onReady);
    window.removeEventListener('load', this._onReady);
    delete this._onReady;

    this._check();
    delete this._check;

    this._onResize = function() {
      that.onResize.dispatch();
    };

    window.addEventListener('resize', this._onResize, true);

    this.ready = true;
    this._isReady.signal.dispatch();

    this._isReady.signal.dispose();
    delete this._isReady;
  }
};

EZ3.Device.onReady = function(callback, context, params) {
  var that;
  var binding;

  if (this.ready)
    callback.apply(context, params);
  else if (this._isReady.signal) {
    binding = this._isReady.signal.add(callback, context);
    binding.params = params;
  } else {
    that = this;

    this._isReady.signal = new EZ3.Signal();
    binding = this._isReady.signal.add(callback, context);
    binding.params = params;

    this._onReady = function() {
      that._isReady();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive')
      this._isReady();
    else if (typeof window.cordova !== 'undefined' && !navigator['isCocoonJS'])
      document.addEventListener('deviceready', this._onReady, false);
    else {
      document.addEventListener('DOMContentLoaded', this._onReady, false);
      window.addEventListener('load', this._onReady, false);
    }
  }
};

EZ3.Device.OPERATING_SYSTEM = {};
EZ3.Device.OPERATING_SYSTEM.WINDOWS = 1;
EZ3.Device.OPERATING_SYSTEM.MACOS = 2;
EZ3.Device.OPERATING_SYSTEM.LINUX = 4;
EZ3.Device.OPERATING_SYSTEM.IOS = 8;
EZ3.Device.OPERATING_SYSTEM.ANDROID = 16;
EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE = 32;
EZ3.Device.OPERATING_SYSTEM.CRHOMEOS = 64;
EZ3.Device.OPERATING_SYSTEM.KINDLE = 128;
EZ3.Device.OPERATING_SYSTEM.PSVITA = 256;

/**
 * @class Time
 */

EZ3.Time = function() {
  this.now = 0;
  this.previous = 0;
  this.elapsed = 0;
  this.started = 0;
};

EZ3.Time.prototype.start = function() {
  this.started = this.now = Date.now();
};

EZ3.Time.prototype.update = function() {
  this.previous = this.now;
  this.now = Date.now();
  this.elapsed = (this.now - this.previous) * 0.001;
};

/**
 * @class Texture
 */

EZ3.Texture = function(image) {
  this._id = null;
  this._image = image;

  this.dirty = true;
};

EZ3.Texture.prototype.update = function(gl, type) {
  if (type === gl.TEXTURE_2D) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  }
};

EZ3.Texture.prototype.bind = function(gl, type, unit, state) {
  var slot = gl.TEXTURE0 + unit;

  if (!this._id)
    this._id = gl.createTexture();

  if (state.currentTextureSlot !== slot) {
    gl.activeTexture(slot);
    state.currentTextureSlot = slot;
  }

  if (!state.texture[slot]) {
    state.texture[slot] = {
      id: this._id,
      type: type
    };
    gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
  } else {
    if (state.texture[slot].id !== this._id || state.texture[slot].type !== type) {
      state.texture[slot].id = this._id;
      state.texture[slot].type = type;
      gl.bindTexture(state.texture[slot].type, state.texture[slot].id);
    }
  }
};

/**
 * @class FreeCamera
 * @extends Camera
 */

EZ3.FreeCamera = function(position, target, up, mode, filter) {
  EZ3.Camera.call(this, position, target, up, mode, filter);
};

EZ3.FreeCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.FreeCamera.prototype.constructor = EZ3.FreeCamera;

EZ3.FreeCamera.prototype._update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);

  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat(matrix).toVec3();
  this.look = new EZ3.Vector4(0, 0, 1, 0).mulMat(matrix).toVec3();
  this.right = new EZ3.Vector4(1, 0, 0, 0).mulMat(matrix).toVec3();
  this.target = new EZ3.Vector3().add(this.position, this.look);
};

EZ3.FreeCamera.prototype.lift = function(speed) {
  var lift = new EZ3.Vector3().copy(this.up).scaleEqual(speed);
  this.position.addEqual(lift);
};

EZ3.FreeCamera.prototype.walk = function(speed) {
  var walk = new EZ3.Vector3().copy(this.look).scaleEqual(speed);
  this.position.addEqual(walk);
};

EZ3.FreeCamera.prototype.strafe = function(speed) {
  var strafe = new EZ3.Vector3().copy(this.right).scaleEqual(speed);
  this.position.addEqual(strafe);
};

/**
 * @class TargetCamera
 * @extends Camera
 */

EZ3.TargetCamera = function(position, target, up, mode, filter) {
  EZ3.Camera.call(this, position, target, up, mode, filter);

  this.distance = 1;
};

EZ3.TargetCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.TargetCamera.prototype.constructor = EZ3.TargetCamera;

EZ3.TargetCamera.prototype._update = function() {
  var rx = EZ3.Math.toRadians(this._rotationAngles.x);
  var ry = EZ3.Math.toRadians(this._rotationAngles.y);
  var matrix = new EZ3.Matrix4().yawPitchRoll(rx, ry, 0);
  var vector = new EZ3.Vector4(0, 0, -1, 0).mulMat(matrix).toVec3();

  this.distance = new EZ3.Vector3().sub(this.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scaleEqual(this.distance);

  this.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat(matrix).toVec3();
  this.right = new EZ3.Vector3().cross(this.look.normalize(), this.up);
};

EZ3.TargetCamera.prototype.pan = function(dx, dy) {
  var rx;
  var ry;
  var up;
  var right;
  var vector;

  rx = dx * EZ3.Camera.MOVE_SPEED;
  ry = -dy * EZ3.Camera.MOVE_SPEED;

  right = new EZ3.Vector3().copy(this.right).scaleEqual(rx);
  up = new EZ3.Vector3().copy(this.up).scaleEqual(ry);
  vector = new EZ3.Vector3().add(right, up);

  this.position.addEqual(vector);
  this.target.addEqual(vector);
};

EZ3.TargetCamera.prototype.zoom = function(speed) {
  var look = new EZ3.Vector3().copy(this.look).scaleEqual(speed);
  this.position.addEqual(look);
};

/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.geometry = geometry;
  this.material = material;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.updateEssentialBuffers = function() {
  if (this.geometry.dirty) {
    this.geometry.generate();
    this.geometry.dirty = false;
  }

  if (this.material.fill === EZ3.Material.WIREFRAME && !this.geometry.buffers.get('line'))
    this.geometry.processLinearIndices();
};

EZ3.Mesh.prototype.updateIlluminationBuffers = function() {
  if (!this.geometry.buffers.get('normal'))
    this.geometry.processNormals();

  if (this.material.bumpMap instanceof EZ3.Texture && !this.geometry.buffers.get('tangent'))
    this.geometry.processTangentsAndBitangents();
};

EZ3.Mesh.prototype.updateNormal = function() {
  if(this.normal.dirty) {
    this.normal.normalFromMat4(this.world);
    this.normal.dirty = false;
  }
};

EZ3.Mesh.prototype.render = function(gl, attributes, state) {
  var mode;
  var buffer;

  if (this.material.fill === EZ3.Material.WIREFRAME) {
    buffer = this.geometry.buffers.get('line');
    mode = gl.LINES;
  } else if (this.material.fill === EZ3.Material.POINTS) {
    buffer = this.geometry.buffers.get('position');
    mode = gl.POINTS;
  } else {
    buffer = this.geometry.buffers.get('triangle');
    mode = gl.TRIANGLES;
  }

  if (buffer instanceof EZ3.IndexBuffer) {
    this.geometry.buffers.bind(gl, attributes, state, buffer);
    gl.drawElements(mode, buffer.data.length, buffer.getType(gl, state), 0);
  } else if (buffer instanceof EZ3.VertexBuffer) {
    this.geometry.buffers.bind(gl, attributes, state);
    gl.drawArrays(mode, 0, buffer.data.length / 3);
  }
};

/**
 * @class MousePointer
 * @extends Pointer
 */

EZ3.MousePointer = function(domElement) {
  EZ3.Pointer.call(this, domElement);

  this._buttons = [];

  this.wheel = new EZ3.Vector2();
  this.movement = new EZ3.Vector2();
  this.locked = false;
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.prototype.processPress = function(event, onPress, onMove) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processPress();
  EZ3.Pointer.prototype.processPress.call(this, event);

  onPress.dispatch(this._buttons[event.button]);
  onMove.dispatch(this);
};

EZ3.MousePointer.prototype.processMove = function(event, onMove) {
  if (!this.locked)
    EZ3.Pointer.prototype.processMove.call(this, event);
  else {
    this.movement.x = event.movementX || event.mozMovementX || 0;
    this.movement.y = event.movementY || event.mozMovementY || 0;
  }

  onMove.dispatch(this);
};

EZ3.MousePointer.prototype.processUp = function(event, onUp) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processUp();

  onUp.dispatch(this._buttons[event.button]);
};

EZ3.MousePointer.prototype.processWheel = function(event, onWheel) {
  this.wheel.x = event.wheelDeltaX || event.deltaX;
  this.wheel.y = event.wheelDeltaY || event.deltaY;

  onWheel.dispatch(this.wheel);
};

EZ3.MousePointer.prototype.processLockChange = function(onLockChange) {
  this.locked = !this.locked;

  onLockChange.dispatch(this.locked);
};

EZ3.MousePointer.prototype.getButton = function(code) {
  if (!this._buttons[code])
    this._buttons[code] = new EZ3.Switch(code);

  return this._buttons[code];
};

/**
 * @class TouchPointer
 * @extends Pointer
 * @extends Switch
 */

EZ3.TouchPointer = function(domElement, code, id) {
  EZ3.Pointer.call(this, domElement);
  EZ3.Switch.call(this, code);

  this.id = id || 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.extends(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

EZ3.TouchPointer.prototype.processPress = function(event, onPress, onMove) {
  EZ3.Pointer.prototype.processPress.call(this, event);
  EZ3.Switch.prototype.processPress.call(this);

  onPress.dispatch(this);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processMove = function(event, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processUp = function(onUp) {
  EZ3.Switch.prototype.processUp.call(this);
  onUp.dispatch(this);
};

/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);

  this.target = new EZ3.Vector3();
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target).normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformf(gl, prefix + 'direction', 3, direction);
};

/**
 * @class PointLight
 * @extends Light
 */

EZ3.PointLight = function() {
  EZ3.Light.call(this);
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

EZ3.PointLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformf(gl, prefix + 'position', 3, this.position);
};

/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);

  this.target = new EZ3.Vector3();
  this.cutoff = 0.8;
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target).normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);
  program.loadUniformf(gl, prefix + 'position', 3, this.position);
  program.loadUniformf(gl, prefix + 'direction', 3, direction);
  program.loadUniformf(gl, prefix + 'cutoff', 1, this.cutoff);
};

/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this, 'mesh');

  this.emissive = new EZ3.Vector3();
  this.emissiveMap = null;
  this.diffuse = new EZ3.Vector3(0.8, 0.8, 0.8);
  this.diffuseMap = null;
  this.specular = new EZ3.Vector3(0.2, 0.2, 0.2);
  this.specularMap = null;
  this.normalMap = null;
  this.shininess = 180.0;
  this.dirty = true;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, lights, state) {
  var id = this._name;
  var defines = [];
  var prefix = '#define ';
  var vertex;
  var fragment;

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if (this.emissiveMap instanceof EZ3.Texture)
    defines.push('EMISSIVE_MAP');

  if (this.diffuseMap instanceof EZ3.Texture)
    defines.push('DIFFUSE_MAP');

  if (this.normalMap instanceof EZ3.Texture)
    defines.push('NORMAL_MAP');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (!state.program[id]) {
    vertex = EZ3.ShaderLibrary.mesh.vertex;
    fragment = EZ3.ShaderLibrary.mesh.fragment;

    this.program = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);
    state.program[id] = this.program;
  } else
    this.program = state.program[id];
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state) {
  this.program.loadUniformf(gl, 'uEmissive', 3, this.emissive);
  this.program.loadUniformf(gl, 'uDiffuse', 3, this.diffuse);
  this.program.loadUniformf(gl, 'uSpecular', 3, this.specular);
  this.program.loadUniformf(gl, 'uShininess', 1, this.shininess);

  if (this.emissiveMap instanceof EZ3.Texture) {
    this.emissiveMap.bind(gl, gl.TEXTURE_2D, 0, state);

    if (this.emissiveMap.dirty) {
      this.emissiveMap.update(gl, gl.TEXTURE_2D);
      this.emissiveMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uEmissiveSampler', 1, 0);
  }

  if (this.diffuseMap instanceof EZ3.Texture) {
    this.diffuseMap.bind(gl, gl.TEXTURE_2D, 1, state);

    if (this.diffuseMap.dirty) {
      this.diffuseMap.update(gl, gl.TEXTURE_2D);
      this.diffuseMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uDiffuseSampler', 1, 1);
  }

  if (this.normalMap instanceof EZ3.Texture) {
    this.normalMap.bind(gl, gl.TEXTURE_2D, 2, state);

    if (this.normalMap.dirty) {
      this.normalMap.update(gl, gl.TEXTURE_2D);
      this.normalMap.dirty = false;
    }

    this.program.loadUniformi(gl, 'uNormalSampler', 1, 2);
  }
};

/**
 * @class ShaderMaterial
 * @extends Material
 */

EZ3.ShaderMaterial = function(name, vertex, fragment) {
  this.name = name;
  this.vertex = vertex;
  this.fragment = fragment;
};

EZ3.ShaderMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ShaderMaterial.prototype.constructor = EZ3.Material;

/**
 * @class AstroidalEllipsoid
 * @extends Geometry
 */

EZ3.AstroidalEllipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  if (radiuses instanceof EZ3.Vector3)
    this.radiuses = radiuses;
  else
    this.radiuses = new EZ3.Vector3(1, 1, 1);

  if (resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector2(5, 5);

  this.dirty = true;
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.AstroidalEllipsoid.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var need32Bits = false;
  var buffer;
  var length;
  var phi;
  var rho;
  var cosS;
  var cosT;
  var sinS;
  var sinT;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u - EZ3.Math.PI;
      rho = EZ3.Math.PI * v - EZ3.Math.HALF_PI;

      cosS = Math.pow(Math.cos(phi), 3.0);
      cosT = Math.pow(Math.cos(rho), 3.0);
      sinS = Math.pow(Math.sin(phi), 3.0);
      sinT = Math.pow(Math.sin(rho), 3.0);

      vertex.x = (this.radiuses.x * cosT * cosS);
      vertex.y = (this.radiuses.y * sinT);
      vertex.z = (this.radiuses.z * cosT * sinS);

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Box
 * @extends Geometry
 */

EZ3.Box = function(dimensions, resolution) {
  EZ3.Geometry.call(this);

  if (dimensions instanceof EZ3.Vector3)
    this.dimensions = dimensions;
  else
    this.dimensions = new EZ3.Vector3(1, 1, 1);

  if (resolution instanceof EZ3.Vector3)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector3(1, 1, 1);

  this.dirty = true;
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Box.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var width = this.dimensions.x;
  var height = this.dimensions.y;
  var depth = this.dimensions.z;
  var widthHalf = width * 0.5;
  var depthHalf = depth * 0.5;
  var heightHalf = height * 0.5;
  var need32Bits = false;
  var widthSegments;
  var heightSegments;
  var depthSegments;
  var buffer;
  var length;

  if (this.resolution !== undefined) {
    widthSegments = this.resolution.x;
    heightSegments = this.resolution.y;
    depthSegments = this.resolution.z;
  } else {
    widthSegments = 1;
    heightSegments = 1;
    depthSegments = 1;
  }

  function buildPlane(u, v, udir, vdir, width, height, depth) {
    var gridX = widthSegments;
    var gridY = heightSegments;
    var widthHalf = width * 0.5;
    var heightHalf = height * 0.5;
    var offset = vertices.length / 3;
    var vector = new EZ3.Vector3();
    var segmentWidth;
    var segmentHeight;
    var a;
    var b;
    var c;
    var d;
    var w;
    var i;
    var j;

    if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {

      w = 'z';

    } else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {

      w = 'y';
      gridY = depthSegments;

    } else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {

      w = 'x';
      gridX = depthSegments;

    }

    segmentWidth = width / gridX;
    segmentHeight = height / gridY;

    for (i = 0; i < gridY + 1; i++) {
      for (j = 0; j < gridX + 1; j++) {
        vector[u] = (j * segmentWidth - widthHalf) * udir;
        vector[v] = (i * segmentHeight - heightHalf) * vdir;
        vector[w] = depth;

        uvs.push(j / gridX, i / gridY);
        vertices.push(vector.x, vector.y, vector.z);
      }
    }

    for (i = 0; i < gridY; ++i) {
      for (j = 0; j < gridX; ++j) {

        a = offset + (i * (gridX + 1) + j);
        b = offset + (i * (gridX + 1) + (j + 1));
        c = offset + ((i + 1) * (gridX + 1) + j);
        d = offset + ((i + 1) * (gridX + 1) + (j + 1));

        indices.push(a, d, b, a, c, d);

        if (!need32Bits) {
          length = indices.length;
          need32Bits = need32Bits ||
            (a > EZ3.Math.MAX_USHORT) ||
            (b > EZ3.Math.MAX_USHORT) ||
            (c > EZ3.Math.MAX_USHORT) ||
            (d > EZ3.Math.MAX_USHORT);
        }
      }
    }
  }

  buildPlane('z', 'y', -1, -1, depth, height, +widthHalf);
  buildPlane('z', 'y', +1, -1, depth, height, -widthHalf);
  buildPlane('x', 'z', +1, +1, width, depth, +heightHalf);
  buildPlane('x', 'z', +1, -1, width, depth, -heightHalf);
  buildPlane('x', 'y', +1, -1, width, height, +depthHalf);
  buildPlane('x', 'y', -1, -1, width, height, -depthHalf);

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Cone
 * @extends Geometry
 */

EZ3.Cone = function(base, height, resolution) {
  EZ3.Geometry.call(this);

  this.base = base;
  this.height = height;

  if (resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector2(5, 5);

  this.dirty = true;
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;

EZ3.Cone.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var actualHeight = this.height;
  var step = (this.height - this.base) / this.resolution.x;
  var need32Bits = false;
  var radius;
  var buffer;
  var length;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      radius = Math.abs(this.height - actualHeight) * 0.5;

      vertex.x = radius * Math.cos(EZ3.Math.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = radius * Math.sin(EZ3.Math.DOUBLE_PI * v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);

      uvs.push(u);
      uvs.push(v);
    }

    actualHeight -= step;

    if (actualHeight < this.base)
      break;
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Cylinder
 * @extends Geometry
 */

EZ3.Cylinder = function(radius, base, height, resolution) {
  EZ3.Geometry.call(this);

  this.base = base;
  this.radius = radius;
  this.height = height;

  if (resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector2(5, 5);

  this.dirty = true;
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;

EZ3.Cylinder.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var actualHeight = this.height;
  var step = (this.height - this.base) / this.resolution.x;
  var need32Bits = false;
  var buffer;
  var length;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      vertex.x = this.radius * Math.cos(EZ3.Math.DOUBLE_PI * v);
      vertex.y = actualHeight;
      vertex.z = this.radius * Math.sin(EZ3.Math.DOUBLE_PI * v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);

      uvs.push(u);
      uvs.push(v);
    }

    actualHeight -= step;

    if (actualHeight < this.base)
      break;
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Ellipsoid
 * @extends Geometry
 */

EZ3.Ellipsoid = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  if (radiuses instanceof EZ3.Vector3)
    this.radiuses = radiuses;
  else
    this.radiuses = new EZ3.Vector3(3, 1, 3);

  if (resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector2(5, 5);

  this.dirty = true;
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

EZ3.Ellipsoid.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var need32Bits = false;
  var buffer;
  var length;
  var phi;
  var rho;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; ++s) {
    for (t = 0; t < this.resolution.y; ++t) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      vertex.x = (this.radiuses.x * Math.cos(phi) * Math.sin(rho));
      vertex.y = (this.radiuses.y * Math.sin(rho - EZ3.Math.HALF_PI));
      vertex.z = (this.radiuses.z * Math.sin(phi) * Math.sin(rho));

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Grid
 * @extends Geometry
 */

EZ3.Grid = function(resolution) {
  EZ3.Geometry.call(this);

  if (resolution !== undefined) {
    if (resolution instanceof EZ3.Vector2)
      this.resolution = resolution;
    else
      this.resolution = new EZ3.Vector2(2, 2);
  }

  this.dirty = true;
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Grid.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var need32Bits = false;
  var buffer;
  var length;
  var a;
  var b;
  var c;
  var d;
  var x;
  var z;

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x);
      vertices.push(0);
      vertices.push(z);

      uvs.push(x / this.resolution.y);
      uvs.push(z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      a = z * (this.resolution.x + 1) + x;
      b = a + 1;
      c = a + (this.resolution.x + 1);
      d = c + 1;

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, c, b, b, c, d);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Sphere
 * @extends Geometry
 */

EZ3.Sphere = function(radius, resolution) {
  EZ3.Geometry.call(this);

  this.radius = radius;

  if (resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = new EZ3.Vector2(5, 5);

  this.dirty = true;
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.generate = function() {
  var vertex = new EZ3.Vector3();
  var uvs = [];
  var indices = [];
  var vertices = [];
  var need32Bits = false;
  var buffer;
  var length;
  var phi;
  var rho;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    for (t = 0; t < this.resolution.y; t++) {
      u = s / (this.resolution.x - 1);
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      vertex.x = (this.radius * Math.cos(phi) * Math.sin(rho));
      vertex.y = (this.radius * Math.sin(rho - EZ3.Math.HALF_PI));
      vertex.z = (this.radius * Math.sin(phi) * Math.sin(rho));

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class Torus
 * @extends Geometry
 */

EZ3.Torus = function(radiuses, resolution) {
  EZ3.Geometry.call(this);

  if (radiuses !== undefined) {
    if (radiuses instanceof EZ3.Vector2)
      this.radiuses = radiuses;
    else
      this.radiuses = new EZ3.Vector2(0.5, 1.0);
  }

  if (resolution !== undefined) {
    if (resolution instanceof EZ3.Vector2)
      this.resolution = resolution;
    else
      this.resolution = new EZ3.Vector2(5, 5);
  }

  this.dirty = true;
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.generate = function() {
  var uvs = [];
  var indices = [];
  var vertices = [];
  var vertex = new EZ3.Vector3();
  var need32Bits = false;
  var buffer;
  var length;
  var cosS;
  var cosR;
  var sinS;
  var sinR;
  var rho;
  var phi;
  var a;
  var b;
  var c;
  var d;
  var u;
  var v;
  var s;
  var t;
  var r;

  for (s = 0; s < this.resolution.x; ++s) {
    for (r = 0; r < this.resolution.y; ++r) {
      u = s / (this.resolution.x - 1);
      v = r / (this.resolution.y - 1);

      rho = EZ3.Math.DOUBLE_PI * u;
      phi = EZ3.Math.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex.x = (this.radiuses.x + this.radiuses.y * cosR) * cosS;
      vertex.y = (this.radiuses.y * sinR);
      vertex.z = (this.radiuses.x + this.radiuses.y * cosR) * sinS;

      uvs.push(u);
      uvs.push(v);

      vertices.push(vertex.x);
      vertices.push(vertex.y);
      vertices.push(vertex.z);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      a = s * this.resolution.y + t;
      b = s * this.resolution.y + (t + 1);
      c = (s + 1) * this.resolution.y + t;
      d = (s + 1) * this.resolution.y + (t + 1);

      if (!need32Bits) {
        length = indices.length;
        need32Bits = need32Bits ||
          (a > EZ3.Math.MAX_USHORT) ||
          (b > EZ3.Math.MAX_USHORT) ||
          (c > EZ3.Math.MAX_USHORT) ||
          (d > EZ3.Math.MAX_USHORT);
      }

      indices.push(a, b, d, a, d, c);
    }
  }

  buffer = new EZ3.IndexBuffer(indices, false, need32Bits);
  this.buffers.add('triangle', buffer);

  buffer = new EZ3.VertexBuffer(uvs, false);
  buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
  this.buffers.add('uv', buffer);

  buffer = new EZ3.VertexBuffer(vertices, false);
  buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
  this.buffers.add('position', buffer);
};

/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, dynamic, need32Bits) {
  EZ3.Buffer.call(this, data, dynamic);

  this.need32Bits = need32Bits || false;
};

EZ3.IndexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.IndexBuffer.prototype.constructor = EZ3.IndexBuffer;

EZ3.IndexBuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._id);
};

EZ3.IndexBuffer.prototype.update = function(gl, state) {
  var usage = (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var length;
  var UintArray;
  var offset;
  var array;
  var bytes;
  var k;

  if(this.need32Bits) {
    if(state.extension['OES_element_index_uint']) {
      bytes = 4;
      UintArray = Uint32Array;
    } else
      return;
  } else {
    bytes = 2;
    UintArray = Uint16Array;
  }

  length = bytes * this.data.length;

  if((length !== this.length) || (usage !== this.usage)) {
    this.usage = usage;
    this.length = length;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new UintArray(this.data), usage);
  } else {
    if(this.ranges.length) {
      for(k = 0; k < this.ranges.length; k++) {
        offset = bytes * this.ranges[k].left;
        array = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, new UintArray(array));
      }
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new UintArray(this.data));
    }
  }
};

EZ3.IndexBuffer.prototype.getType = function(gl, state) {
  return (state.extension['OES_element_index_uint'] && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

/**
 * @class VertexBuffer
 * @extends Buffer
 */

EZ3.VertexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  this._stride = 0;
  this._attributes = {};
};

EZ3.VertexBuffer.prototype = Object.create(EZ3.Buffer.prototype);
EZ3.VertexBuffer.prototype.constructor = EZ3.VertexBuffer;

EZ3.VertexBuffer.prototype.validate = function(gl, attributes) {
  var k;

  for (k in this._attributes)
    if (attributes[k] >= 0)
      return true;

  return false;
};

EZ3.VertexBuffer.prototype.bind = function(gl, attributes, state) {
  var type = gl.FLOAT;
  var stride = this._stride;
  var normalized;
  var offset;
  var layout;
  var size;
  var k;

  if (!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, this._id);

  for (k in this._attributes) {
    layout = attributes[k];
    size = this._attributes[k].size;
    offset = this._attributes[k].offset;
    normalized = this._attributes[k].normalized;

    if (layout >= 0) {
      if(state) {
        if(!state.attribute[layout]) {
          gl.enableVertexAttribArray(layout);
          state.attribute[layout] = true;
        }
        gl.vertexAttribPointer(layout, size, type, normalized, stride, offset);
      } else {
        gl.enableVertexAttribArray(layout);
        gl.vertexAttribPointer(layout, size, type, normalized, stride, offset);
      }
    }
  }
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  var bytes = 4;
  var length = bytes * this.data.length;
  var usage = (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
  var offset;
  var array;
  var k;

  if ((length !== this.length) || (usage !== this.usage)) {
    this.usage = usage;
    this.length = length;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), usage);
  } else {
    if (this.ranges.length) {
      for (k = 0; k < this.ranges.length; k++) {
        offset = bytes * this.ranges[k].left;
        array = this.data.slice(this.ranges[k].left, this.ranges[k].right);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(array));
      }
    } else
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.data));
  }
};

EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  if (attribute instanceof EZ3.VertexBufferAttribute) {
    this._stride += 4 * attribute.size;
    this._attributes[name] = attribute;
  }
};

EZ3.VertexBuffer.prototype.getAttribute = function(name) {
  return this._attributes[name];
};
