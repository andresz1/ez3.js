var EZ3 = function() {
};

EZ3 = new EZ3();

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

  this.planes = {};
  this.planes.near = 0.1;
  this.planes.far = 1000.0;

  this.fov = 70.0;
  this.aspectRatio = 1.0;
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

  return new EZ3.Vector2(averageX, averageY).scale(1.0 / averageTotal);
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
  this._cache = {};

  this.parent = null;
  this.children = [];
  this.model = new EZ3.Matrix4();
  this.world = new EZ3.Matrix4();
  this.scale = new EZ3.Vector3(1, 1, 1);
  this.position = new EZ3.Vector3(0, 0, 0);
  this.rotation = new EZ3.Quaternion(0, 0, 0, 1);

  this._cache.model = this.model.clone();
  this._cache.scale = this.scale.clone();
  this._cache.position = this.position.clone();
  this._cache.rotation = this.rotation.clone();
  this._cache.parentWorld = this.model.clone();
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
  var positionDirty;
  var rotationDirty;
  var scaleDirty;
  var modelDirty;
  var parentWorldDirty;

  if(this._cache.position.testDiff(this.position)) {
    this._cache.position = this.position.clone();
    positionDirty = true;
  }

  if(this._cache.rotation.testDiff(this.rotation)) {
    this._cache.rotation = this.rotation.clone();
    rotationDirty = true;
  }

  if(this._cache.scale.testDiff(this.scale)) {
    this._cache.scale = this.scale.clone();
    scaleDirty = true;
  }

  if(positionDirty || rotationDirty || scaleDirty) {
    this.model.fromRotationTranslation(this.rotation, this.position);
    this.model.scale(this.scale);
  }

  if (!this.parent) {
    modelDirty = this._cache.model.testDiff(this.model);

    if(modelDirty) {
      this.world = this.model.clone();
      this._cache.model = this.model.clone();

      if(this instanceof EZ3.Mesh)
        this.updateNormalMatrix = true;
    }
  } else {
    modelDirty = this._cache.model.testDiff(this.model);
    parentWorldDirty = this._cache.parentWorld.testDiff(this.parent.world);

    if(parentWorldDirty || modelDirty) {

      if(modelDirty)
        this._cache.model = this.model.clone();

      if(parentWorldDirty)
        this._cache.parentWorld = this.parent.world.clone();

      this.world.mul(this.parent.world, this.model);

      if(this instanceof EZ3.Mesh)
        this.updateNormalMatrix = true;
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
  this.loader = new EZ3.Loader();
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
  var device = EZ3.Device;

  this.fullScreened = !this.fullScreened;

  if (!this.fullScreened) {
    this.canvas.removeEventListener(device.fullScreenChange, this._onFullScreenChange, true);
    delete this._onFullScreenChange;
  }
};

EZ3.ScreenManager.prototype.add = function(screen) {
  if (screen instanceof EZ3.Screen && !this.get(screen.id)) {
    screen.manager = this;
    screen.input = this.input;

    if (screen.preload) {
      screen.preload();
      screen.loader.onComplete.add(screen.create, screen);
      screen.loader.onComplete.add(function() {
        this._addEventListeners(screen);
        this._screens.unshift(screen);
      }, this);

      screen.loader.start();
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
  var device = EZ3.Device;
  var that;

  console.log('x');

  if (device.requestFullScreen && !this.fullScreened) {
    console.log('x1');
    that = this;

    this._onFullScreenChange = function(event) {
      that._processFullScreenChange(event);
    };

    this.canvas.addEventListener(device.fullScreenChange, this._onFullScreenChange, true);
    this.canvas[device.requestFullScreen]();
  }
};

EZ3.ScreenManager.prototype.windowed = function() {
  var device = EZ3.Device;

  if (device.cancelFullScreen && this.fullScreened)
    this.canvas[device.cancelFullScreen]();
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
 * @class Framebuffer
 */

 EZ3.Framebuffer = function(resolution, texture) {
  this._id = null;
  this._cache = {};

  if(resolution instanceof EZ3.Vector2)
    this.resolution = resolution;
  else
    this.resolution = null;

  if(texture instanceof EZ3.TargetTexture2D || texture instanceof EZ3.TargetCubemap)
    this.texture = texture;
  else
    this.texture = null;

  this.dirty = true;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

EZ3.Framebuffer.prototype.bind = function(gl) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
};

EZ3.Framebuffer.prototype.update = function(gl, attachment) {
  if(this.dirty) {
    this.texture.bind(gl);

    if(this.texture.dirty) {
      this.texture.update(gl);
      this.texture.dirty = false;
    }
  }

  this.texture.attachToFramebuffer(gl, attachment);
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
    document[this._device.cancelPointerLock]();
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
  program.loadUniformFloat(gl, prefix + 'diffuse', this.diffuse);
  program.loadUniformFloat(gl, prefix + 'specular', this.specular);
};

/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._files = [];
};

EZ3.Cache = new EZ3.Cache();

EZ3.Cache.add = function(url, file) {
  if (file instanceof EZ3.File) {
    this._files[url] = file;
    return this._files[url];
  }
};

EZ3.Cache.get = function(url) {
  return this._files[url];
};

/**
 * @class File
 */

EZ3.File = function(data) {
  this.data = data || null;
};

EZ3.File.prototype.constructor = EZ3.File;

/**
 * @class Loader
 */

EZ3.Loader = function() {
  this._requests = {};

  this.started = false;
  this.toSend = 0;
  this.loaded = 0;
  this.failed = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.Loader.prototype._processLoad = function(url, data) {
  var cache = EZ3.Cache;

  this.loaded++;

  cache.add(url, data);
  this._processProgress(url);
};

EZ3.Loader.prototype._processError = function(url, data) {
  this.failed++;

  this._processProgress(url, data);
};

EZ3.Loader.prototype._processProgress = function(url, error) {
  var loaded, failed;

  this.onProgress.dispatch(url, error, this.loaded, this.failed, this.toSend);

  if (this.toSend === this.loaded + this.failed) {
    loaded = this.loaded;
    failed = this.failed;

    this._requests = {};
    this.toSend = 0;
    this.loaded = 0;
    this.failed = 0;
    this.started = false;

    this.onComplete.dispatch(failed, loaded);
  }
};

EZ3.Loader.prototype.add = function(request) {
  var cache;
  var file;

  if (request instanceof EZ3.Request) {
    cache = EZ3.Cache;

    if ((request instanceof EZ3.ImageRequest || request instanceof EZ3.DataRequest)) {
      file = cache.get(request.url);

      if (file)
        return file;
    }

    if (!this._requests[request.url]) {
      this._requests[request.url] = request;
      this.toSend++;
    }

    return this._requests[request.url].response;
  }
};

EZ3.Loader.prototype.start = function() {
  var i;

  if (!this.toSend)
    this.onComplete.dispatch(0, 0);

  this.started = true;

  for (i in this._requests)
    this._requests[i].send(this._processLoad.bind(this), this._processError.bind(this));
};

/**
 * @class Request
 */

EZ3.Request = function(url, response, crossOrigin) {
  this.url = url;
  this.response = response;
  this.crossOrigin = crossOrigin || false;
};

EZ3.Request.prototype.constructor = EZ3.Request;

/**
 * @class Material
 */

EZ3.Material = function(id) {
  this._id = id || null;

  this.program = null;
  this.fill = EZ3.Material.SOLID;
  this.transparent = false;
  this.depthTest = true;
  this.backFaceCulling = true;
  this.frontFaceCulling = false;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest) {
    if (!state.depthTest) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      state.depthTest = true;
    }
  } else if (state.depthTest) {
    gl.disable(gl.DEPTH_TEST);
    state.depthTest = false;
  }

  if (this.backFaceCulling) {
    if (!state.faceCulling) {
      gl.enable(gl.CULL_FACE);
      state.faceCulling = true;
    }
    if (!state.backFaceCulling) {
      gl.cullFace(gl.BACK);
      state.backFaceCulling = true;
    }
  } else if (this.frontFaceCulling) {
    if (!state.faceCulling) {
      gl.enable(gl.CULL_FACE);
      state.faceCulling = true;
    }
    if (!state.frontFaceCulling) {
      gl.cullFace(gl.FRONT);
      state.frontFaceCulling = true;
    }
  } else if (state.faceCulling) {
    gl.disable(gl.CULL_FACE);
    state.faceCulling = false;
  }
};

EZ3.Material.MESH = 'MESH.';
EZ3.Material.SHADER = 'SHADER.';
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

EZ3.Math.isPowerOfTwo = function(x) {
  return (x & (x - 1)) === 0;
};

EZ3.Math.toRadians = function(x) {
  return x * EZ3.Math.PI / 180.0;
};

EZ3.Math.toDegrees = function(x) {
  return x * 180.0 / EZ3.Math.PI;
};

EZ3.Math.nextHighestPowerOfTwo = function(x) {
  --x;
  for (var i = 1; i < 32; i <<= 1) {
    x = x | x >> i;
  }
  return x + 1;
};

/**
 * @class Matrix3
 */

EZ3.Matrix3 = function(value) {
  this.elements = null;

  if (typeof value === 'number') {
    this.elements = [
      value, 0.0, 0.0,
      0.0, value, 0.0,
      0.0, 0.0, value
    ];
  } else if (value instanceof Array && value.length === 9) {
    this.elements = [
      value[0], value[1], value[2],
      value[3], value[4], value[5],
      value[6], value[7], value[8],
    ];
  } else
    this.identity();
};

EZ3.Matrix3.prototype.constructor = EZ3.Matrix3;

EZ3.Matrix3.prototype.add = function(m1, m2) {
  var em1;
  var em2;

  if (m2 instanceof EZ3.Matrix3) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  this.elements[0] = em1[0] + em2[0];
  this.elements[1] = em1[1] + em2[1];
  this.elements[2] = em1[2] + em2[2];
  this.elements[3] = em1[3] + em2[3];
  this.elements[4] = em1[4] + em2[4];
  this.elements[5] = em1[5] + em2[5];
  this.elements[6] = em1[6] + em2[6];
  this.elements[7] = em1[7] + em2[7];
  this.elements[8] = em1[8] + em2[8];

  return this;
};

EZ3.Matrix3.prototype.sub = function(m1, m2) {
  var em1;
  var em2;

  if (m2 instanceof EZ3.Matrix3) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = this.elements;
    em2 = m1.elements;
  }

  this.elements[0] = em1[0] - em2[0];
  this.elements[1] = em1[1] - em2[1];
  this.elements[2] = em1[2] - em2[2];
  this.elements[3] = em1[3] - em2[3];
  this.elements[4] = em1[4] - em2[4];
  this.elements[5] = em1[5] - em2[5];
  this.elements[6] = em1[6] - em2[6];
  this.elements[7] = em1[7] - em2[7];
  this.elements[8] = em1[8] - em2[8];

  return this;
};

EZ3.Matrix3.prototype.scale = function(s, m) {
  var em;

  if(m instanceof EZ3.Matrix3)
   em = m.elements;
  else
   em = this.elements;

  this.elements[0] = em[0] * s;
  this.elements[1] = em[1] * s;
  this.elements[2] = em[2] * s;
  this.elements[3] = em[3] * s;
  this.elements[4] = em[4] * s;
  this.elements[5] = em[5] * s;
  this.elements[6] = em[6] * s;
  this.elements[7] = em[7] * s;
  this.elements[8] = em[8] * s;

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

  if (m2 instanceof EZ3.Matrix3) {
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

  return this;
};

EZ3.Matrix3.prototype.setFromQuaternion = function(q) {
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

  return this;
};

EZ3.Matrix3.prototype.invert = function(m) {
  var e = (m instanceof EZ3.Matrix3) ? m.elements : this.elements;
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

  if (!det) {
    console.warn('EZ3.Matrix3.inverse: determinant is zero.', m);
    return null;
  }

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
  if (m instanceof EZ3.Matrix3) {
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

EZ3.Matrix3.prototype.testDiff = function(m) {
  if(m) {
    if(m instanceof EZ3.Matrix3) {
      return !this.testEqual(m);
    } else
      console.warn('EZ3.Matrix3.testDiff: parameter is not a EZ3.Matrix3.', m);
  } else
    return true;
};

/**
 * @class Matrix4
 */

EZ3.Matrix4 = function(value) {
  this.elements = null;

  if (typeof value === 'number') {
    this.elements = [
      value, 0.0, 0.0, 0.0,
      0.0, value, 0.0, 0.0,
      0.0, 0.0, value, 0.0,
      0.0, 0.0, 0.0, value
    ];
  } else if (value instanceof Array && value.length === 16) {
    this.elements = [
      value[0], value[1], value[2], value[3],
      value[4], value[5], value[6], value[7],
      value[8], value[9], value[10], value[11],
      value[12], value[13], value[14], value[15]
    ];
  } else
    this.identity();
};

EZ3.Matrix4.prototype.constructor = EZ3.Matrix4;

EZ3.Matrix4.prototype.transpose = function(m) {
  var e01;
  var e02;
  var e03;
  var e12;
  var e13;
  var e23;
  var em;

  if (m instanceof EZ3.Matrix4) {
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

  return this;
};

EZ3.Matrix4.prototype.invert = function(m) {
  var a = (m instanceof EZ3.Matrix4) ? m.elements : this.elements;
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

  if (!det) {
    console.warn('EZ3.Matrix4.invert: determinant is zero.', m);
    return null;
  }

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

  return this;
};

EZ3.Matrix4.prototype.mul = function(m2, m1) {
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

  if (m1 instanceof EZ3.Matrix4) {
    em1 = m1.elements;
    em2 = m2.elements;
  } else {
    em1 = m2.elements;
    em2 = this.elements;
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

  return this;
};

EZ3.Matrix4.prototype.translate = function(v, m) {
  var em = (m instanceof EZ3.Matrix4) ? m.elements : this.elements;
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

  return this;
};

EZ3.Matrix4.prototype.scale = function(s, m) {
  var x = s.x;
  var y = s.y;
  var z = s.z;
  var em = (m instanceof EZ3.Matrix4) ? m.elements : this.elements;

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

  return this;
};

EZ3.Matrix4.prototype.setFromQuaternion = function(q) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var wx = q.w * x2;
  var wy = q.w * y2;
  var wz = q.w * z2;

  this.elements[0] = 1.0 - yy - zz;
  this.elements[1] = xy - wz;
  this.elements[2] = xz + wy;
  this.elements[3] = 0.0;
  this.elements[4] = xy + wz;
  this.elements[5] = 1.0 - xx - zz;
  this.elements[6] = yz - wx;
  this.elements[7] = 0.0;
  this.elements[8] = xz - wy;
  this.elements[9] = yz + wx;
  this.elements[10] = 1.0 - xx - yy;
  this.elements[11] = 0.0;
  this.elements[12] = 0.0;
  this.elements[13] = 0.0;
  this.elements[14] = 0.0;
  this.elements[15] = 1.0;

  return this;
};

EZ3.Matrix4.prototype.fromRotationTranslation = function(q, v) {
  var x2 = 2 * q.x;
  var y2 = 2 * q.y;
  var z2 = 2 * q.z;
  var xx = q.x * x2;
  var yy = q.y * y2;
  var zz = q.z * z2;
  var xy = q.x * y2;
  var yz = q.y * z2;
  var xz = q.x * z2;
  var wx = q.w * x2;
  var wy = q.w * y2;
  var wz = q.w * z2;

  this.elements[0] = 1.0 - yy - zz;
  this.elements[1] = xy - wz;
  this.elements[2] = xz + wy;
  this.elements[3] = 0.0;
  this.elements[4] = xy + wz;
  this.elements[5] = 1.0 - xx - zz;
  this.elements[6] = yz - wx;
  this.elements[7] = 0.0;
  this.elements[8] = xz - wy;
  this.elements[9] = yz + wx;
  this.elements[10] = 1.0 - xx - yy;
  this.elements[11] = 0.0;
  this.elements[12] = v.x;
  this.elements[13] = v.y;
  this.elements[14] = v.z;
  this.elements[15] = 1.0;

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

  return this;
};

EZ3.Matrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
  var lr = 1.0 / (left - right);
  var bt = 1.0 / (bottom - top);
  var nf = 1.0 / (near - far);

  this.elements[0] = -2.0 * lr;
  this.elements[1] = 0.0;
  this.elements[2] = 0.0;
  this.elements[3] = 0.0;
  this.elements[4] = 0.0;
  this.elements[5] = -2.0 * bt;
  this.elements[6] = 0.0;
  this.elements[7] = 0.0;
  this.elements[8] = 0.0;
  this.elements[9] = 0.0;
  this.elements[10] = 2.0 * nf;
  this.elements[11] = 0.0;
  this.elements[12] = (left + right) * lr;
  this.elements[13] = (top + bottom) * bt;
  this.elements[14] = (far + near) * nf;
  this.elements[15] = 1.0;

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
  if(m) {
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
    } else {
      console.warn('EZ3.Matrix4.testEqual: parameter is not a EZ3.Matrix4.', m);
      return false;
    }
  } else
    return false;
};

EZ3.Matrix4.prototype.testDiff = function(m) {
  if(m) {
    if(m instanceof EZ3.Matrix4) {
      return !this.testEqual(m);
    } else
      console.warn('EZ3.Matrix4.testDiff: parameter is not a EZ3.Matrix4.', m);
  } else
    return true;
};

/**
 * @class Plane
 */

/**
 * @class Quaternion
 */

EZ3.Quaternion = function(x, y, z, w) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.w = (w !== undefined) ? w : 1.0;
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 instanceof EZ3.Quaternion) {
    this.w = q1.w + q2.w;
    this.x = q1.x + q2.x;
    this.y = q1.y + q2.y;
    this.z = q1.z + q2.z;
  } else {
    this.w += q1.w;
    this.x += q1.x;
    this.y += q1.y;
    this.z += q1.z;
  }
  return this;
};

EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 instanceof EZ3.Quaternion) {
    this.w = q1.w - q2.w;
    this.x = q1.x - q2.x;
    this.y = q1.y - q2.y;
    this.z = q1.z - q2.z;
  } else {
    this.w -= q1.w;
    this.x -= q1.x;
    this.y -= q1.y;
    this.z -= q1.z;
  }
  return this;
};

EZ3.Quaternion.prototype.scale = function(s, q) {
  if(q instanceof EZ3.Quaternion) {
    this.x = q.x * s;
    this.y = q.y * s;
    this.z = q.z * s;
    this.w = q.w * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }
  return this;
};

EZ3.Quaternion.prototype.mul = function(q1, q2) {
  var ax;
  var ay;
  var az;
  var aw;
  var bx;
  var by;
  var bz;
  var bw;

  ax = q1.x;
  ay = q1.y;
  az = q1.z;
  aw = q1.w;

  if (q2 instanceof EZ3.Quaternion) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bw = q2.w;
  } else {
    bx = this.x;
    by = this.y;
    bz = this.z;
    bw = this.w;
  }

  this.x = ax * bw + aw * bx + ay * bz - az * by;
  this.y = ay * bw + aw * by + az * bx - ax * bz;
  this.z = az * bw + aw * bz + ax * by - ay * bx;
  this.w = aw * bw - ax * bx - ay * by - az * bz;

  return this;
};

EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q instanceof EZ3.Quaternion) {
    len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);

    if (len > 0.0) {
      len = 1.0 / len;
      q.scale(len);

      this.x = q.x;
      this.y = q.y;
      this.z = q.z;
      this.w = q.w;
    } else
      console.log('EZ3.Quaterion Error: Quaternion Length is Zero\n\n');

  } else {
    x2 = this.x * this.x;
    y2 = this.y * this.y;
    z2 = this.z * this.z;
    s2 = this.w * this.w;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0.0) {
      len = 1.0 / len;
      this.scale(len);
    } else
      console.log('EZ3.Quaterion Error: Quaternion Length is Zero\n\n');
  }
  return this;
};

EZ3.Quaternion.prototype.invert = function(q) {
  if(q instanceof EZ3.Quaternion) {
    this.x = -q.x;
    this.y = -q.y;
    this.z = -q.z;
    this.w = q.w;
  } else {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = this.w;
  }
  return this;
};

EZ3.Quaternion.prototype.length = function() {
  var x2 = this.x * this.x;
  var y2 = this.y * this.y;
  var z2 = this.z * this.z;
  var s2 = this.w * this.w;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

EZ3.Quaternion.prototype.testDiff = function(q) {
  var dx = (this.x !== q.x);
  var dy = (this.y !== q.y);
  var dz = (this.z !== q.z);
  var dw = (this.w !== q.w);

  return (dx || dy || dz || dw);
};

EZ3.Quaternion.prototype.fromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);

  this.x = sin2 * axis.x;
  this.y = sin2 * axis.y;
  this.z = sin2 * axis.z;
  this.w = Math.cos(0.5 * angle);

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

  if(q instanceof EZ3.Quaternion) {
    yy2 = 2.0 * q.y * q.y;
    xy2 = 2.0 * q.x * q.y;
    xz2 = 2.0 * q.x * q.z;
    yz2 = 2.0 * q.y * q.z;
    zz2 = 2.0 * q.z * q.z;
    wz2 = 2.0 * q.w * q.z;
    wy2 = 2.0 * q.w * q.y;
    wx2 = 2.0 * q.w * q.x;
    xx2 = 2.0 * q.x * q.x;
  } else {
    yy2 = 2.0 * this.y * this.y;
    xy2 = 2.0 * this.x * this.y;
    xz2 = 2.0 * this.x * this.z;
    yz2 = 2.0 * this.y * this.z;
    zz2 = 2.0 * this.z * this.z;
    wz2 = 2.0 * this.w * this.z;
    wy2 = 2.0 * this.w * this.y;
    wx2 = 2.0 * this.w * this.x;
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
  this.x = q.x;
  this.y = q.y;
  this.z = q.z;
  this.w = q.w;
  return this;
};

EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this.w, this.x, this.y, this.z);
};

EZ3.Quaternion.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Quaternion[' + x + ', ' + y + ', ' + z + ', ' + w + ' ]';
};

EZ3.Quaternion.NORMAL = 1.0;
EZ3.Quaternion.INVERSE = -1.0;

/**
 * @class Vector2
 */

EZ3.Vector2 = function(x, y) {
  if(typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
  }
};

EZ3.Vector2.prototype.add = function(v1, v2) {
  if(v2 instanceof EZ3.Vector2) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  } else {
    this.x += v1.x;
    this.y += v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.sub = function(v1, v2) {
  if(v2 instanceof EZ3.Vector2) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
  }
  return this;
};

EZ3.Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
};

EZ3.Vector2.prototype.scale = function(s, v) {
  if(s === Number(s)) {
    if(v instanceof EZ3.Vector2) {
      this.x = v.x * s;
      this.y = v.y * s;
    } else {
      this.x *= s;
      this.y *= s;
    }
  }
  return this;
};

EZ3.Vector2.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector2)
    return v1.x * v2.x + v1.y * v2.y;
  else
    return this.x * v1.x + this.y * v1.y;
};

EZ3.Vector2.prototype.max = function(v1, v2) {
  if (v2 instanceof EZ3.Vector2) {
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
  if (v2 instanceof EZ3.Vector2) {
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
  if (v instanceof EZ3.Vector2)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector2.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector2) {
    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      v.scale(l);
      this.x = v.x;
      this.y = v.y;
    } else
      console.error('EZ3.Vector2.normalize: length is zero.', v);
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.scale(l);
    } else
      console.error('EZ3.Vector2.normalize: length is zero.', this);
  }
  return this;
};

EZ3.Vector2.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector2) {
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
    return (this.x === v.x) && (this.y === v.y);
  else {
    console.error('EZ3.Vector2.testEqual: parameter is not s EZ3.Vector2.', v);
    return false;
  }
};

EZ3.Vector2.prototype.hasZero = function(v) {
  if (v instanceof EZ3.Vector2)
    return (v.x === 0.0) || (v.y === 0.0);
  else
    return (this.x === 0.0) || (this.y === 0.0);
};

EZ3.Vector2.prototype.testZero = function(v) {
  if (v instanceof EZ3.Vector2)
    return ((v.x === 0.0) && (v.y === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0));
};

EZ3.Vector2.prototype.testDiff = function(v) {
  if(v instanceof EZ3.Vector2)
    return !this.testEqual(v);
  else
    console.error('EZ3.Vector2.testDiff: not EZ3.Vector2 given.', v);
};

EZ3.Vector2.prototype.toString = function() {
  return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};

/**
 * @class Vector3
 */

EZ3.Vector3 = function(x, y, z) {
  if (typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
    this.z = (typeof z === 'number') ? z : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
  }
};

EZ3.Vector3.prototype.constructor = EZ3.Vector3;

EZ3.Vector3.prototype.add = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
  } else {
    this.x += v1.x;
    this.y += v1.y;
    this.z += v1.z;
  }
  return this;
};

EZ3.Vector3.prototype.sub = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
    this.z -= v1.z;
  }
  return this;
};

EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
};

EZ3.Vector3.prototype.scale = function(s, v) {
  if (v instanceof EZ3.Vector3) {
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }
  return this;
};

EZ3.Vector3.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector3)
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

EZ3.Vector3.prototype.cross = function(v1, v2) {
  var x;
  var y;
  var z;

  if (v2 instanceof EZ3.Vector3) {
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

EZ3.Vector3.prototype.mulMat3 = function(m, v) {
  var e;
  var x;
  var y;
  var z;

  if (m instanceof EZ3.Matrix3) {
    e = m.elements;

    if (v instanceof EZ3.Vector3) {
      x = v.x;
      y = v.y;
      z = v.z;
    } else {
      x = this.x;
      y = this.y;
      z = this.z;
    }

    this.x = x * e[0] + y * e[3] + z * e[6];
    this.y = x * e[1] + y * e[4] + z * e[7];
    this.z = x * e[2] + y * e[5] + z * e[8];

    return this;
  } else {
    console.warn('EZ3.Vector3.mulMat3: parameter is not a EZ3.Matrix3.', m);
    return null;
  }
};

EZ3.Vector3.prototype.mulQuaternion = function(q) {
  var x = this.x;
  var y = this.y;
  var z = this.z;
  var qx = q.x;
  var qy = q.y;
  var qz = q.z;
  var qw = q.w;
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;

  this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return this;
};

EZ3.Vector3.prototype.length = function(v) {
  if (v instanceof EZ3.Vector3)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector3) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;

      return this;
    } /*else
      console.warn('EZ3.Vector3.normalize: length is zero.', v);*/
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    } else
      console.warn('EZ3.Vector3.normalize: length is zero.', this);
  }
};

EZ3.Vector3.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector3) {
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
  if(v) {
    if (v instanceof EZ3.Vector3)
      return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
    else {
      console.warn('EZ3.Vector3.testEqual: parameter is not s EZ3.Vector3.', v);
      return false;
    }
  } else
    return false;
};

EZ3.Vector3.prototype.hasZero = function(v) {
  if (v instanceof EZ3.Vector3)
    return (v.x === 0.0) || (v.y === 0.0) || (v.z === 0.0);
  else
    return (this.x === 0.0) || (this.y === 0.0) || (this.z === 0.0);
};

EZ3.Vector3.prototype.testZero = function(v) {
  if (v instanceof EZ3.Vector3)
    return (v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0);
  else
    return (this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0);
};

EZ3.Vector3.prototype.testDiff = function(v) {
  if(v) {
    if (v instanceof EZ3.Vector3)
      return !this.testEqual(v);
    else {
      console.warn('EZ3.Vector3.testDiff: parameter is not a EZ3.Vector3.', v);
      return true;
    }
  } else
    return true;
};

EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);

  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

EZ3.Vector3.prototype.toVec2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

EZ3.Vector3.prototype.setPositionFromMatrix = function(m) {
  if (m instanceof EZ3.Matrix4) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];
  }
  return this;
};

/**
 * @class Vec4
 */

EZ3.Vector4 = function(x, y, z, w) {
  if (typeof x === 'number') {
    this.x = x;
    this.y = (typeof y === 'number') ? y : x;
    this.z = (typeof z === 'number') ? z : x;
    this.w = (typeof w === 'number') ? w : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
  }
};

EZ3.Vector4.prototype.constructor = EZ3.Vector4;

EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

EZ3.Vector4.prototype.add = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
    this.w = v1.w + v2.w;
  } else {
    this.x += v1.x;
    this.y += v1.y;
    this.z += v1.z;
    this.w += v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.sub = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
    this.w = v1.w - v2.w;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
    this.z -= v1.z;
    this.w -= v1.w;
  }
  return this;
};

EZ3.Vector4.prototype.scale = function(s, v) {
  if (v instanceof EZ3.Vector4) {
    this.x = v.x * s;
    this.y = v.y * s;
    this.z = v.z * s;
    this.w = v.w * s;
  } else {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;
  }
  return this;
};

EZ3.Vector4.prototype.dot = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
    if(v1 instanceof EZ3.Vector4)
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    else
      console.error('EZ3.Vector4.dot: not EZ3.Vector4 given.', v1);
  } else {
    if(v1 instanceof EZ3.Vector4)
      return this.x * v1.x + this.y * v1.y + this.z * v1.z + this.w * v1.w;
    else
      console.error('EZ3.Vector4.dot: not EZ3.Vector4 given.', v1);
  }
};

EZ3.Vector4.prototype.max = function(v1, v2) {
  if (v2 instanceof EZ3.Vector4) {
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
  if (v2 instanceof EZ3.Vector4) {
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

EZ3.Vector4.prototype.mulMat4 = function(m, v) {
  var x;
  var y;
  var z;
  var w;
  var e;

  if(m instanceof EZ3.Matrix4) {
    e = m.elements;

    if (v instanceof EZ3.Vector4) {
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
  } else {
    console.error('EZ3.Vector4.mulMat4: first parameter is not a EZ3.Matrix4.', m);
    return null;
  }
};

EZ3.Vector4.prototype.length = function(v) {
  if (v instanceof EZ3.Vector4)
    return Math.sqrt(v.dot(v));
  else
    return Math.sqrt(this.dot(this));
};

EZ3.Vector4.prototype.normalize = function(v) {
  var l;

  if (v instanceof EZ3.Vector4) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;

      return this;
    } else
      console.warn('EZ3.Vector4.normalize: vector length is zero.', v);
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    } else
      console.warn('EZ3.Vector4.normalize: vector length is zero.', this);
  }
};

EZ3.Vector4.prototype.invert = function(v) {
  if (v instanceof EZ3.Vector4) {
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

  if (v instanceof EZ3.Vector4) {
    x = this.x === v.x;
    y = this.y === v.y;
    z = this.z === v.z;
    w = this.w === v.w;

    return x && y && z && w;
  } else{
    console.warn('EZ3.Vector4.testEqual: parameter is not s EZ3.Vector4.', v);
    return false;
  }
};

EZ3.Vector4.prototype.hasZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v instanceof EZ3.Vector4) {
    ex = v.x === 0.0;
    ey = v.y === 0.0;
    ez = v.z === 0.0;
    ew = v.w === 0.0;
  } else {
    ex = this.x === 0.0;
    ey = this.y === 0.0;
    ez = this.z === 0.0;
    ew = this.w === 0.0;
  }

  return ex || ey || ez || ew;
};

EZ3.Vector4.prototype.testZero = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v instanceof EZ3.Vector4) {
    ex = v.x === 0.0;
    ey = v.y === 0.0;
    ez = v.z === 0.0;
    ew = v.w === 0.0;
  } else {
    ex = this.x === 0.0;
    ey = this.y === 0.0;
    ez = this.z === 0.0;
    ew = this.w === 0.0;
  }

  return ex && ey && ez && ew;
};

EZ3.Vector4.prototype.testDiff = function(v) {
  if(v) {
    if(v instanceof EZ3.Vector4)
      return !this.testEqual(v);
    else {
      console.warn('EZ3.Vector4.testDiff: parameter is not a EZ3.Vector4.', v);
      return false;
    }
  } else
    return true;
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

EZ3.ArrayBuffer.prototype.bind = function(gl, attributes, state, extension, index) {
  var buffer;
  var k;

  if (extension.vertexArrayObject) {
    if (!this._id)
      this._id = extension.vertexArrayObject.createVertexArrayOES();

    extension.vertexArrayObject.bindVertexArrayOES(this._id);

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
      index.update(gl, extension);
      index.dirty = false;
    }
  }
};

EZ3.ArrayBuffer.prototype.add = function(name, buffer) {
  if (buffer instanceof EZ3.IndexBuffer) {
    this._index[name] = buffer;
    return buffer;
  }

  if (buffer instanceof EZ3.VertexBuffer) {
    this._vertex[name] = buffer;
    return buffer;
  }
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
  this._cache = {};
  this._ranges = [];

  this.data = data || [];
  this.dynamic = dynamic || false;
  this.dirty = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

EZ3.Buffer.prototype.bind = function(gl, target) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(target, this._id);
};

EZ3.Buffer.prototype.update = function(gl, target, bytes) {
  var length = bytes * this.data.length;
  var ArrayType;
  var offset;
  var data;
  var k;

  if (target === gl.ARRAY_BUFFER) {
    ArrayType = Float32Array;
  } else {
    if (bytes === 4)
      ArrayType = Uint32Array;
    else
      ArrayType = Uint16Array;
  }

  if ((this._cache.length !== length) || (this._cache.dynamic !== this.dynamic)) {
    this._cache.length = length;
    this._cache.dynamic =  this.dynamic;

    gl.bufferData(target, new ArrayType(this.data), (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  } else {
    if (this._ranges.length) {
      for (k = 0; k < this._ranges.length; k++) {
        offset = bytes * this._ranges[k].left;
        data = this.data.slice(this._ranges[k].left, this._ranges[k].right);
        gl.bufferSubData(target, offset, new ArrayType(data));
      }

      this._ranges = [];
    } else
      gl.bufferSubData(target, 0, new ArrayType(this.data));
  }
};

EZ3.Buffer.prototype.addRange = function(range) {
  if (range instanceof EZ3.VertexBufferAttribute)
    this._ranges.push(range);
};

/**
 * @class BufferRange
 */

EZ3.BufferRange = function(left, right) {
  this.left = left;
  this.right = right;
};

/**
 * @class Extension
 */

EZ3.Extension = function(gl) {
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
  this.depthTextures = gl.getExtension('WEBGL_depth_texture');
  this.shaderLOD = gl.getExtension('EXT_shader_texture_lod');
};

/**
 * @class GLSLProgram
 */

EZ3.GLSLProgram = function(gl, vertex, fragment, prefix) {
  this._id = null;
  this._cache = {};
  this._shaders = [];

  this.uniforms = {};
  this.attributes = {};

  this._create(gl, vertex, fragment, prefix);
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var shader = gl.createShader(type);
  var warning;

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    warning = 'EZ3.GLSLProgram shader info log: ';
    warning += gl.getShaderInfoLog(shader);
    warning += '\n';

    console.warn(warning);
  } else {
    if (type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX] = shader;
    else if (type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, vertex, fragment, prefix) {
  var warning;

  prefix = (prefix) ? prefix : '';

  this._compile(gl, gl.VERTEX_SHADER, prefix + vertex);
  this._compile(gl, gl.FRAGMENT_SHADER, prefix + fragment);

  this._id = gl.createProgram();

  gl.attachShader(this._id, this._shaders[EZ3.GLSLProgram.VERTEX]);
  gl.attachShader(this._id, this._shaders[EZ3.GLSLProgram.FRAGMENT]);

  gl.linkProgram(this._id);

  if (!gl.getProgramParameter(this._id, gl.LINK_STATUS)) {
    warning = 'EZ3.GLSLProgram linking program error info log: ';
    warning += gl.getProgramInfoLog(this._id, gl.LINK_STATUS);
    warning += '\n';

    console.warn(warning);
  } else {
    this._loadUniforms(gl);
    this._loadAttributes(gl);

    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var uniforms = gl.getProgramParameter(this._id, gl.ACTIVE_UNIFORMS);
  var name;
  var k;

  for (k = 0; k < uniforms; k++) {
    name = gl.getActiveUniform(this._id, k).name;
    this.uniforms[name] = gl.getUniformLocation(this._id, name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var attributes = gl.getProgramParameter(this._id, gl.ACTIVE_ATTRIBUTES);
  var name;
  var k;

  for (k = 0; k < attributes; k++) {
    name = gl.getActiveAttrib(this._id, k).name;
    this.attributes[name] = gl.getAttribLocation(this._id, name);
  }
};

EZ3.GLSLProgram.prototype.bind = function(gl) {
  gl.useProgram(this._id);
};

EZ3.GLSLProgram.prototype.loadUniformInteger = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (typeof data === 'number' && this._cache[name] !== data) {
      gl.uniform1i(location, data);
      this._cache[name] = data;
    } else if (data instanceof EZ3.Vector2 && !data.testEqual(this._cache[name])) {
      gl.uniform2iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && !data.testEqual(this._cache[name])) {
      gl.uniform3iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && !data.testEqual(this._cache[name])) {
      gl.uniform4iv(location, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformFloat = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (typeof data === 'number' && this._cache[name] !== data) {
      gl.uniform1f(location, data);
      this._cache[name] = data;
    } else if (data instanceof EZ3.Vector2 && !data.testEqual(this._cache[name])) {
      gl.uniform2fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && !data.testEqual(this._cache[name])) {
      gl.uniform3fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && !data.testEqual(this._cache[name])) {
      gl.uniform4fv(location, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (data instanceof EZ3.Matrix3 && !data.testEqual(this._cache[name])) {
      gl.uniformMatrix3fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Matrix4 && !data.testEqual(this._cache[name])) {
      gl.uniformMatrix4fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.VERTEX = 0;
EZ3.GLSLProgram.FRAGMENT = 1;

/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.context = null;
  this.extension = null;
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

  modelView.mul(camera.view, mesh.world);

  program.loadUniformFloat(gl, 'uEyePosition', camera.position);
  program.loadUniformMatrix(gl, 'uModel', mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', camera.projection);

  if (!lights.empty)
    program.loadUniformMatrix(gl, 'uNormal', mesh.normal);

  for (i = 0; i < lights.point.length; i++)
    lights.point[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.directional.length; i++)
    lights.directional[i].updateUniforms(gl, program, i);

  for (i = 0; i < lights.spot.length; i++)
    lights.spot[i].updateUniforms(gl, program, i);

  mesh.render(gl, program.attributes, this.state, this.extension);
};

EZ3.Renderer.prototype._renderDepth = function(lights, shadowCasters) {
  var gl = this.context;
  var position = new EZ3.Vector2();
  var modelViewProjection = new EZ3.Matrix4();
  var framebuffer;
  var program;
  var fragment;
  var vertex;
  var light;
  var mesh;
  var i;
  var j;

  if (!this.state.programs.depth) {
    vertex = EZ3.ShaderLibrary.depth.vertex;
    fragment = EZ3.ShaderLibrary.depth.fragment;
    this.state.programs.depth = new EZ3.GLSLProgram(gl, vertex, fragment);
  }

  program = this.state.programs.depth;

  program.bind(gl);

  for (i = 0; i < lights.length; i++) {
    light = lights[i];
    framebuffer = light.depthFramebuffer;

    framebuffer.bind(gl);

    if (framebuffer.dirty) {
      framebuffer.update(gl);
      framebuffer.dirty = false;
    }

    gl.clear(gl.DEPTH_BUFFER_BIT);
    this.viewport(position, framebuffer.resolution);

    for (j = 0; j < shadowCasters.length; j++) {
      mesh = shadowCasters[j];

      modelViewProjection.mul(light.projection, new EZ3.Matrix4().mul(light.view, mesh.world));
      mesh.updateShadow(modelViewProjection);

      program.loadUniformMatrix(gl, 'uModelViewProjection', modelViewProjection);

      mesh.render(gl, program.attributes, this.state, this.extension);
    }
  }
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
      this.state = new EZ3.State();
      this.extension = new EZ3.Extension(this.context);
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
    transparent: [],
    shadowCasters: []
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

    mesh.material.updateProgram(gl, this.state, lights);

    if (mesh.material.transparent)
      meshes.transparent.push(mesh);
    else
      meshes.opaque.push(mesh);

    if (mesh.material.shadowCaster)
      meshes.shadowCasters.push(mesh);
  }

  if (meshes.shadowCasters.length) {
    this._renderDepth(lights.directional, meshes.shadowCasters);
    this._renderDepth(lights.spot, meshes.shadowCasters);

    gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i], camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i], camera, lights);
};

/**
* @class ShaderLibrary
*/

EZ3.ShaderLibrary = function() {
  this.mesh = {};
  this.depth = {};
};

EZ3.ShaderLibrary = new EZ3.ShaderLibrary();

EZ3.ShaderLibrary['depth'].vertex = "precision highp float;\r\n\r\nattribute vec3 position;\r\n\r\nuniform mat4 uModelViewProjection;\r\n\r\nvoid main() {\r\n  gl_Position = uModelViewProjection * vec4(position, 1.0);\r\n}\r\n";
EZ3.ShaderLibrary['mesh'].vertex = "precision highp float;\r\n\r\nattribute vec3 position;\r\nattribute vec3 normal;\r\nattribute vec2 uv;\r\n\r\nuniform mat4 uModel;\r\nuniform mat3 uNormal;\r\nuniform mat4 uModelView;\r\nuniform mat4 uProjection;\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vPosition = vec3(uModel * vec4(position, 1.0));\r\n  vNormal = normalize(uNormal * normal);\r\n  vUv = uv;\r\n\r\n  gl_PointSize = 3.0;\r\n  gl_Position = uProjection * uModelView * vec4(position, 1.0);\r\n}\r\n";
EZ3.ShaderLibrary['depth'].fragment = "precision highp float;\r\n\r\nvoid main() {\r\n  // Nothing to do\r\n}\r\n";
EZ3.ShaderLibrary['mesh'].fragment = "precision highp float;\r\n\r\n#extension GL_OES_standard_derivatives : enable\r\n\r\nstruct PointLight\r\n{\r\n\tvec3 position;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nstruct DirectionalLight\r\n{\r\n\tvec3 direction;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nstruct SpotLight\r\n{\r\n\tvec3 position;\r\n\tvec3 direction;\r\n\tfloat cutoff;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n};\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nuniform vec3 uEmissive;\r\nuniform vec3 uDiffuse;\r\nuniform vec3 uSpecular;\r\nuniform float uShininess;\r\nuniform vec3 uEyePosition;\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n  uniform PointLight uPointLights[MAX_POINT_LIGHTS];\r\n#endif\r\n\r\n#if MAX_DIRECTIONAL_LIGHTS > 0\r\n  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];\r\n#endif\r\n\r\n#ifdef EMISSIVE_MAP\r\n\tuniform sampler2D uEmissiveSampler;\r\n#endif\r\n\r\n#ifdef DIFFUSE_MAP\r\n\tuniform sampler2D uDiffuseSampler;\r\n#endif\r\n\r\n#ifdef SPECULAR_MAP\r\n\tuniform sampler2D uSpecularSampler;\r\n#endif\r\n\r\n#ifdef ENVIRONMENT_MAP\r\n\tuniform samplerCube uEnvironmentSampler;\r\n#endif\r\n\r\n#ifdef REFRACTION\r\n\tuniform float uRefractFactor;\r\n#endif\r\n\r\n#if defined(COOK_TORRANCE) && defined(OREN_NAYAR)\r\n\tuniform float uAlbedo;\r\n\tuniform float uFresnel;\r\n\tuniform float uRoughness;\r\n#elif defined(COOK_TORRANCE)\r\n\tuniform float uFresnel;\r\n\tuniform float uRoughness;\r\n#elif defined(OREN_NAYAR)\r\n\tuniform float uAlbedo;\r\n\tuniform float uRoughness;\r\n#endif\r\n\r\n#ifdef LAMBERT\r\nfloat lambert(vec3 s, vec3 n)\r\n{\r\n\treturn max(dot(s, n), 0.0);\r\n}\r\n#endif\r\n\r\n#ifdef OREN_NAYAR\r\nfloat orenNayar(vec3 v, vec3 s, vec3 n)\r\n{\r\n\tfloat PI = acos(-1.0);\r\n\r\n\tfloat SdotV = dot(s, v);\r\n\tfloat SdotN = dot(s, n);\r\n\tfloat NdotV = dot(n, v);\r\n\r\n\tfloat S = SdotV - SdotN * NdotV;\r\n\tfloat T = mix(1.0, max(SdotN, NdotV), step(0.0, S));\r\n\tfloat sigma2 = uRoughness * uRoughness;\r\n\r\n\tfloat A = 1.0 + sigma2 * (uAlbedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\r\n\tfloat B = 0.45 * sigma2 / (sigma2 + 0.09);\r\n\r\n\treturn uAlbedo * max(0.0, SdotN) * (A + B * S / T) / PI;\r\n}\r\n#endif\r\n\r\n#ifdef PHONG\r\nfloat phong(vec3 v, vec3 s, vec3 n)\r\n{\r\n\tvec3 r = reflect(-s, n);\r\n\treturn pow(max(dot(r, v), 0.0), uShininess);\r\n}\r\n#endif\r\n\r\n#ifdef BLINN_PHONG\r\nfloat blinnPhong(vec3 v, vec3 s, vec3 n)\r\n{\r\n\tvec3 h = normalize(s + v);\r\n\treturn pow(max(dot(h, n), 0.0), uShininess);\r\n}\r\n#endif\r\n\r\n#ifdef COOK_TORRANCE\r\nfloat beckmannDistribution(float NdotH, float roughness)\r\n{\r\n\tfloat PI = acos(-1.0);\r\n\tfloat cos2Beta = NdotH * NdotH;\r\n\tfloat tan2Beta = (cos2Beta - 1.0) / cos2Beta;\r\n\tfloat div =  PI * roughness * roughness * cos2Beta * cos2Beta;\r\n\treturn exp(tan2Beta / (roughness * roughness)) / div;\r\n}\r\n\r\nfloat cookTorrance(vec3 v, vec3 s, vec3 n)\r\n{\r\n\tvec3 h = normalize(s + v);\r\n\r\n\tfloat VdotN = max(dot(v, n), 0.0);\r\n\tfloat SdotN = max(dot(s, n), 0.0);\r\n\tfloat VdotH = max(dot(v, h), 0.0);\r\n\tfloat SdotH = max(dot(s, h), 0.0);\r\n\tfloat NdotH = max(dot(n, h), 0.0);\r\n\r\n\tfloat G1 = (2.0 * NdotH * VdotN) / VdotH;\r\n\tfloat G2 = (2.0 * NdotH * SdotN) / SdotH;\r\n\tfloat G = min(1.0, min(G1, G2));\r\n\r\n\tfloat D = beckmannDistribution(NdotH, uRoughness);\r\n\tfloat F = pow(1.0 - VdotN, uFresnel);\r\n\tfloat PI = acos(-1.0);\r\n\r\n  return  G * F * D / max(PI * VdotN, 0.0);\r\n}\r\n#endif\r\n\r\n#ifdef NORMAL_MAP\r\nuniform sampler2D uNormalSampler;\r\n\r\nvec3 pertubNormal(vec3 v)\r\n{\r\n\tvec3 q0 = dFdx(v);\r\n\tvec3 q1 = dFdy(v);\r\n\r\n\tvec2 st0 = dFdx(vUv);\r\n\tvec2 st1 = dFdy(vUv);\r\n\r\n\tvec3 s = normalize(q0 * st1.t - q1 * st0.t);\r\n\tvec3 t = normalize(-q0 * st1.s + q1 * st0.s);\r\n\tvec3 n = normalize(vNormal);\r\n\r\n\tvec3 d = texture2D(uNormalSampler, vUv).xyz * 2.0 - 1.0;\r\n\r\n\treturn normalize(mat3(s, t, n) * d);\r\n}\r\n#endif\r\n\r\n#ifdef VARIANCE_SHADOW_MAPPING\r\nvec2 fixMomments()\r\n{\r\n\tvec2 result;\r\n\treturn result;\r\n}\r\n\r\nfloat varianceShadowMapping()\r\n{\r\n\treturn 1.0;\r\n}\r\n#endif\r\n\r\nvoid main() {\r\n\tvec3 color;\r\n\tfloat shadowFactor = 1.0;\r\n\tvec3 emissive = uEmissive;\r\n\tvec3 diffuse = vec3(0.0, 0.0, 0.0);\r\n\tvec3 specular = vec3(0.0, 0.0, 0.0);\r\n\r\n\tvec3 v = normalize(uEyePosition - vPosition);\r\n\r\n#ifdef NORMAL_MAP\r\n\tvec3 n = pertubNormal(-v);\r\n#else\r\n\tvec3 n = vNormal;\r\n#endif\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n  for(int i = 0; i < MAX_POINT_LIGHTS; i++)\r\n  {\r\n\t\tvec3 s = normalize(uPointLights[i].position - vPosition);\r\n\r\n\t\t#ifdef LAMBERT\r\n\t\t\tfloat q = lambert(s, n);\r\n\t\t#endif\r\n\r\n\t\t#ifdef OREN_NAYAR\r\n\t\t\tfloat q = orenNayar(v, s, n);\r\n\t\t#endif\r\n\r\n\t\tif (q > 0.0) {\r\n\t\t\t#ifdef BLINN_PHONG\r\n\t\t\t\tfloat w = blinnPhong(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\t#ifdef COOK_TORRANCE\r\n\t\t\t\tfloat w = cookTorrance(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\t#ifdef PHONG\r\n\t\t\t\tfloat w = phong(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\tdiffuse += uPointLights[i].diffuse * uDiffuse * q;\r\n\t\t\tspecular += uPointLights[i].specular * uSpecular * w;\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#if MAX_DIRECTIONAL_LIGHTS > 0\r\n  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++)\r\n  {\r\n\t\tvec3 s = uDirectionalLights[i].direction;\r\n\r\n\t\t#ifdef LAMBERT\r\n\t\t\tfloat q = lambert(s, n);\r\n\t\t#endif\r\n\r\n\t\t#ifdef OREN_NAYAR\r\n\t\t\tfloat q = orenNayar(v, s, n);\r\n\t\t#endif\r\n\r\n\t\tif (q > 0.0) {\r\n\t\t\t#ifdef BLINN_PHONG\r\n\t\t\t\tfloat w = blinnPhong(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\t#ifdef COOK_TORRANCE\r\n\t\t\t\tfloat w = cookTorrance(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\t#ifdef PHONG\r\n\t\t\t\tfloat w = phong(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\tdiffuse += uDirectionalLights[i].diffuse * uDiffuse * q;\r\n\t\t\tspecular += uDirectionalLights[i].specular * uSpecular * w;\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n  for(int i = 0; i < MAX_SPOT_LIGHTS; i++)\r\n  {\r\n\t\tvec3 s = normalize(uSpotLights[i].position - vPosition);\r\n\t\tfloat angle = max(dot(s, uSpotLights[i].direction), 0.0);\r\n\r\n\t\tif(angle > uSpotLights[i].cutoff) {\r\n\r\n\t\t\t#ifdef LAMBERT\r\n\t\t\t\tfloat q = lambert(s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\t#ifdef OREN_NAYAR\r\n\t\t\t\tfloat q = orenNayar(v, s, n);\r\n\t\t\t#endif\r\n\r\n\t\t\tif (q > 0.0) {\r\n\t\t\t\t#ifdef BLINN_PHONG\r\n\t\t\t\t\tfloat w = blinnPhong(v, s, n);\r\n\t\t\t\t#endif\r\n\r\n\t\t\t\t#ifdef COOK_TORRANCE\r\n\t\t\t\t\tfloat w = cookTorrance(v, s, n);\r\n\t\t\t\t#endif\r\n\r\n\t\t\t\t#ifdef PHONG\r\n\t\t\t\t\tfloat w = phong(v, s, n);\r\n\t\t\t\t#endif\r\n\r\n\t\t\t\tdiffuse += uSpotLights[i].diffuse * uDiffuse * q;\r\n\t\t\t\tspecular += uSpotLights[i].specular * uSpecular * w;\r\n\t\t\t}\r\n\t\t}\r\n  }\r\n#endif\r\n\r\n#ifdef EMISSIVE_MAP\r\n  emissive *= texture2D(uEmissiveSampler, vUv).rgb;\r\n#endif\r\n\r\n#ifdef DIFFUSE_MAP\r\n\tdiffuse *= texture2D(uDiffuseSampler, vUv).rgb;\r\n#endif\r\n\r\n#ifdef SPECULAR_MAP\r\n\tspecular *= texture2D(uSpecularSampler, vUv).rgb;\r\n#endif\r\n\r\n#ifdef REFLECTION\r\n\tvec3 reflection = reflect(-v, n);\r\n\tdiffuse *= textureCube(uEnvironmentSampler, reflection, 0.0).rgb;\r\n#endif\r\n\r\n#ifdef REFRACTION\r\n\tvec3 refraction = refract(-v, n, uRefractFactor);\r\n\tdiffuse *= textureCube(uEnvironmentSampler, refraction, 0.0).rgb;\r\n#endif\r\n\r\n#ifdef VARIANCE_SHADOW_MAPPING\r\n\tcolor = (emissive + diffuse + specular) * varianceShadowMapping();\r\n#else\r\n\tcolor = emissive + diffuse + specular;\r\n#endif\r\n\r\n  gl_FragColor = vec4(color, 1.0);\r\n}\r\n";
/**
 * @class State
 */

EZ3.State = function() {
  this.programs = {};
  this.texture = {};
  this.attribute = {};
  this.currentTextureSlot = null;

  this.depthTest = false;
  this.faceCulling = false;
  this.backFaceCulling = false;
  this.frontFaceCulling = false;
};

EZ3.State.prototype.constructor = EZ3.State;

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

EZ3.Texture = function(generateMipmaps) {
  this._id = null;
  this._cache = {};

  this.generateMipmaps = (generateMipmaps) ? true : false;
  this.wrapS = EZ3.Texture.REPEAT;
  this.wrapT = EZ3.Texture.REPEAT;
  this.magFilter = EZ3.Texture.LINEAR;
  this.minFilter = EZ3.Texture.LINEAR_MIPMAP_LINEAR;
  this.flipY = false;
  this.dirty = true;
};

EZ3.Texture.prototype._updateImage = function(gl, target, image) {
  var format = gl[image.format];
  var internalFormat;
  var type;

  if(format === gl.DEPTH_COMPONENT) {
    internalFormat = gl.DEPTH_COMPONENT16;
    type = gl.UNSIGNED_SHORT;
  } else {
    internalFormat = format;
    type = gl.UNSIGNED_BYTE;
  }

  if (!EZ3.Math.isPowerOfTwo(image.width) || !EZ3.Math.isPowerOfTwo(image.height))
    image.toPowerOfTwo();

  gl.texImage2D(target, 0, format, image.width, image.height, 0, format, type, image.data);
};

EZ3.Texture.prototype._updateMipmaps = function(gl) {
  if (!this.generateMipmaps) {
    this.magFilter = EZ3.Texture.LINEAR;
    this.minFilter = EZ3.Texture.LINEAR;
  } else
    gl.generateMipmap(gl.TEXTURE_2D);
};

EZ3.Texture.prototype._updatePixelStore = function(gl) {
  if (this._cache.flipY !== this.flipY) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    this._cache.flipY = this.flipY;
  }
};

EZ3.Texture.prototype._updateParameters = function(gl, target) {
  if (this._cache.wrapS !== this.wrapS) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[this.wrapS]);
    this._cache.wrapS = this.wrapS;
  }

  if (this._cache.wrapT !== this.wrapT) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[this.wrapT]);
    this._cache.wrapT = this.wrapT;
  }

  if (this._cache.magFilter !== this.magFilter) {
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl[this.magFilter]);
    this._cache.magFilter = this.magFilter;
  }

  if (this._cache.minFilter !== this.minFilter) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl[this.minFilter]);
    this._cache.minFilter = this.minFilter;
  }
};

EZ3.Texture.prototype.bind = function(gl, target, state, unit) {
  var slot;

  if (!this._id)
    this._id = gl.createTexture();

  if(state) {
    slot = gl.TEXTURE0 + unit;

    if (state.currentTextureSlot !== slot) {
      gl.activeTexture(slot);
      state.currentTextureSlot = slot;
    }

    if (!state.texture[slot]) {
      state.texture[slot] = {
        id: this._id,
        target: target
      };
      gl.bindTexture(state.texture[slot].target, state.texture[slot].id);
    } else {
      if (state.texture[slot].id !== this._id || state.texture[slot].target !== target) {
        state.texture[slot].id = this._id;
        state.texture[slot].target = target;
        gl.bindTexture(state.texture[slot].target, state.texture[slot].id);
      }
    }
  } else
      gl.bindTexture(target, this._id);
};

EZ3.Texture.LINEAR = 'LINEAR';
EZ3.Texture.NEAREST = 'NEAREST';
EZ3.Texture.LINEAR_MIPMAP_LINEAR = 'LINEAR_MIPMAP_LINEAR';
EZ3.Texture.NEAREST_MIPMAP_NEAREST = 'NEAREST_MIPMAP_NEAREST';
EZ3.Texture.NEAREST_MIPMAP_LINEAR = 'NEAREST_MIPMAP_LINEAR';
EZ3.Texture.LINEAR_MIPMAP_NEAREST = 'LINEAR_MIPMAP_NEAREST';
EZ3.Texture.CLAMP_TO_EDGE = 'CLAMP_TO_EDGE';
EZ3.Texture.REPEAT = 'REPEAT';
EZ3.Texture.MIRRORED_REPEAT = 'MIRRORED_REPEAT';

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

  this.up = new EZ3.Vector4(0.0, 1.0, 0.0, 0.0).mulMat4(matrix).toVec3();
  this.look = new EZ3.Vector4(0.0, 0.0, 1.0, 0.0).mulMat4(matrix).toVec3();
  this.right = new EZ3.Vector4(1.0, 0.0, 0.0, 0.0).mulMat4(matrix).toVec3();

  this.target = new EZ3.Vector3().add(this.position, this.look);
};

EZ3.FreeCamera.prototype.lift = function(speed) {
  var lift = this.up.clone().scale(speed);
  this.position.add(lift);
};

EZ3.FreeCamera.prototype.walk = function(speed) {
  var walk = this.look.clone().scale(speed);
  this.position.add(walk);
};

EZ3.FreeCamera.prototype.strafe = function(speed) {
  var strafe = this.right.clone().scale(speed);
  this.position.add(strafe);
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
  var vector = new EZ3.Vector4(0, 0, -1, 0).mulMat4(matrix).toVec3();

  this.distance = new EZ3.Vector3().sub(this.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scale(this.distance);

  this.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMat4(matrix).toVec3();
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

  right = new EZ3.Vector3().copy(this.right).scale(rx);
  up = new EZ3.Vector3().copy(this.up).scale(ry);
  vector = new EZ3.Vector3().add(right, up);

  this.position.add(vector);
  this.target.add(vector);
};

EZ3.TargetCamera.prototype.zoom = function(speed) {
  var look = this.look.clone().scale(speed);
  this.position.add(look);
};

/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.updateNormalMatrix = false;
  this.normal = new EZ3.Matrix3();
  this.shadow = new EZ3.Matrix4();

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
  if(this.updateNormalMatrix) {
    this.normal.normalFromMat4(this.world);
    this.updateNormalMatrix = false;
  }
};

EZ3.Mesh.prototype.updateShadow = function(modelViewProjection) {
  var bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));

  this.shadow.mul(bias, modelViewProjection);
};

EZ3.Mesh.prototype.render = function(gl, attributes, state, extension) {
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
    this.geometry.buffers.bind(gl, attributes, state, extension, buffer);
    gl.drawElements(mode, buffer.data.length, buffer.getType(gl, extension), 0);
  } else if (buffer instanceof EZ3.VertexBuffer) {
    this.geometry.buffers.bind(gl, attributes, state, extension);
    gl.drawArrays(mode, 0, buffer.data.length / 3);
  }
};

/**
 * @class CubeDepthFramebuffer
 * @extends Framebuffer
 */

EZ3.CubeDepthFramebuffer = function(resolution) {
  EZ3.Framebuffer.call(this, resolution, new EZ3.TargetCubemap(resolution, 'DEPTH_COMPONENT'));
};

EZ3.CubeDepthFramebuffer.prototype.constructor = EZ3.CubeDepthFramebuffer;

EZ3.CubeDepthFramebuffer.prototype.update = function(gl) {
  EZ3.Framebuffer.prototype.update.call(gl, 'DEPTH_ATTACHMENT');
};

/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

 EZ3.DepthFramebuffer = function(resolution) {
   EZ3.Framebuffer.call(this, resolution, new EZ3.TargetTexture2D(resolution, 'DEPTH_COMPONENT'));
 };

 EZ3.DepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
 EZ3.DepthFramebuffer.prototype.constructor = EZ3.DepthFramebuffer;

 EZ3.DepthFramebuffer.prototype.update = function(gl) {
   EZ3.Framebuffer.prototype.update.call(this, gl, 'DEPTH_ATTACHMENT');
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

  this._camera = null;
  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target);

  if(!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);
};

Object.defineProperty(EZ3.DirectionalLight.prototype, 'view', {
  get: function() {
    if (!this._camera) {
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));
    } else {
      this._camera.target = this.target.clone();
      this._camera.position = this.position.clone();
    }
    return this._camera.view;
  }
});

Object.defineProperty(EZ3.DirectionalLight.prototype, 'projection', {
  get: function() {
    if(!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));

    return this._camera.projection;
  }
});

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

  program.loadUniformFloat(gl, prefix + 'position', this.position);
};

/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);

  this.cutoff = 0.8;
  this._camera = null;
  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target);

  if(!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
  program.loadUniformFloat(gl, prefix + 'direction', direction);
  program.loadUniformFloat(gl, prefix + 'cutoff', this.cutoff);
};

Object.defineProperty(EZ3.SpotLight.prototype, 'view', {
  get: function() {
    if (!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));
    else {
      this._camera.target = this.target.clone();
      this._camera.position = this.position.clone();
    }
    return this._camera.view;
  }
});

Object.defineProperty(EZ3.SpotLight.prototype, 'projection', {
  get: function() {
    if(!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));

    return this._camera.projection;
  }
});

/**
 * @class Image
 * @extends File
 */

EZ3.Image = function(width, height, format, data) {
  EZ3.File.call(this, data);

  this.width = width || 0;
  this.height = height || 0;
  this.format = format || EZ3.Image.RGBA;
};

EZ3.Image.prototype = Object.create(EZ3.File.prototype);
EZ3.Image.prototype.constructor = EZ3.Image;

EZ3.Image.prototype.getCanvas = function() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var image = context.createImageData(this.width, this.height);

  canvas.width = this.width;
  canvas.height = this.height;

  image.data.set(new Uint8ClampedArray(this.data));

  context.putImageData(image, 0, 0);

  return canvas;
};

EZ3.Image.prototype.toPowerOfTwo = function() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = EZ3.Math.nextHighestPowerOfTwo(this.width);
  canvas.height = EZ3.Math.nextHighestPowerOfTwo(this.height);
  context.drawImage(this.getCanvas(), 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

  this.width = canvas.width;
  this.height = canvas.height;
  this.data = new Uint8Array(context.getImageData(0, 0, canvas.width, canvas.height).data);

  return this;
};

EZ3.Image.RGBA = 'RGBA';

/**
 * @class DataRequest
 * @extends Request
 */

EZ3.DataRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.File(), crossOrigin);

  this._request = new XMLHttpRequest();
};

EZ3.DataRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.DataRequest.prototype.constructor = EZ3.DataRequest;

EZ3.DataRequest.prototype._processLoad = function(data, onLoad) {
  this._removeEventListeners();

  this.response.data = data.response;

  onLoad(this.url, this.response);
};

EZ3.DataRequest.prototype._processError = function(event, onError) {
  this._removeEventListeners();
  onError(this.url, event);
};

EZ3.DataRequest.prototype._addEventListeners = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function(event) {
    that._processError(event, onError);
  };

  this._request.addEventListener('load', this._onLoad, false);
  this._request.addEventListener('error', this._onError, false);
};

EZ3.DataRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

EZ3.DataRequest.prototype.send = function(onLoad, onError) {
  this._request.open('GET', this.url, true);

  this._addEventListeners(onLoad, onError);

  if (this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  this._request.send(null);
};

/**
 * @class ImageRequest
 * @extends Request
 */

EZ3.ImageRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), crossOrigin);

  this._request = new Image();
};

EZ3.ImageRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.ImageRequest.prototype.constructor = EZ3.ImageRequest;

EZ3.ImageRequest.prototype._processLoad = function(image, onLoad) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  this.response.width = image.width;
  this.response.height = image.height;
  this.response.data = new Uint8Array(context.getImageData(0, 0, image.width, image.height).data);

  this._removeEventListeners();

  onLoad(this.url, this.response);
};

EZ3.ImageRequest.prototype._processError = function(event, onError) {
  this._removeEventListeners();
  onError(this.url, event);
};

EZ3.ImageRequest.prototype._addEventListeners = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function(event) {
    that._processError(event, onError);
  };

  this._request.addEventListener('load', this._onLoad, false);
  this._request.addEventListener('error', this._onError, false);
};

EZ3.ImageRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

EZ3.ImageRequest.prototype.send = function(onLoad, onError) {
  this._addEventListeners(onLoad, onError);

  if (!this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  this._request.src = this.url;
};

/**
 * @class OBJRequest
 * @extends Request
 */

EZ3.OBJRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Entity(), crossOrigin);
};

EZ3.OBJRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.OBJRequest.prototype.constructor = EZ3.OBJRequest;

EZ3.OBJRequest.prototype._parse = function(data, onLoad) {
  var that = this;
  var mesh = new EZ3.Mesh(new EZ3.Geometry(), new EZ3.MeshMaterial());
  var lines = data.split('\n');
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var fixedIndices = [];
  var fixedVertices = [];
  var fixedNormals = [];
  var fixedUvs = [];
  var materials = [];
  var libraries = [];
  var line;
  var result;
  var i;

  function triangulate(face) {
    var data = [];
    var i;

    face = face.split(' ');

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

  function processVertexIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return vertices.length / 3 + index;

    return index - 1;
  }

  function processNormalIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return normals.length / 3 + index;

    return index - 1;
  }

  function processUvIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return uvs.length / 2 + index;

    return index - 1;
  }

  function processFace1(face) {
    var vertex;
    var index;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      vertex = processVertexIndex(face[i]);

      if (indices[vertex] === undefined) {
        index = fixedVertices.length / 3;
        indices[vertex] = index;

        fixedIndices.push(index);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);
      } else
        fixedIndices.push(indices[vertex]);
    }
  }

  function processFace2(face) {
    var point;
    var vertex;
    var uv;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      vertex = processVertexIndex(point[0]);
      uv = processUvIndex(point[1]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].uv === uv) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          uv: uv,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        fixedUvs.push(uvs[2 * uv]);
        fixedUvs.push(1.0 - uvs[2 * uv + 1]);
      }
    }
  }

  function processFace3(face) {
    var point;
    var vertex;
    var uv;
    var normal;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      vertex = processVertexIndex(point[0]);
      uv = processUvIndex(point[1]);
      normal = processNormalIndex(point[2]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].uv === uv && indices[vertex][j].normal === normal) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          uv: uv,
          normal: normal,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        for (j = 0; j < 3; j++)
          fixedNormals.push(normals[3 * normal + j]);

        fixedUvs.push(uvs[2 * uv]);
        fixedUvs.push(1.0 - uvs[2 * uv + 1]);
      }
    }
  }

  function processFace4(face) {
    var point;
    var vertex;
    var normal;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('//');

      vertex = processVertexIndex(point[0]);
      normal = processNormalIndex(point[1]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].normal === normal) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          normal: normal,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        for (j = 0; j < 3; j++)
          fixedNormals.push(normals[3 * normal + j]);
      }
    }
  }

  function processMesh() {
    var buffer;

    if (fixedIndices.length) {
      buffer = new EZ3.IndexBuffer(fixedIndices, false, true);
      mesh.geometry.buffers.add('triangle', buffer);

      buffer = new EZ3.VertexBuffer(fixedVertices);
      buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
      mesh.geometry.buffers.add('position', buffer);

      if (fixedUvs.length) {
        buffer = new EZ3.VertexBuffer(fixedUvs);
        buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
        mesh.geometry.buffers.add('uv', buffer);

        fixedUvs = [];
      }

      if (fixedNormals.length) {
        buffer = new EZ3.VertexBuffer(fixedNormals);
        buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
        mesh.geometry.buffers.add('normal', buffer);

        fixedNormals = [];
      }

      indices = [];
      fixedIndices = [];
      fixedVertices = [];

      that.response.add(mesh);

      mesh = new EZ3.Mesh(new EZ3.Geometry(), new EZ3.MeshMaterial());
    }
  }

  function processMaterials() {
    var loader = new EZ3.Loader();
    var tokens = that.url.split('/');
    var baseUrl = that.url.substr(0, that.url.length - tokens[tokens.length - 1].length);
    var files = [];
    var i;

    for (i = 0; i < libraries.length; i++)
      files.push(loader.add(new EZ3.DataRequest(baseUrl + libraries[i])));

    loader.onComplete.add(function() {
      for (i = 0; i < files.length; i++)
        processMaterial(baseUrl, files[i].data, loader);

      loader.onComplete.removeAll();
      loader.onComplete.add(function() {
        onLoad(that.url, that.response);
      });

      loader.start();
    });

    loader.start();
  }

  function processMaterial(baseUrl, data, loader) {
    var lines = data.split('\n');
    var line;
    var key;
    var value;
    var currents;
    var i;
    var j;

    function processColor(color) {
      var values = color.split(' ');

      return new EZ3.Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
    }

    function processEmissive(color) {
      var emissive = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].emissive = emissive;
    }

    function processDiffuse(color) {
      var diffuse = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].diffuse = diffuse;
    }

    function processSpecular(color) {
      var specular = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].specular = specular;
    }

    function processDiffuseMap(url) {
      var texture = new EZ3.Texture2D(loader.add(new EZ3.ImageRequest(baseUrl + url)));
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].diffuseMap = texture;
    }

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      j = line.indexOf(' ');

      key = (j >= 0) ? line.substring(0, j) : line;
      key = key.toLowerCase();

      value = (j >= 0) ? line.substring(j + 1) : '';
      value = value.trim();

      if (key === 'newmtl') {
        currents = materials[value];
      } else if (key === 'ka') {
        processEmissive(value);
      } else if (key === 'kd') {
        processDiffuse(value);
      } else if (key === 'ks') {
        processSpecular(value);
      } else if (key === 'ns') {

      } else if (key === 'd') {

      } else if (key === 'map_ka') {

      } else if (key === 'map_kd') {
        processDiffuseMap(value);
      } else if (key === 'map_ks') {

      } else if (key === 'map_ns') {

      } else if (key === 'map_bump') {

      } else if (key === 'map_d') {

      }
    }
  }

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#')
      continue;
    else if ((result = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processVertex(result);
    else if ((result = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processNormal(result);
    else if ((result = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processUv(result);
    else if ((result = /f\s(([+-]?\d+\s){2,}[+-]?\d+)/.exec(line)))
      processFace1(triangulate(result[1]));
    else if ((result = /f\s(([+-]?\d+\/[+-]?\d+\s){2,}[+-]?\d+\/[+-]?\d+)/.exec(line)))
      processFace2(triangulate(result[1]));
    else if ((result = /f\s((([+-]?\d+\/[+-]?\d+\/[+-]?\d+\s){2,})[+-]?\d+\/[+-]?\d+\/[+-]?\d+)/.exec(line)))
      processFace3(triangulate(result[1]));
    else if ((result = /f\s(([+-]?\d+\/\/[+-]?\d+\s){2,}[+-]?\d+\/\/[+-]?\d+)/.exec(line)))
      processFace4(triangulate(result[1]));
    else if (/^mtllib/.test(line))
      libraries.push(line.substring(7).trim());
    else if (/^o/.test(line) || /^g/.test(line)) {
      processMesh();
      mesh.name = line.substring(2).trim();
    } else if (/^usemtl/.test(line)) {
      processMesh();
      mesh.material.name = line.substring(7).trim();

      if (!materials[mesh.material.name])
        materials[mesh.material.name] = [];

      materials[mesh.material.name].push(mesh.material);
    }
  }

  processMesh();
  processMaterials();
};

EZ3.OBJRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var loader = new EZ3.Loader();
  var file = loader.add(new EZ3.DataRequest(this.url, this.crossOrigin));

  loader.onComplete.add(function(error) {
    if (error)
      onError(that.url, true);

    that._parse(file.data, onLoad);
  });

  loader.start();
};

/**
 * @class MeshMaterial
 * @extends Material
 */

EZ3.MeshMaterial = function() {
  EZ3.Material.call(this);

  this.emissive = new EZ3.Vector3();
  this.diffuse = new EZ3.Vector3(0.8, 0.8, 0.8);
  this.specular = new EZ3.Vector3(0.2, 0.2, 0.2);

  this.normalMap = null;
  this.diffuseMap = null;
  this.emissiveMap = null;
  this.specularMap = null;
  this.environmentMap = null;

  this.reflective = false;
  this.refractive = false;

  this.diffuseReflection = EZ3.MeshMaterial.LAMBERT;
  this.specularReflection = EZ3.MeshMaterial.PHONG;

  this.shadowCaster = false;
  this.softShadows = false;

  this.albedoFactor = 7.0;
  this.fresnelFactor = 0.0;
  this.refractFactor = 1.0;
  this.roughnessFactor = 0.2;
  this.shininessFactor = 180.1;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, state, lights) {
  var id = EZ3.Material.MESH;
  var defines = [];
  var prefix = '#define ';

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if (this.emissiveMap instanceof EZ3.Texture2D)
    defines.push('EMISSIVE_MAP');

  if (this.diffuseMap instanceof EZ3.Texture2D)
    defines.push('DIFFUSE_MAP');

  if (this.normalMap instanceof EZ3.Texture2D)
    defines.push('NORMAL_MAP');

  if(this.environmentMap instanceof EZ3.Cubemap) {
    defines.push('ENVIRONMENT_MAP');

    if(this.reflective)
      defines.push('REFLECTION');

    if(this.refractive)
      defines.push('REFRACTION');
  }

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR)
    defines.push('OREN_NAYAR');
  else
    defines.push('LAMBERT');

  if(this.specularReflection === EZ3.MeshMaterial.BLINN_PHONG)
    defines.push('BLINN_PHONG');
  else if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE)
    defines.push('COOK_TORRANCE');
  else
    defines.push('PHONG');

  if(this.shadows)
    defines.push('VARIANCE_SHADOW_MAPPING');

  if(this.softShadows)
    defines.push('SOFT_VARIANCE_SHADOW_MAPPING');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (this._id !== id) {
    this._id = id;

    if (!state.programs[id]) {
      this.program = new EZ3.GLSLProgram(gl, EZ3.ShaderLibrary.mesh.vertex, EZ3.ShaderLibrary.mesh.fragment, prefix);
      state.programs[id] = this.program;
    } else
      this.program = state.programs[id];
  }
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state) {
  this.program.loadUniformFloat(gl, 'uEmissive', this.emissive);
  this.program.loadUniformFloat(gl, 'uDiffuse', this.diffuse);
  this.program.loadUniformFloat(gl, 'uSpecular', this.specular);
  this.program.loadUniformFloat(gl, 'uShininess', this.shininessFactor);

  if (this.emissiveMap instanceof EZ3.Texture2D) {
    this.emissiveMap.bind(gl, state, 0);
    this.emissiveMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEmissiveSampler', 0);
  }

  if (this.diffuseMap instanceof EZ3.Texture2D) {
    this.diffuseMap.bind(gl, state, 1);
    this.diffuseMap.update(gl);

    this.program.loadUniformInteger(gl, 'uDiffuseSampler', 1);
  }

  if (this.normalMap instanceof EZ3.Texture2D) {
    this.normalMap.bind(gl, state, 2);
    this.normalMap.update(gl);

    this.program.loadUniformInteger(gl, 'uNormalSampler', 2);
  }

  if(this.environmentMap instanceof EZ3.Cubemap) {
    this.environmentMap.bind(gl, state, 3);
    this.environmentMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEnvironmentSampler', 3);
  }

  if(this.refractive)
    this.program.loadUniformFloat(gl, 'uRefractFactor', this.refractFactor);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR) {
    this.program.loadUniformFloat(gl, 'uAlbedo', this.albedoFactor);
    this.program.loadUniformFloat(gl, 'uRoughness', this.roughnessFactor);
  }

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE) {
    this.program.loadUniformFloat(gl, 'uFresnel', this.fresnelFactor);
    this.program.loadUniformFloat(gl, 'uRoughness', this.roughnessFactor);
  }
};

EZ3.MeshMaterial.LAMBERT = 0;
EZ3.MeshMaterial.OREN_NAYAR = 1;
EZ3.MeshMaterial.PHONG = 2;
EZ3.MeshMaterial.BLINN_PHONG = 3;
EZ3.MeshMaterial.COOK_TORRANCE = 4;

/**
 * @class ShaderMaterial
 * @extends Material
 */

EZ3.ShaderMaterial = function(id, vertex, fragment) {
  EZ3.Material.call(this, EZ3.Material.SHADER + id);

  this._vertex = vertex;
  this._fragment = fragment;
  this._uniformIntegers = {};
  this._uniformFloats = {};
  this._uniformMatrices = {};
  this._uniformTextures = {};
};

EZ3.ShaderMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.ShaderMaterial.prototype.constructor = EZ3.Material;

EZ3.ShaderMaterial.prototype.updateProgram = function(gl, state) {
  if (!this.program) {
    if(state.programs[this._id])
      this.program = state.programs[this._id];
    else {
      this.program = new EZ3.GLSLProgram(gl, this._vertex, this._fragment);
      state.programs[this._id] = this.program;
    }
  }
};

EZ3.ShaderMaterial.prototype.updateUniforms = function(gl) {
  var i = 0;
  var name;
  var texture;

  for (name in this._uniformIntegers)
    this.program.loadUniformInteger(gl, name, this._uniformIntegers[name]);

  for (name in this._uniformFloats)
    this.program.loadUniformFloat(gl, name, this._uniformFloats[name]);

  for (name in this._uniformMatrices)
    this.program.loadUniformMatrix(gl, name, this._uniformMatrices[name]);

  for (name in this._uniformTextures) {
    texture = this._uniformTextures[name];

    texture.bind();
    texture.update();

    this.program.loadUniformi(gl, name, i++);
  }
};

EZ3.ShaderMaterial.prototype.setIntegerUniform = function(name, value) {
  this._uniformIntegers[name] = value;
};

EZ3.ShaderMaterial.prototype.setFloatUniform = function(name, value) {
  this._uniformFloats[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformMatrix = function(name, value) {
  this._uniformMatrices[name] = value;
};

EZ3.ShaderMaterial.prototype.setTextureUniform = function(name, value) {
  this._uniformTextures[name] = value;
};

EZ3.ShaderMaterial.prototype.getUniform = function(name) {
  if (this._uniformIntegers[name])
    return this._uniformIntegers[name];
  else if(this._uniformFloats[name])
    return this._uniformFloat[name];
  else if(this._uniformMatrices[name])
    return this._uniformMatrices[name];
  else
    return this._uniformTextures[name];
};

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
  EZ3.Buffer.prototype.bind.call(this, gl, gl.ELEMENT_ARRAY_BUFFER);
};

EZ3.IndexBuffer.prototype.update = function(gl, extension) {
  var bytes;

  if(this.need32Bits) {
    if(extension.elementIndexUInt)
      bytes = 4;
    else
      return;
  } else
    bytes = 2;

  EZ3.Buffer.prototype.update.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, bytes);
};

EZ3.IndexBuffer.prototype.getType = function(gl, extension) {
  return (extension.elementIndexUInt && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

/**
 * @class VertexBuffer
 * @extends Buffer
 */

EZ3.VertexBuffer = function(data, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  this._attributes = {};
  this._stride = 0;
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
  var normalized;
  var offset;
  var layout;
  var size;
  var k;

  EZ3.Buffer.prototype.bind.call(this, gl, gl.ARRAY_BUFFER);

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
        gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
      } else {
        gl.enableVertexAttribArray(layout);
        gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
      }
    }
  }
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  EZ3.Buffer.prototype.update.call(this, gl, gl.ARRAY_BUFFER, 4);
};

EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  if (attribute instanceof EZ3.VertexBufferAttribute) {
    this._stride += 4 * attribute.size;
    this._attributes[name] = attribute;
  }
};

/**
 * @class Cubemap
 * @extends Texture
 */

EZ3.Cubemap = function(px, nx, py, ny, pz, nz, generateMipmaps) {
  EZ3.Texture.call(this, generateMipmaps);

  this._images = [];
  this.setImage(EZ3.Cubemap.POSITIVE_X, px);
  this.setImage(EZ3.Cubemap.NEGATIVE_X, nx);
  this.setImage(EZ3.Cubemap.POSITIVE_Y, py);
  this.setImage(EZ3.Cubemap.NEGATIVE_Y, ny);
  this.setImage(EZ3.Cubemap.POSITIVE_Z, pz);
  this.setImage(EZ3.Cubemap.NEGATIVE_Z, nz);
};

EZ3.Cubemap.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Cubemap.prototype.contructor = EZ3.Cubemap;

EZ3.Cubemap.prototype.bind = function(gl, state, unit) {
  EZ3.Texture.prototype.bind.call(this, gl, gl.TEXTURE_CUBE_MAP, state, unit);
};

EZ3.Cubemap.prototype.update = function(gl) {
  var k;

  if (this.dirty) {
    for(k = 0; k < 6; k++)
      EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + k, this._images[k]);

    EZ3.Texture.prototype._updateMipmaps.call(this, gl);

    this.dirty = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_CUBE_MAP);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

EZ3.Cubemap.prototype.setImage = function(target, image) {
  if (image instanceof EZ3.Image)
    this._images[target] = image;
};

EZ3.Cubemap.POSITIVE_X = 0;
EZ3.Cubemap.NEGATIVE_X = 1;
EZ3.Cubemap.POSITIVE_Y = 2;
EZ3.Cubemap.NEGATIVE_Y = 3;
EZ3.Cubemap.POSITIVE_Z = 4;
EZ3.Cubemap.NEGATIVE_Z = 5;

/**
 * @class Texture2D
 * @extends Texture
 */

EZ3.Texture2D = function(image, generateMipmaps) {
  EZ3.Texture.call(this, generateMipmaps);

  this.image = image;
};

EZ3.Texture2D.prototype = Object.create(EZ3.Texture.prototype);
EZ3.Texture2D.prototype.constructor = EZ3.Texture2D;

EZ3.Texture2D.prototype.bind = function(gl, state, unit) {
  EZ3.Texture.prototype.bind.call(this, gl, gl.TEXTURE_2D, state, unit);
};

EZ3.Texture2D.prototype.update = function(gl) {
  if (this.dirty) {
    EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_2D, this.image);
    EZ3.Texture.prototype._updateMipmaps.call(this, gl);

    this.dirty = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_2D);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

/**
 * @class TargetCubemap
 * @extends Cubemap
 */

 EZ3.TargetCubemap = function(resolution, target) {
   EZ3.Cubemap.call(this,
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     false
   );
 };

 EZ3.TargetCubemap.prototype = Object.create(EZ3.Cubemap.prototype);
 EZ3.TargetCubemap.prototype.constructor = EZ3.TargetCubemap;

 EZ3.TargetCubemap.prototype.attachToFramebuffer = function(gl, attachment) {
   // TODO
 };

/**
 * @class TargetTexture2D
 * @extends Texture2D
 */

 EZ3.TargetTexture2D = function(resolution, format) {
   EZ3.Texture2D.call(this, new EZ3.Image(resolution.x, resolution.y, format, null), false);
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 EZ3.TargetTexture2D.prototype.attachToFramebuffer = function(gl, attachment) {
   if(this._cache.framebufferAttachment !== attachment) {
     this._cache.framebufferAttachment = attachment;
     gl.framebufferTexture2D(gl.FRAMEBUFFER, gl[attachment], gl.TEXTURE_2D, this._id, 0);
   }
 };
