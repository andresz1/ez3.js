var EZ3 = function() {};

EZ3 = new EZ3();

EZ3.extends = function(destination, source) {
  var k;

  for (k in source)
    destination[k] = source[k];
};

EZ3.toFileName = function(url) {
  return url.split('/').pop();
};

EZ3.toFileExtension = function(url) {
  return url.split('/').pop().split('.').pop();
};

EZ3.toBaseUrl = function(url) {
  var tokens = url.split('/');

  return url.substr(0, url.length - tokens[tokens.length - 1].length);
};

/**
 * @class EZ3.Control
 * @constructor
 * @param {EZ3.Entity} entity
 */
EZ3.Control = function(entity) {
  /**
   * @property {EZ3.Entity} entity
   */
  this.entity = entity;
};

EZ3.Control.prototype.constructor = EZ3.Control;

/**
 * @class EZ3.Engine
 * @constructor
 * @param {HTMLElement} canvas
 * @param {EZ3.Screen} [screen]
 * @param {Object} [options]
 */
EZ3.Engine = function(canvas, screen, options) {
  var device = EZ3.Device;

  /**
   * @property {EZ3.AnimationFrame} _animationFrame
   * @private
   */
  this._animationFrame = null;

  /**
   * @property {EZ3.Renderer} _renderer
   * @private
   */
  this._renderer = null;

  /**
   * @property {EZ3.Time} time
   */
  this.time = null;

  /**
   * @property {EZ3.Input} input
   */
  this.input = null;

  /**
   * @property {EZ3.ScreenManager} screens
   */
  this.screens = null;

  device.onReady(this._init, this, [
    canvas,
    screen,
    options
  ]);
};

/**
 * @method EZ3.Engine#_init
 * @private
 * @param {HTMLElement} canvas
 * @param {EZ3.Screen} [screen]
 * @param {Object} [options]
 */
EZ3.Engine.prototype._init = function(canvas, screen, options) {
  var bounds = canvas.getBoundingClientRect();

  this._animationFrame = new EZ3.AnimationFrame(false);
  this._renderer = new EZ3.Renderer(canvas, options);

  this.time = new EZ3.Time();
  this.input = new EZ3.InputManager(canvas, bounds);
  this.screens = new EZ3.ScreenManager(canvas, bounds, this._renderer, this.time, this.input, screen);

  this._renderer.initContext();
  this.time.start();
  this._update();
};

/**
 * @method EZ3.Engine#_update
 * @private
 */
EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this.time.update();
  this._animationFrame.request(this._update.bind(this));
};

/**
 * @class EZ3.Entity
 * @constructor
 */
EZ3.Entity = function() {
  var that = this;

  /**
   * @property {Object} _cache
   * @private
   */
  this._cache = {};

  /**
   * @property {EZ3.Entity} parent
   */
  this.parent = null;

  /**
   * @property {EZ3.Entity[]} children
   */
  this.children = [];

  /**
   * @property {EZ3.Matrix4} model
   */
  this.model = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4} wolrd
   */
  this.world = new EZ3.Matrix4();

  /**
   * @property {EZ3.Vector3} scale
   */
  this.scale = new EZ3.Vector3(1, 1, 1);

  /**
   * @property {EZ3.Euler} rotation
   */
  this.rotation = new EZ3.Euler();

  /**
   * @property {EZ3.Vector3} position
   */
  this.position = new EZ3.Vector3();

  /**
   * @property {EZ3.Quaternion} quaternion
   */
  this.quaternion = new EZ3.Quaternion();

  this.rotation.onChange.add(function() {
    that.quaternion.setFromEuler(that.rotation);
  });

  this.quaternion.onChange.add(function() {
    that.rotation.setFromQuaternion(that.quaternion);
  });
};

/**
 * @method EZ3.Entity#add
 * @param {EZ3.Entity} child
 */
EZ3.Entity.prototype.add = function(child) {
  if (child.parent)
    child.parent.remove(child);

  child.parent = this;
  this.children.push(child);
};

/**
 * @method EZ3.Entity#remove
 * @param {EZ3.Entity} child
 */
EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if (~position)
    this.children.splice(position, 1);
};

/**
 * @method EZ3.Entity#lookAt
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.Entity.prototype.lookAt = function(target, up) {
  var changed = false;

  target = target || new EZ3.Vector3();
  up = up || new EZ3.Vector3(0, 1, 0);

  if (target.isDiff(this._cache.target)) {
    this._cache.target = target.clone();
    changed = true;
  }

  if (up.isDiff(this._cache.up)) {
    this._cache.up = up.clone();
    changed = true;
  }

  if (this.position.isDiff(this._cache.position))
    changed = true;

  if (changed)
    this.quaternion.setFromRotationMatrix(new EZ3.Matrix4().lookAt(this.position, target, up));
};

/**
 * @method EZ3.Entity#updateWorld
 */
EZ3.Entity.prototype.updateWorld = function() {
  var scaleDirty = false;
  var modelDirty = false;
  var positionDirty = false;
  var quaternionDirty = false;
  var parentWorldDirty = false;

  if (this.position.isDiff(this._cache.position)) {
    this._cache.position = this.position.clone();
    positionDirty = true;
  }

  if (this.quaternion.isDiff(this._cache.quaternion)) {
    this._cache.quaternion = this.quaternion.clone();
    quaternionDirty = true;
  }

  if (this.scale.isDiff(this._cache.scale)) {
    this._cache.scale = this.scale.clone();
    scaleDirty = true;
  }

  if (positionDirty || quaternionDirty || scaleDirty)
    this.model.compose(this.position, this.quaternion, this.scale);

  if (!this.parent) {
    modelDirty = this.model.isDiff(this._cache.model);

    if (modelDirty) {
      this.world = this.model.clone();
      this._cache.model = this.model.clone();
    }
  } else {
    modelDirty = this.model.isDiff(this._cache.model);
    parentWorldDirty = this.parent.world.isDiff(this._cache.parentWorld);

    if (parentWorldDirty || modelDirty) {

      if (modelDirty)
        this._cache.model = this.model.clone();

      if (parentWorldDirty)
        this._cache.parentWorld = this.parent.world.clone();

      this.world.mul(this.parent.world, this.model);
    }
  }
};

/**
 * @method EZ3.Entity#traverse
 * @param {Function} callback
 */
EZ3.Entity.prototype.traverse = function(callback) {
  var entities = [];
  var entity;
  var i;

  entities.push(this);

  while (entities.length) {
    entity = entities.pop();

    callback(entity);

    for (i = entity.children.length - 1; i >= 0; i--)
      entities.push(entity.children[i]);
  }
};

/**
 * @method EZ3.Entity#updateWorldTraverse
 */
EZ3.Entity.prototype.updateWorldTraverse = function() {
  this.traverse(function(entity) {
    entity.updateWorld();
  });
};

/**
 * @method EZ3.Entity#getWorldPosition
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldPosition = function() {
  return this.world.getPosition();
};

/**
 * @method EZ3.Entity#getWorldRotation
 * @return {EZ3.Quaternion}
 */
EZ3.Entity.prototype.getWorldRotation = function() {
  return this.world.getRotation();
};

/**
 * @method EZ3.Entity#getWorldScale
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldScale = function() {
  return this.world.getScale();
};

/**
 * @method EZ3.Entity#getWorldDirection
 * @return {EZ3.Vector3}
 */
EZ3.Entity.prototype.getWorldDirection = function() {
  return new EZ3.Vector3(0, 0, 1).mulQuaternion(this.getWorldRotation());
};

EZ3.Scene = function() {
  EZ3.Entity.call(this);
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;

/**
 * @class Signal
 */

EZ3.Signal = function() {
  var that = this;

  this._bindings = [];
  this._prevParams = null;

  this.dispatch = function() {
    EZ3.Signal.prototype.dispatch.apply(that, arguments);
  };
};

EZ3.Signal.prototype._shouldPropagate = true;
EZ3.Signal.prototype.memorize = false;
EZ3.Signal.prototype.active = true;

EZ3.Signal.prototype._registerListener = function(listener, isOnce, listenerContext, priority) {
  var prevIndex = this._indexOfListener(listener, listenerContext);
  var binding;
  var warning;

  if (prevIndex !== -1) {
    binding = this._bindings[prevIndex];

    if (binding.isOnce !== isOnce) {
      warning = 'You cannot add';
      warning += isOnce ? '' : 'Once';
      warning += '() then add';
      warning += !isOnce ? '' : 'Once';
      warning += '() the same listener without removing the relationship first.';

      console.warn(warning);
    }
  } else {
    binding = new EZ3.SignalBinding(this, listener, isOnce, listenerContext, priority);
    this._addBinding(binding);
  }

  if (this.memorize && this._prevParams)
    binding.execute(this._prevParams);

  return binding;
};

EZ3.Signal.prototype._addBinding = function(binding) {
  var n = this._bindings.length;

  do {
    --n;
  } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);

  this._bindings.splice(n + 1, 0, binding);
};

EZ3.Signal.prototype._indexOfListener = function(listener, context) {
  var n = this._bindings.length;
  var cur;

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
  var i = this._indexOfListener(listener, context);

  if (i !== -1) {
    this._bindings[i]._destroy();
    this._bindings.splice(i, 1);
  }

  return listener;
};

EZ3.Signal.prototype.removeAll = function(context) {
  var n = this._bindings.length;

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
  var paramsArr;
  var bindings;
  var n;

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
  this._priority = (priority !== undefined) ? priority : 0;

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
  var handlerReturn;
  var params;

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

 EZ3.Framebuffer = function(size) {
  this._id = null;
  this._cache = {};
  this._renderbuffer = null;

  this.size = size;
  this.texture = null;
};

EZ3.Framebuffer.prototype.constructor = EZ3.Framebuffer;

EZ3.Framebuffer.prototype.bind = function(gl, state) {
  if(!this._id)
    this._id = gl.createFramebuffer();

  gl.bindFramebuffer(gl.FRAMEBUFFER, this._id);
  state.viewport(new EZ3.Vector2(), this.size);
};

EZ3.Framebuffer.prototype.update = function(gl) {
  this.texture.bind(gl);
  this.texture.update(gl);
  this.texture.attach(gl);

  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
    console.warn('EZ3.Framebuffer.update: update is not completed.');
};

EZ3.Framebuffer.unbind = function(gl) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/**
 * @class Geometry
 */

EZ3.Geometry = function() {
  this.buffers = new EZ3.ArrayBuffer();

  this.linearDataNeedUpdate = true;
  this.normalDataNeedUpdate  = true;
};

EZ3.Geometry.prototype._computeLinearData = function() {
  var triangles = this.buffers.getTriangularBuffer();
  var need32Bits;
  var lines;
  var i;

  if (!triangles)
    return;

  need32Bits = triangles.need32Bits;
  triangles = triangles.data;
  lines = [];

  for (i = 0; i < triangles.length; i += 3) {
    lines.push(triangles[i], triangles[i + 1], triangles[i]);
    lines.push(triangles[i + 2], triangles[i + 1], triangles[i + 2]);
  }

  this.buffers.addLinearBuffer(lines, need32Bits);
};

EZ3.Geometry.prototype._computeNormalData = function() {
  var indices = this.buffers.getTriangularBuffer();
  var vertices = this.buffers.getPositionBuffer();
  var normals;
  var weighted;
  var point0;
  var point1;
  var point2;
  var vector0;
  var vector1;
  var x;
  var y;
  var z;
  var i;

  if (!indices || !vertices)
    return;

  indices = indices.data;
  vertices = vertices.data;
  normals = [];
  weighted = [];
  point0 = new EZ3.Vector3();
  point1 = new EZ3.Vector3();
  point2 = new EZ3.Vector3();
  vector0 = new EZ3.Vector3();
  vector1 = new EZ3.Vector3();

  for (i = 0; i < vertices.length / 3; i++)
    weighted.push(new EZ3.Vector3());

  for (i = 0; i < indices.length; i += 3) {
    x = 3 * indices[i];
    y = 3 * indices[i + 1];
    z = 3 * indices[i + 2];

    point0.set(vertices[x], vertices[x + 1], vertices[x + 2]);
    point1.set(vertices[y], vertices[y + 1], vertices[y + 2]);
    point2.set(vertices[z], vertices[z + 1], vertices[z + 2]);

    vector0.sub(point1, point0);
    vector1.sub(point2, point0);

    vector1.cross(vector0);
    weighted[indices[i]].add(vector1);
    weighted[indices[i + 1]].add(vector1);
    weighted[indices[i + 2]].add(vector1);
  }

  for (i = 0; i < weighted.length; i++) {
    if (!weighted[i].isZeroVector())
      weighted[i].normalize();

    normals.push(weighted[i].x, weighted[i].y, weighted[i].z);
  }

  this.buffers.addNormalBuffer(normals);
};

EZ3.Geometry.prototype.updateLinearData = function() {
  if (this.linearDataNeedUpdate) {
    this._computeLinearData();
    this.linearDataNeedUpdate = false;
  }
};

EZ3.Geometry.prototype.updateNormalData = function() {
  if (this.normalDataNeedUpdate) {
    this._computeNormalData();
    this.normalDataNeedUpdate = false;
  }
};

/**
 * @class ArrayBuffer
 */

EZ3.ArrayBuffer = function() {
  this._id = null;
  this._triangular = null;
  this._linear = null;
  this._vertex = {};
};

EZ3.ArrayBuffer.prototype.constructor = EZ3.ArrayBuffer;

EZ3.ArrayBuffer.prototype.bind = function(gl, attributes, state, extensions, index) {
  var buffer;
  var k;

  if (extensions.vertexArrayObject) {
    if (!this._id)
      this._id = extensions.vertexArrayObject.createVertexArrayOES();

    extensions.vertexArrayObject.bindVertexArrayOES(this._id);

    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes) && buffer.needUpdate) {
        buffer.bind(gl, attributes);
        buffer.update(gl);
        buffer.needUpdate = false;
      }
    }
  } else {
    for (k in this._vertex) {
      buffer = this._vertex[k];

      if (buffer.isValid(gl, attributes)) {
        buffer.bind(gl, attributes, state);

        if (buffer.needUpdate) {
          buffer.update(gl);
          buffer.needUpdate = false;
        }
      }
    }
  }

  if (index === EZ3.IndexBuffer.TRIANGULAR)
    buffer = this._triangular;
  else if (index === EZ3.IndexBuffer.LINEAR)
    buffer = this._linear;
  else
    return;

  buffer.bind(gl);

  if (buffer.needUpdate) {
    buffer.update(gl, extensions);
    buffer.needUpdate = false;
  }
};

EZ3.ArrayBuffer.prototype.addLinearBuffer = function(data, need32Bits, dynamic) {
  var buffer = this._linear;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;
    need32Bits = (need32Bits !== undefined) ? need32Bits : false;

    buffer = new EZ3.IndexBuffer(data, dynamic, need32Bits);
    this._linear = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    if (need32Bits !== undefined)
      buffer.need32Bits = need32Bits;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addTriangularBuffer = function(data, need32Bits, dynamic) {
  var buffer = this._triangular;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;
    need32Bits = (need32Bits !== undefined) ? need32Bits : false;

    buffer = new EZ3.IndexBuffer(data, dynamic, need32Bits);
    this._triangular = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    if (need32Bits !== undefined)
      buffer.need32Bits = need32Bits;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addPositionBuffer = function(data, dynamic) {
  var buffer = this._vertex.position;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
    this._vertex.position = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addNormalBuffer = function(data, dynamic) {
  var buffer = this._vertex.normal;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
    this._vertex.normal = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addUvBuffer = function(data, dynamic) {
  var buffer = this._vertex.uv;

  if (!buffer) {
    dynamic = (dynamic !== undefined) ? dynamic : false;

    buffer = new EZ3.VertexBuffer(data, dynamic);
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    this._vertex.uv = buffer;
  } else {
    buffer.data = data;

    if (dynamic !== undefined)
      buffer.dynamic = dynamic;

    buffer.needUpdate = true;
  }

  return buffer;
};

EZ3.ArrayBuffer.prototype.addVertexBuffer = function(name, buffer) {
  this._vertex[name] = buffer;

  return buffer;
};

EZ3.ArrayBuffer.prototype.getTriangularBuffer = function() {
  return this._triangular;
};

EZ3.ArrayBuffer.prototype.getLinearBuffer = function() {
  return this._linear;
};

EZ3.ArrayBuffer.prototype.getPositionBuffer = function() {
  return this._vertex.position;
};

EZ3.ArrayBuffer.prototype.getNormalBuffer = function() {
  return this._vertex.normal;
};

EZ3.ArrayBuffer.prototype.getUvBuffer = function() {
  return this._vertex.uv;
};

EZ3.ArrayBuffer.prototype.getVertexBuffer = function(name) {
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
  this.needUpdate = true;
};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

EZ3.Buffer.prototype.bind = function(gl, target) {
  if(!this._id)
    this._id = gl.createBuffer();

  gl.bindBuffer(target, this._id);
};

EZ3.Buffer.prototype.update = function(gl, target, bytes) {
  var length = bytes * this.data.length;
  var changed = false;
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

  if (this._cache.length !== length) {
    this._cache.length = length;
    changed = true;
  }

  if (this._cache.dynamic !== this.dynamic) {
    this._cache.dynamic =  this.dynamic;
    changed = true;
  }

  if (changed) {
    this._ranges = [];

    gl.bufferData(target, new ArrayType(this.data), (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  } else {
    if (this._ranges.length) {
      for (k = 0; k < this._ranges.length; k += 2) {
        offset = bytes * this._ranges[k];
        data = this.data.slice(this._ranges[k], this._ranges[k + 1]);
        gl.bufferSubData(target, offset, new ArrayType(data));
      }

      this._ranges = [];
    } else
      gl.bufferSubData(target, 0, new ArrayType(this.data));
  }
};

EZ3.Buffer.prototype.addUpdateRange = function(left, right) {
    this._ranges.push(left, right);
};

/**
 * @class VertexBufferAttribute
 */

EZ3.VertexBufferAttribute = function(size, offset, normalized) {
  this.size = size;
  this.offset = (offset !== undefined) ? 4 * offset : 0;
  this.normalized = (normalized !== undefined) ? normalized : false;
};

/**
 * @class InputManager
 */

EZ3.InputManager = function(canvas, bounds) {
  this.keyboard = new EZ3.Keyboard();
  this.mouse = new EZ3.Mouse(canvas, bounds);
  this.touch = new EZ3.Touch(canvas, bounds);

  this.enable();
};

EZ3.InputManager.prototype.enable = function() {
  this.keyboard.enable();
  this.mouse.enable();
  this.touch.enable();
};

EZ3.InputManager.prototype.disable = function() {
  this.keyboard.disable();
  this.mouse.disable();
  this.touch.disable();
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

EZ3.Mouse = function(domElement, bounds) {
  this._domElement = domElement;
  this._bounds = bounds;

  this.enabled = false;
  this.pointer = new EZ3.MousePointer();
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
  this.onLockChange = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this._domElement, this._bounds, this.onPress, this.onMove);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this._domElement, this._bounds, this.onMove);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

EZ3.Mouse.prototype._processMouseLockChange = function() {
  var device = EZ3.Device;

  if (this.pointer.locked) {
    document.removeEventListener(device.pointerLockChange, this._onMouseLockChange, true);

    delete this._onMouseLockChange;
  }

  this.pointer.processLockChange(this.onLockChange);
};

EZ3.Mouse.prototype.requestPointerLock = function() {
  var device = EZ3.Device;
  var that;

  if (device.requestPointerLock && !this.pointer.locked) {
    that = this;

    this._onMouseLockChange = function(event) {
      that._processMouseLockChange(event);
    };

    document.addEventListener(device.pointerLockChange, this._onMouseLockChange, true);

    this._domElement[device.requestPointerLock]();
  }
};

EZ3.Mouse.prototype.exitPointerLock = function() {
  var device = EZ3.Device;

  if (device.exitPointerLock && this.pointer.locked)
    document[device.exitPointerLock]();
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;
  var device = EZ3.Device;

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

  this._domElement.addEventListener('mousedown', this._onMousePress, true);
  this._domElement.addEventListener('mousemove', this._onMouseMove, true);
  this._domElement.addEventListener('mouseup', this._onMouseUp, true);

  if (device.wheel) {
    this._onMouseWheel = function(event) {
      that._processMouseWheel(event);
    };

    this._domElement.addEventListener(device.wheel, this._onMouseWheel, true);
  }
};

EZ3.Mouse.prototype.disable = function() {
  var device = EZ3.Device;

  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMouserDown, true);
  this._domElement.removeEventListener('mousemove', this._onMouseMove, true);
  this._domElement.removeEventListener('mouseup', this._onMouseUp, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;

  if (device.wheel) {
    this._domElement.removeEventListener(device.wheel, this._onMouseWheel, true);

    delete this._onMouseWheel;
  }
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.MIDDLE_BUTTON = 1;
EZ3.Mouse.RIGHT_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;

/**
 * @class Pointer
 */

EZ3.Pointer = function() {
  this.last = {
    page : new EZ3.Vector2(),
    client : new EZ3.Vector2(),
    screen : new EZ3.Vector2(),
    position : new EZ3.Vector2()
  };
  this.current = {
    page : new EZ3.Vector2(),
    client : new EZ3.Vector2(),
    screen : new EZ3.Vector2(),
    position : new EZ3.Vector2()
  };
  this.entered = false;
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Pointer.prototype.processPress = function(event, domElement, bounds) {
  EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
};

EZ3.Pointer.prototype.processMove = function(event, domElement, bounds) {
  var x = Math.round((event.clientX - bounds.left) / (bounds.right - bounds.left) * domElement.width);
  var y = Math.round((event.clientY - bounds.top) / (bounds.bottom - bounds.top) * domElement.height);

  this.last.page.copy(this.current.position);
  this.last.client.copy(this.current.client);
  this.last.screen.copy(this.current.screen);
  this.last.position.copy(this.current.position);

  this.current.page.set(event.pageX, event.pageY);
  this.current.client.set(event.clientX, event.clientY);
  this.current.screen.set(event.screenX, event.screenY);
  this.current.position.set(x, y);
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

EZ3.Touch = function(domElement, bounds) {
  this._device = EZ3.Device;
  this._domElement = domElement;
  this._bounds = bounds;
  this._pointers = [];

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

EZ3.Touch.prototype._getPointerIndex = function(id) {
  var i;

  for (i = 0; i < this._pointers.length; i++)
    if (id === this._pointers[i].id)
      return i;

  return -1;
};

EZ3.Touch.prototype._processTouchPress = function(event) {
  var touch;
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    touch = null;

    for (j = 0; j < EZ3.Touch.MAX_NUM_OF_POINTERS; j++) {
      if (!this._pointers[j]) {
        touch = event.changedTouches[i];
        this._pointers[j] = new EZ3.TouchPointer(j, touch .identifier);
        break;
      } else if (this._pointers[j].isUp()) {
        touch = event.changedTouches[i];
        this._pointers[j].id = touch.identifier;
        break;
      }
    }

    if (touch)
      this._pointers[j].processPress(touch, this._domElement, this._bounds, this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    j = this._getPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processMove(event.changedTouches[i], this._domElement, this._bounds, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  var i;
  var j;

  event.preventDefault();

  for (i = 0; i < event.changedTouches.length; i++) {
    j = this._getPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processUp(this.onUp);
  }
};

EZ3.Touch.prototype.enable = function() {
  var that;

  if (this._device.touchDown) {
    that = this;

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
    this._pointers[code] = new EZ3.TouchPointer(code);

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
  this.shadowBias = 0.00005;
  this.shadowDarkness = 0.2;

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
 * @class AssetsManager
 */

EZ3.AssetManager = function() {
  this._assets = {};
};

EZ3.AssetManager.prototype.add = function(url, asset) {
  this._assets[url] = asset;

  return this._assets[url];
};

EZ3.AssetManager.prototype.get = function(id) {
  var asset = this._assets[id];
  var url;

  if (asset)
    return asset;

  for (url in this._assets)
    if (EZ3.toFileName(url) === id)
      return this._assets[url];
};

/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._files = {};
};

EZ3.Cache = new EZ3.Cache();

EZ3.Cache.add = function(url, file) {
  this._files[url] = file;

  return this._files[url];
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
 * @class Request
 */

EZ3.Request = function(url, asset, cached, crossOrigin) {
  this.url = url;
  this.asset = asset;
  this.cached = (cached !== undefined) ? cached : true;
  this.crossOrigin = (crossOrigin !== undefined) ? crossOrigin : false;
};

EZ3.Request.prototype.constructor = EZ3.Request;

/**
 * @class RequestManager
 */

EZ3.RequestManager = function() {
  this._requests = {};
  this._assets = new EZ3.AssetManager();

  this.started = false;
  this.toSend = 0;
  this.loaded = 0;
  this.failed = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.RequestManager.prototype._processLoad = function(url, asset, cached) {
  var cache;

  if (asset instanceof EZ3.File && cached) {
    cache = EZ3.Cache;
    cache.add(url, asset);
  }

  this.loaded++;
  this._assets.add(url, asset);

  this._processProgress(url, asset);
};

EZ3.RequestManager.prototype._processError = function(url) {
  this.failed++;

  this._processProgress(url);
};

EZ3.RequestManager.prototype._processProgress = function(url, asset) {
  var loaded, failed, assets;

  this.onProgress.dispatch(url, asset, this.loaded, this.failed, this.toSend);

  if (this.toSend === this.loaded + this.failed) {
    assets = this._assets;
    loaded = this.loaded;
    failed = this.failed;

    this._requests = {};
    this._assets = new EZ3.AssetManager();
    this.toSend = 0;
    this.loaded = 0;
    this.failed = 0;
    this.started = false;

    this.onComplete.dispatch(assets, failed, loaded);
  }
};

EZ3.RequestManager.prototype.addFileRequest = function(url, cached, crossOrigin, responseType) {
  var cache = EZ3.Cache;
  var file = cache.get(url);

  if (file) {
    this._assets.add(url, file);
    return file;
  }

  if (!this._requests[url]) {
    this._requests[url] = new EZ3.FileRequest(url, cached, crossOrigin, responseType);
    this.toSend++;
  }

  return this._requests[url].asset;
};

EZ3.RequestManager.prototype.addImageRequest = function(url, cached, crossOrigin) {
  var cache = EZ3.Cache;
  var image = cache.get(url);

  if (image) {
    this._assets.add(url, image);
    return image;
  }

  if (!this._requests[url]) {
    var extension = EZ3.toFileExtension(url);

    if (extension === 'tga')
      this._requests[url] = new EZ3.TGARequest(url, cached, crossOrigin);
    else
      this._requests[url] = new EZ3.ImageRequest(url, cached, crossOrigin);

    this.toSend++;
  }

  return this._requests[url].asset;
};

EZ3.RequestManager.prototype.addEntityRequest = function(url, cached, crossOrigin) {
  if (!this._requests[url]) {
    var extension = EZ3.toFileExtension(url);

    if (extension === 'obj')
      this._requests[url] = new EZ3.OBJRequest(url, cached, crossOrigin);
    else if (extension === 'off')
      this._requests[url] = new EZ3.OFFRequest(url, cached, crossOrigin);
    else if (extension === 'mdl')
      this._requests[url] = new EZ3.MDLRequest(url, cached, crossOrigin);
    else if (extension === 'md2')
      this._requests[url] = new EZ3.MD2Request(url, cached, crossOrigin);
    else
      return;

    this.toSend++;
  }

  return this._requests[url].asset;
};

EZ3.RequestManager.prototype.send = function() {
  var assets;
  var url;

  if (!this.toSend) {
    assets = this._assets;
    this._assets = new EZ3.AssetManager();
    this.onComplete.dispatch(assets, 0, 0);
  }

  this.started = true;

  for (url in this._requests)
    this._requests[url].send(this._processLoad.bind(this), this._processError.bind(this));
};

EZ3.RequestManager.prototype.file = EZ3.RequestManager.prototype.addFileRequest;
EZ3.RequestManager.prototype.image = EZ3.RequestManager.prototype.addImageRequest;
EZ3.RequestManager.prototype.entity = EZ3.RequestManager.prototype.addEntityRequest;
EZ3.RequestManager.prototype.start = EZ3.RequestManager.prototype.send;

/**
 * @class Material
 */

EZ3.Material = function(id) {
  this._id = id || null;

  this.program = null;
  this.fill = EZ3.Material.SOLID;
  this.visible = true;
  this.depthTest = true;
  this.transparent = false;
  this.faceCulling = EZ3.Material.BACK_CULLING;
  this.blending = EZ3.Material.STANDARD_BLENDING;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest)
    state.enable(gl.DEPTH_TEST);
  else
    state.disable(gl.DEPTH_TEST);

  if (this.faceCulling !== EZ3.Material.NO_CULLING) {
    state.enable(gl.CULL_FACE);
    if(this.faceCulling === EZ3.Material.FRONT)
      state.cullFace(gl.FRONT);
    else
      state.cullFace(gl.BACK);
  } else
    state.disable(gl.CULL_FACE);

  if (this.transparent) {
    state.enable(gl.BLEND);

    if (this.blending === EZ3.Material.ADDITIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.SRC_ALPHA, gl.ONE);
    } else if (this.blending === EZ3.Material.SUBTRACTIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
    } else if (this.blending === EZ3.Material.MULTIPLICATIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.ZERO, gl.SRC_COLOR);
    } else {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  } else
    state.disable(gl.BLEND);
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;

EZ3.Material.NO_CULLING = 0;
EZ3.Material.BACK_CULLING = 1;
EZ3.Material.FRONT_CULLING = 2;

EZ3.Material.STANDARD_BLENDING = 0;
EZ3.Material.ADDITIVE_BLENDING = 1;
EZ3.Material.SUBTRACTIVE_BLENDING = 2;
EZ3.Material.MULTIPLICATIVE_BLENDING = 3;

/**
 * @class BoundingBox
 */
EZ3.BoundingBox = function() {
};

/**
 * @class BoundingSphere
 */
EZ3.BoundingSphere = function() {
};

/**
 * Representation of a Euler angles.
 * @class EZ3.Euler
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [order]
 */
EZ3.Euler = function(x, y, z, order) {
  /**
   * @property {Number} x
   * @default 0
   */
  this._x = (x !== undefined) ? x : 0;

  /**
   * @property {Number} y
   * @default 0
   */
  this._y = (y !== undefined) ? y : 0;

  /**
   * @property {Number} z
   * @default 0
   */
  this._z = (z !== undefined) ? z : 0;

  /**
   * @property {Number} order
   * @default EZ3.Euler.XYZ
   */
  this._order = (order !== undefined) ? order : EZ3.Euler.XYZ;

  /**
   * @property {EZ3.Signal} onChange
   */
  this.onChange = new EZ3.Signal();
};

EZ3.Euler.prototype.constructor = EZ3.Euler;

/**
 * @method EZ3.Euler#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} [order]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.set = function(x, y, z, order) {
  this._x = x;
  this._y = y;
  this._z = z;
  this._order = order || this._order;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Euler#clone
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.clone = function() {
  return new this.constructor(this._x, this._y, this._z, this._order);
};

/**
 * @method EZ3.Euler#set
 * @param {EZ3.Euler} euler
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.copy = function(e) {
  this._x = e.x;
  this._y = e.y;
  this._z = e.z;
  this._order = e.order;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Euler#setFromRotationMatrix
 * @param {EZ3.Matrix3} m
 * @param {Number} [order]
 * @param {Boolean} [update]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.setFromRotationMatrix = function(m, order, update) {
  var te = m.elements;

  var m11 = te[0];
  var m21 = te[1];
  var m31 = te[2];

  var m12 = te[4];
  var m22 = te[5];
  var m32 = te[6];

  var m13 = te[8];
  var m23 = te[9];
  var m33 = te[10];

  order = (order !== undefined) ? order : this._order;

  if (order === EZ3.Euler.XYZ) {
    this._y = Math.asin(EZ3.Math.clamp(m13, -1, 1));

    if (Math.abs(m13) < 0.99999) {
      this._x = Math.atan2(-m23, m33);
      this._z = Math.atan2(-m12, m11);
    } else {
      this._x = Math.atan2(m32, m22);
      this._z = 0;
    }
  } else if (order === EZ3.Euler.YXZ) {
    this._x = Math.asin(-EZ3.Math.clamp(m23, -1, 1));

    if (Math.abs(m23) < 0.99999) {
      this._y = Math.atan2(m13, m33);
      this._z = Math.atan2(m21, m22);
    } else {
      this._y = Math.atan2(-m31, m11);
      this._z = 0;
    }
  } else if (order === EZ3.Euler.ZXY) {
    this._x = Math.asin(EZ3.Math.clamp(m32, -1, 1));

    if (Math.abs(m32) < 0.99999) {
      this._y = Math.atan2(-m31, m33);
      this._z = Math.atan2(-m12, m22);
    } else {
      this._y = 0;
      this._z = Math.atan2(m21, m11);
    }
  } else if (order === EZ3.Euler.ZYX) {
    this._y = Math.asin(-EZ3.Math.clamp(m31, -1, 1));

    if (Math.abs(m31) < 0.99999) {
      this._x = Math.atan2(m32, m33);
      this._z = Math.atan2(m21, m11);
    } else {
      this._x = 0;
      this._z = Math.atan2(-m12, m22);
    }
  } else if (order === EZ3.Euler.YZX) {
    this._z = Math.asin(EZ3.Math.clamp(m21, -1, 1));

    if (Math.abs(m21) < 0.99999) {
      this._x = Math.atan2(-m23, m22);
      this._y = Math.atan2(-m31, m11);
    } else {
      this._x = 0;
      this._y = Math.atan2(m13, m33);
    }
  } else if (order === EZ3.Euler.XZY) {
    this._z = Math.asin(-EZ3.Math.clamp(m12, -1, 1));

    if (Math.abs(m12) < 0.99999) {
      this._x = Math.atan2(m32, m22);
      this._y = Math.atan2(m13, m11);
    } else {
      this._x = Math.atan2(-m23, m33);
      this._y = 0;
    }
  }

  if (update)
    this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Euler#setFromQuaternion
 * @param {EZ3.Quaternion} q
 * @param {Number} [order]
 * @param {Boolean} [update]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.setFromQuaternion = function(q, order, update) {
  return this.setFromRotationMatrix(new EZ3.Matrix4().setFromQuaternion(q), order, update);
};

/**
 * @method EZ3.Euler#setFromVector3
 * @param {EZ3.Vector3} v
 * @param {Number} [order]
 * @return {EZ3.Euler}
 */
EZ3.Euler.prototype.setFromVector3 = function(v, order) {
  return this._set(v.x, v.y, v.z, order);
};

/**
 * @method EZ3.Euler#isEqual
 * @param {EZ3.Euler} e
 * @return {Boolean}
 */
EZ3.Euler.prototype.isEqual = function(e) {
  if (e !== undefined)
    return this._x === e.x && this._y === e.y && this._z === e.z && this._order === e.order;
  else
    return false;
};

/**
 * @method EZ3.Euler#isDiff
 * @param {EZ3.Euler} e
 * @return {Boolean}
 */
EZ3.Euler.prototype.isDiff = function(e) {
  return !this.isEqual(e);
};

/**
 * @method EZ3.Euler#toVector3
 * @return {EZ3.Vector3}
 */
EZ3.Euler.prototype.toVector3 = function() {
  return new EZ3.Vector3(this._x, this._y, this._z);
};

/**
 * @method EZ3.Euler#toString
 * @return {String}
 */
EZ3.Euler.prototype.toString = function() {
  return 'EZ3.Euler[' + this._x + ', ' + this._y + ', ' + this._z + ', ' + this._order + ']';
};

Object.defineProperty(EZ3.Euler.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Euler.prototype, 'order', {
  get: function() {
    return this._order;
  },
  set: function(order) {
    this._order = order;

    this.onChange.dispatch();
  }
});

/**
 * @property {Number} XYZ
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.XYZ = 1;

/**
 * @property {Number} YZX
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.YZX = 2;

/**
 * @property {Number} ZXY
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.ZXY = 3;

/**
 * @property {Number} XZY
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.XZY = 4;

/**
 * @property {Number} YXZ
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.YXZ = 5;

/**
 * @property {Number} ZYX
 * @memberof EZ3.Euler
 * @static
 * @final
 */
EZ3.Euler.ZYX = 6;

/**
 * @class Frustum
 */
EZ3.Frustum = function() {
};

/**
 * Math constants and functions.
 * @class EZ3.Math
 * @static
 */

EZ3.Math = function() {
  /**
   * @property {Number} PI
   * @final
   */
  this.PI = Math.PI;

  /**
   * @property {Number} HALF_PI
   * @final
   */
  this.HALF_PI = this.PI * 0.5;

  /**
   * @property {Number} DOUBLE_PI
   * @final
   */
  this.DOUBLE_PI = 2.0 * this.PI;

  /**
   * @property {Number} MAX_UINT
   * @final
   */
  this.MAX_UINT = Math.pow(2, 32) - 1;

  /**
   * @property {Number} MAX_USHORT
   * @final
   */
  this.MAX_USHORT = Math.pow(2, 16) - 1;
};

EZ3.Math = new EZ3.Math();

/**
 * @method EZ3.Math#isPowerOfTwo
 * @param {Number} x
 * @return {Boolean}
 */
EZ3.Math.isPowerOfTwo = function(x) {
  return (x & (x - 1)) === 0;
};

/**
 * @method EZ3.Math#toRadians
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.toRadians = function(x) {
  return x * EZ3.Math.PI / 180.0;
};

/**
 * @method EZ3.Math#toDegrees
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.toDegrees = function(x) {
  return x * 180.0 / EZ3.Math.PI;
};

/**
 * @method EZ3.Math#nextHighestPowerOfTwo
 * @param {Number} x
 * @return {Number}
 */
EZ3.Math.nextHighestPowerOfTwo = function(x) {
  --x;
  for (var i = 1; i < 32; i <<= 1)
    x = x | x >> i;

  return x + 1;
};

/**
 * @method EZ3.Math#clamp
 * @param {Number} x
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
EZ3.Math.clamp = function(x, min, max) {
  return Math.min(max, Math.max(x, min));
};

/**
 * Representation of a 3x3 matrix.
 * @class EZ3.Matrix3
 * @constructor
 * @param {Number|Number[]} [value]
 */
EZ3.Matrix3 = function(value) {
  /**
   * @property {Number[]} elements
   */
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

/**
 * @method EZ3.Matrix3#add
 * @param {EZ3.Matrix3} m1
 * @param {EZ3.Matrix3} [m2]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.add = function(m1, m2) {
  var em1;
  var em2;

  if (m2 !== undefined) {
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

/**
 * @method EZ3.Matrix3#sub
 * @param {EZ3.Matrix3} m1
 * @param {EZ3.Matrix3} [m2]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.sub = function(m1, m2) {
  var em1;
  var em2;

  if (m2 !== undefined) {
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

/**
 * @method EZ3.Matrix3#scale
 * @param {Number} s
 * @param {EZ3.Matrix3} [m]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.scale = function(s, m) {
  var em;

  if (m !== undefined)
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

/**
 * @method EZ3.Matrix3#mul
 * @param {EZ3.Matrix3} m1
 * @param {EZ3.Matrix3} [m2]
 * @return {EZ3.Matrix3}
 */
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

  return this;
};

/**
 * @method EZ3.Matrix3#transpose
 * @param {EZ3.Matrix3} [m]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.transpose = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var tmp;

  tmp = e[1];
  e[1] = e[3];
  e[3] = tmp;
  tmp = e[2];
  e[2] = e[6];
  e[6] = tmp;
  tmp = e[5];
  e[5] = e[7];
  e[7] = tmp;

  this.elements[0] = e[0];
  this.elements[1] = e[1];
  this.elements[2] = e[2];
  this.elements[3] = e[3];
  this.elements[4] = e[4];
  this.elements[5] = e[5];
  this.elements[6] = e[6];
  this.elements[7] = e[7];
  this.elements[8] = e[8];

  return this;
};

/**
 * @method EZ3.Matrix3#setFromQuaternion
 * @param {EZ3.Quaternion} q
 * @return {EZ3.Matrix3}
 */
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

/**
 * @method EZ3.Matrix3#inverse
 * @param {EZ3.Matrix3} [m]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.inverse = function(m) {
  var e = m.elements;
  var det;

  this.elements[0] = e[10] * e[5] - e[6] * e[9];
  this.elements[1] = -e[10] * e[1] + e[2] * e[9];
  this.elements[2] = e[6] * e[1] - e[2] * e[5];
  this.elements[3] = -e[10] * e[4] + e[6] * e[8];
  this.elements[4] = e[10] * e[0] - e[2] * e[8];
  this.elements[5] = -e[6] * e[0] + e[2] * e[4];
  this.elements[6] = e[9] * e[4] - e[5] * e[8];
  this.elements[7] = -e[9] * e[0] + e[1] * e[8];
  this.elements[8] = e[5] * e[0] - e[1] * e[4];

  det = e[0] * this.elements[0] + e[1] * this.elements[3] + e[2] * this.elements[6];

  if (det === 0)
    return this.identity();

  this.scale(1.0 / det);

  return this;
};

/**
 * @method EZ3.Matrix3#normalFromMat4
 * @param {EZ3.Matrix4} m
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.normalFromMat4 = function(m) {
  this.inverse(m).transpose();

  return this;
};

/**
 * @method EZ3.Matrix3#identity
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.identity = function() {
  this.elements = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  ];

  return this;
};

/**
 * @method EZ3.Matrix3#clone
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.clone = function() {
  return new EZ3.Matrix3(this.elements);
};

/**
 * @method EZ3.Matrix3#copy
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix3.prototype.copy = function(m) {
  this.elements = m.elements;
  return this;
};

/**
 * @method EZ3.Matrix3#toArray
 * @return {Number[]}
 */
EZ3.Matrix3.prototype.toArray = function() {
  return this.elements;
};

/**
 * @method EZ3.Matrix3#toString
 * @return {String}
 */
EZ3.Matrix3.prototype.toString = function() {
  return 'Matrix3[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[3].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + '\n' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + '\n' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + '\n]';
};

/**
 * @method EZ3.Matrix3#isEqual
 * @param {EZ3.Matrix3} m
 * @return {Boolean}
 */
EZ3.Matrix3.prototype.isEqual = function(m) {
  if (m !== undefined) {
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

/**
 * @method EZ3.Matrix3#isDiff
 * @param {EZ3.Matrix3} m
 * @return {Boolean}
 */
EZ3.Matrix3.prototype.isDiff = function(m) {
  return !this.isEqual(m);
};

/**
 * Representation of a 4x4 matrix.
 * @class EZ3.Matrix4
 * @constructor
 * @param {Number|Number[]} [value]
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

/**
 * @method EZ3.Matrix4#transpose
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix4}
 */
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

  return this;
};

/**
 * @method EZ3.Matrix4#inverse
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.inverse = function(m) {
  var te = this.elements;
  var me = (m !== undefined) ? m.elements : this.elements;

  var n11 = me[0];
  var n12 = me[4];
  var n13 = me[8];
  var n14 = me[12];
  var n21 = me[1];
  var n22 = me[5];
  var n23 = me[9];
  var n24 = me[13];
  var n31 = me[2];
  var n32 = me[6];
  var n33 = me[10];
  var n34 = me[14];
  var n41 = me[3];
  var n42 = me[7];
  var n43 = me[11];
  var n44 = me[15];

  te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
  te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
  te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
  te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

  te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
  te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
  te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
  te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;

  te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
  te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
  te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
  te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;

  te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
  te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
  te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
  te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

  var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

  if (!det)
    return this.identity;

  this.multiplyScalar(1 / det);

  return this;
};

/**
 * @method EZ3.Matrix4#multiplyScalar
 * @param {Number} s
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.multiplyScalar = function(s) {
  var te = this.elements;

  te[0] *= s;
  te[4] *= s;
  te[8] *= s;
  te[12] *= s;

  te[1] *= s;
  te[5] *= s;
  te[9] *= s;
  te[13] *= s;

  te[2] *= s;
  te[6] *= s;
  te[10] *= s;
  te[14] *= s;

  te[3] *= s;
  te[7] *= s;
  te[11] *= s;
  te[15] *= s;

  return this;
};

/**
 * @method EZ3.Matrix4#mul
 * @param {EZ3.Matrix4} m1
 * @param {EZ3.Matrix4} [m2]
 * @return {EZ3.Matrix4}
 */
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
    em1 = m2.elements;
    em2 = m1.elements;
  } else {
    em1 = m1.elements;
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

/**
 * @method EZ3.Matrix4#setPosition
 * @param {EZ3.Vector3} v
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.setPosition = function(v, m) {
  var em = (m !== undefined) ? m.elements : this.elements;
  var x = v.x;
  var y = v.y;
  var z = v.z;

  em[12] = x;
  em[13] = y;
  em[14] = z;

  return this;
};

/**
 * @method EZ3.Matrix4#translate
 * @param {EZ3.Vector3} v
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.translate = function(v, m) {
  var em = (m !== undefined) ? m.elements : this.elements;
  var x = v.x;
  var y = v.y;
  var z = v.z;

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

/**
 * @method EZ3.Matrix4#scale
 * @param {EZ3.Vector3} s
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.scale = function(s, m) {
  var x = s.x;
  var y = s.y;
  var z = s.z;
  var em = (m !== undefined) ? m.elements : this.elements;

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

/**
 * @method EZ3.Matrix4#setFromQuaternion
 * @param {EZ3.Quaternion} q
 * @return {EZ3.Matrix4}
 */
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

/**
 * @method EZ3.Matrix4#frustum
 * @param {Number} left
 * @param {Number} right
 * @param {Number} bottom
 * @param {Number} top
 * @param {Number} near
 * @param {Number} far
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
  var te = this.elements;
  var x = 2.0 * near / (right - left);
  var y = 2.0 * near / (top - bottom);

  var a = (right + left) / (right - left);
  var b = (top + bottom) / (top - bottom);
  var c = -(far + near) / (far - near);
  var d = -2.0 * far * near / (far - near);

  te[0] = x;
  te[1] = 0;
  te[2] = 0;
  te[3] = 0;

  te[4] = 0;
  te[5] = y;
  te[6] = 0;
  te[7] = 0;

  te[8] = a;
  te[9] = b;
  te[10] = c;
  te[11] = -1;

  te[12] = 0;
  te[13] = 0;
  te[14] = d;
  te[15] = 0;

  return this;
};

/**
 * @method EZ3.Matrix4#perspective
 * @param {Number} fovy
 * @param {Number} aspect
 * @param {Number} near
 * @param {Number} far
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.perspective = function(fovy, aspect, near, far) {
  var ymax = near * Math.tan(EZ3.Math.toRadians(fovy * 0.5));
  var ymin = -ymax;
  var xmax = ymax * aspect;
  var xmin = ymin * aspect;

  return this.frustum(xmin, xmax, ymin, ymax, near, far);
};

/**
 * @method EZ3.Matrix4#orthographic
 * @param {Number} left
 * @param {Number} right
 * @param {Number} bottom
 * @param {Number} top
 * @param {Number} near
 * @param {Number} far
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.orthographic = function(left, right, top, bottom, near, far) {
  var w = right - left;
  var h = top - bottom;
  var p = far - near;

  var x = (right + left) / w;
  var y = (top + bottom) / h;
  var z = (far + near) / p;

  this.elements[0] = 2.0 / w;
  this.elements[1] = 0.0;
  this.elements[2] = 0.0;
  this.elements[3] = 0.0;

  this.elements[4] = 0.0;
  this.elements[5] = 2.0 / h;
  this.elements[6] = 0.0;
  this.elements[7] = 0.0;

  this.elements[8] = 0.0;
  this.elements[9] = 0.0;
  this.elements[10] = -2.0 / p;
  this.elements[11] = 0.0;

  this.elements[12] = -x;
  this.elements[13] = -y;
  this.elements[14] = -z;
  this.elements[15] = 1.0;

  return this;
};

/**
 * @method EZ3.Matrix4#lookAt
 * @param {EZ3.Vector3} eye
 * @param {EZ3.Vector3} center
 * @param {EZ3.Vector3} up
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.lookAt = function(eye, center, up) {
  var te = this.elements;
  var x = new EZ3.Vector3();
  var y = new EZ3.Vector3();
  var z = new EZ3.Vector3();

  z.sub(eye, center).normalize();

  if (z.length() === 0)
    z.z = 1;

  x.cross(up, z).normalize();

  if (x.length() === 0) {
    z.x += 0.0001;
    x.cross(up, z).normalize();
  }

  y.cross(z, x);

  te[0] = x.x;
  te[1] = y.x;
  te[2] = z.x;
  te[3] = 0.0;

  te[4] = x.y;
  te[5] = y.y;
  te[6] = z.y;
  te[7] = 0.0;

  te[8] = x.z;
  te[9] = y.z;
  te[10] = z.z;
  te[11] = 0.0;

  te[12] = -x.dot(eye);
  te[13] = -y.dot(eye);
  te[14] = -z.dot(eye);
  te[15] = 1.0;

  return this;
};

/**
 * @method EZ3.Matrix4#identity
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.identity = function() {
  this.elements = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
  return this;
};

/**
 * @method EZ3.Matrix4#yawPitchRoll
 * @param {Number} yaw
 * @param {Number} pitch
 * @param {Number} roll
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.yawPitchRoll = function(yaw, pitch, roll) {
  var cosYaw = Math.cos(yaw);
  var sinYaw = Math.sin(yaw);
  var cosRoll = Math.cos(roll);
  var sinRoll = Math.sin(roll);
  var cosPitch = Math.cos(pitch);
  var sinPitch = Math.sin(pitch);

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

/**
 * @method EZ3.Matrix4#determinant
 * @return {Number}
 */
EZ3.Matrix4.prototype.determinant = function() {
  var te = this.elements;
  var n11 = te[0];
  var n21 = te[1];
  var n31 = te[2];
  var n41 = te[3];
  var n12 = te[4];
  var n22 = te[5];
  var n32 = te[6];
  var n42 = te[7];
  var n13 = te[8];
  var n23 = te[9];
  var n33 = te[10];
  var n43 = te[11];
  var n14 = te[12];
  var n24 = te[13];
  var n34 = te[14];
  var n44 = te[15];

  return (
    n41 * (n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
    n42 * (n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
    n43 * (n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
    n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)
  );
};

/**
 * @method EZ3.Matrix4#compose
 * @param {EZ3.Vector3} position
 * @param {EZ3.Vector3} rotation
 * @param {EZ3.Vector3} scale
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.compose = function(position, rotation, scale) {
  this.setFromQuaternion(rotation);
  this.setPosition(position);
  this.scale(scale);

  return this;
};

/**
 * @method EZ3.Matrix4#getPosition
 * @return {EZ3.Vector3}
 */
EZ3.Matrix4.prototype.getPosition = function() {
  var te = this.elements;
  var position = new EZ3.Vector3(te[12], te[13], te[14]);

  return position;
};

/**
 * @method EZ3.Matrix4#getRotation
 * @return {EZ3.Quaternion}
 */
EZ3.Matrix4.prototype.getRotation = function() {
  var scale = this.getScale();
  var matrix = new EZ3.Matrix4(this.elements);
  var iSX;
  var iSY;
  var iSZ;

  if (this.determinant() < 0.0)
    scale.x = -scale.x;

  iSX = 1.0 / scale.x;
  iSY = 1.0 / scale.y;
  iSZ = 1.0 / scale.z;

  matrix.elements[0] *= iSX;
  matrix.elements[1] *= iSX;
  matrix.elements[2] *= iSX;

  matrix.elements[4] *= iSY;
  matrix.elements[5] *= iSY;
  matrix.elements[6] *= iSY;

  matrix.elements[8] *= iSZ;
  matrix.elements[9] *= iSZ;
  matrix.elements[10] *= iSZ;

  return new EZ3.Quaternion().setFromRotationMatrix(matrix);
};

/**
 * @method EZ3.Matrix4#getScale
 * @return {EZ3.Vector3}
 */
EZ3.Matrix4.prototype.getScale = function() {
  var te = this.elements;
  var scale = new EZ3.Vector3();
  var vector = new EZ3.Vector3();

  scale.x = vector.set(te[0], te[1], te[2]).length();
  scale.y = vector.set(te[4], te[5], te[6]).length();
  scale.z = vector.set(te[8], te[9], te[10]).length();

  return scale;
};

/**
 * @method EZ3.Matrix4#clone
 * @return {EZ3.Matrix4}
 */
EZ3.Matrix4.prototype.clone = function() {
  return new EZ3.Matrix4(this.toArray());
};

/**
 * @method EZ3.Matrix4#copy
 * @param {EZ3.Matrix4} m
 * @return {EZ3.Matrix4}
 */
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

/**
 * @method EZ3.Matrix4#toArray
 * @return {Number[]}
 */
EZ3.Matrix4.prototype.toArray = function() {
  return this.elements;
};

/**
 * @method EZ3.Matrix4#toString
 * @return {String}
 */
EZ3.Matrix4.prototype.toString = function() {
  return 'Matrix4[' + '\n' +
    this.elements[0].toFixed(4) + ', ' +
    this.elements[4].toFixed(4) + ', ' +
    this.elements[8].toFixed(4) + ', ' +
    this.elements[12].toFixed(4) + '\n' +
    this.elements[1].toFixed(4) + ', ' +
    this.elements[5].toFixed(4) + ', ' +
    this.elements[9].toFixed(4) + ', ' +
    this.elements[13].toFixed(4) + '\n' +
    this.elements[2].toFixed(4) + ', ' +
    this.elements[6].toFixed(4) + ', ' +
    this.elements[10].toFixed(4) + ', ' +
    this.elements[14].toFixed(4) + '\n' +
    this.elements[3].toFixed(4) + ', ' +
    this.elements[7].toFixed(4) + ', ' +
    this.elements[11].toFixed(4) + ', ' +
    this.elements[15].toFixed(4) + '\n]';
};

/**
 * @method EZ3.Matrix4#toMatrix3
 * @param {EZ3.Matrix4} [m]
 * @return {EZ3.Matrix3}
 */
EZ3.Matrix4.prototype.toMatrix3 = function(m) {
  var e = (m !== undefined) ? m.elements : this.elements;
  var matrix = new EZ3.Matrix3();

  matrix.elements = [
    e[0], e[3], e[6],
    e[1], e[4], e[7],
    e[2], e[5], e[8]
  ];

  return matrix;
};

/**
 * @method EZ3.Matrix4#isEqual
 * @param {EZ3.Matrix4} m
 * @return {EZ3.Boolean}
 */
EZ3.Matrix4.prototype.isEqual = function(m) {
  if (m !== undefined) {
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

/**
 * @method EZ3.Matrix4#isDiff
 * @param {EZ3.Matrix4} m
 * @return {EZ3.Boolean}
 */
EZ3.Matrix4.prototype.isDiff = function(m) {
  return !this.isEqual(m);
};

/**
 * Representation of a quaternion.
 * @class EZ3.Quaternion
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 */

EZ3.Quaternion = function(x, y, z, w) {
  /**
   * @property {Number} x
   * @default 0
   */
  this._x = (x !== undefined) ? x : 0;

  /**
   * @property {Number} y
   * @default 0
   */
  this._y = (y !== undefined) ? y : 0;

  /**
   * @property {Number} z
   * @default 0
   */
  this._z = (z !== undefined) ? z : 0;

  /**
   * @property {Number} w
   * @default 1
   */
  this._w = (w !== undefined) ? w : 1;

  /**
   * @property {EZ3.Signal} onChange
   */
  this.onChange = new EZ3.Signal();
};

EZ3.Quaternion.prototype.constructor = EZ3.Quaternion;

/**
 * @method EZ3.Quaternion#add
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.add = function(q1, q2) {
  if (q2 !== undefined) {
    this._w = q1.w + q2.w;
    this._x = q1.x + q2.x;
    this._y = q1.y + q2.y;
    this._z = q1.z + q2.z;
  } else {
    this._w += q1.w;
    this._x += q1.x;
    this._y += q1.y;
    this._z += q1.z;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#sub
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.sub = function(q1, q2) {
  if (q2 !== undefined) {
    this._w = q1.w - q2.w;
    this._x = q1.x - q2.x;
    this._y = q1.y - q2.y;
    this._z = q1.z - q2.z;
  } else {
    this._w -= q1.w;
    this._x -= q1.x;
    this._y -= q1.y;
    this._z -= q1.z;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#scale
 * @param {Number} s
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.scale = function(s, q) {
  if (q !== undefined) {
    this._x = q.x * s;
    this._y = q.y * s;
    this._z = q.z * s;
    this._w = q.w * s;
  } else {
    this._x *= s;
    this._y *= s;
    this._z *= s;
    this._w *= s;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#mul
 * @param {EZ3.Quaternion} q1
 * @param {EZ3.Quaternion} [q2]
 * @return {EZ3.Quaternion}
 */
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

  if (q2 !== undefined) {
    bx = q2.x;
    by = q2.y;
    bz = q2.z;
    bw = q2.w;
  } else {
    bx = this._x;
    by = this._y;
    bz = this._z;
    bw = this._w;
  }

  this._x = ax * bw + aw * bx + ay * bz - az * by;
  this._y = ay * bw + aw * by + az * bx - ax * bz;
  this._z = az * bw + aw * bz + ax * by - ay * bx;
  this._w = aw * bw - ax * bx - ay * by - az * bz;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#normalize
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.normalize = function(q) {
  var len;
  var s2;
  var x2;
  var y2;
  var z2;

  if (q !== undefined) {
    len = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);

    if (len > 0.0) {
      len = 1.0 / len;
      q.scale(len);

      this._x = q.x;
      this._y = q.y;
      this._z = q.z;
      this._w = q.w;
    } else {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    }
  } else {
    x2 = this._x * this._x;
    y2 = this._y * this._y;
    z2 = this._z * this._z;
    s2 = this._w * this._w;

    len = Math.sqrt(s2 + x2 + y2 + z2);

    if (len > 0.0) {
      len = 1.0 / len;
      this._scale(len);
    } else {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    }
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#inverse
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.inverse = function(q) {
  if (q !== undefined) {
    this._x = -q.x;
    this._y = -q.y;
    this._z = -q.z;
    this._w = q.w;
  } else {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    this._w = this._w;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#length
 * @return {Number}
 */
EZ3.Quaternion.prototype.length = function() {
  var x2 = this._x * this._x;
  var y2 = this._y * this._y;
  var z2 = this._z * this._z;
  var s2 = this._w * this._w;

  return Math.sqrt(s2 + x2 + y2 + z2);
};

/**
 * @method EZ3.Quaternion#copy
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.copy = function(q) {
  this._x = q.x;
  this._y = q.y;
  this._z = q.z;
  this._w = q.w;

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#clone
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.clone = function() {
  return new EZ3.Quaternion(this._x, this._y, this._z, this._w);
};

/**
 * @method EZ3.Quaternion#isEqual
 * @param {EZ3.Quaternion} q
 * @return {Boolean}
 */
EZ3.Quaternion.prototype.isEqual = function(q) {
  if (q !== undefined)
    return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;
  else
    return false;
};

/**
 * @method EZ3.Quaternion#isDiff
 * @param {EZ3.Quaternion} q
 * @return {Boolean}
 */
EZ3.Quaternion.prototype.isDiff = function(q) {
  return !this.isEqual(q);
};

/**
 * @method EZ3.Quaternion#setFromAxisAngle
 * @param {EZ3.Vector3} axis
 * @param {Number} angle
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromAxisAngle = function(axis, angle) {
  var sin2 = Math.sin(0.5 * angle);

  this._x = sin2 * axis.x;
  this._y = sin2 * axis.y;
  this._z = sin2 * axis.z;
  this._w = Math.cos(0.5 * angle);

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#setFromRotationMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromRotationMatrix = function(m) {
  var te = m.elements;
  var m11 = te[0];
  var m12 = te[4];
  var m13 = te[8];
  var m21 = te[1];
  var m22 = te[5];
  var m23 = te[9];
  var m31 = te[2];
  var m32 = te[6];
  var m33 = te[10];
  var trace = m11 + m22 + m33;
  var s;

  if (trace > 0) {
    s = 0.5 / Math.sqrt(trace + 1.0);

    this._w = 0.25 / s;
    this._x = (m32 - m23) * s;
    this._y = (m13 - m31) * s;
    this._z = (m21 - m12) * s;
  } else if (m11 > m22 && m11 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

    this._w = (m32 - m23) / s;
    this._x = 0.25 * s;
    this._y = (m12 + m21) / s;
    this._z = (m13 + m31) / s;
  } else if (m22 > m33) {
    s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

    this._w = (m13 - m31) / s;
    this._x = (m12 + m21) / s;
    this._y = 0.25 * s;
    this._z = (m23 + m32) / s;
  } else {
    s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

    this._w = (m21 - m12) / s;
    this._x = (m13 + m31) / s;
    this._y = (m23 + m32) / s;
    this._z = 0.25 * s;
  }

  this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#setFromEuler
 * @param {EZ3.Euler} euler
 * @param {Boolean} update
 * @return {EZ3.Quaternion}
 */
EZ3.Quaternion.prototype.setFromEuler = function(euler, update) {
  var c1 = Math.cos(euler.x / 2);
  var c2 = Math.cos(euler.y / 2);
  var c3 = Math.cos(euler.z / 2);
  var s1 = Math.sin(euler.x / 2);
  var s2 = Math.sin(euler.y / 2);
  var s3 = Math.sin(euler.z / 2);

  var order = euler.order;

  if (order === EZ3.Euler.XYZ) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.YXZ) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  } else if (order === EZ3.Euler.ZXY) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.ZYX) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  } else if (order === EZ3.Euler.YZX) {
    this._x = s1 * c2 * c3 + c1 * s2 * s3;
    this._y = c1 * s2 * c3 + s1 * c2 * s3;
    this._z = c1 * c2 * s3 - s1 * s2 * c3;
    this._w = c1 * c2 * c3 - s1 * s2 * s3;
  } else if (order === EZ3.Euler.XZY) {
    this._x = s1 * c2 * c3 - c1 * s2 * s3;
    this._y = c1 * s2 * c3 - s1 * c2 * s3;
    this._z = c1 * c2 * s3 + s1 * s2 * c3;
    this._w = c1 * c2 * c3 + s1 * s2 * s3;
  }

  if (update)
    this.onChange.dispatch();

  return this;
};

/**
 * @method EZ3.Quaternion#toMatrix3
 * @param {Number} mode
 * @param {EZ3.Quaternion} [q]
 * @return {EZ3.Matrix3}
 */
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

  if (q !== undefined) {
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
    yy2 = 2.0 * this._y * this._y;
    xy2 = 2.0 * this._x * this._y;
    xz2 = 2.0 * this._x * this._z;
    yz2 = 2.0 * this._y * this._z;
    zz2 = 2.0 * this._z * this._z;
    wz2 = 2.0 * this._w * this._z;
    wy2 = 2.0 * this._w * this._y;
    wx2 = 2.0 * this._w * this._x;
    xx2 = 2.0 * this._x * this._x;
  }

  matrix.elements[0] = -yy2 - zz2 + 1.0;
  matrix.elements[1] = xy2 - mode * wz2;
  matrix.elements[2] = xz2 + mode * wy2;
  matrix.elements[3] = xy2 + mode * wz2;

  matrix.elements[4] = -xx2 - zz2 + 1.0;
  matrix.elements[5] = yz2 - mode * wx2;
  matrix.elements[6] = xz2 - mode * wy2;
  matrix.elements[7] = yz2 + mode * wx2;

  matrix.elements[8] = -xx2 - yy2 + 1.0;

  return matrix;
};

/**
 * @method EZ3.Quaternion#toString
 * @return {String}
 */
EZ3.Quaternion.prototype.toString = function() {
  var x = this._x.toFixed(4);
  var y = this._y.toFixed(4);
  var z = this._z.toFixed(4);
  var w = this._w.toFixed(4);

  return 'Quaternion[' + x + ', ' + y + ', ' + z + ', ' + w + ' ]';
};

Object.defineProperty(EZ3.Quaternion.prototype, 'x', {
  get: function() {
    return this._x;
  },
  set: function(x) {
    this._x = x;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'y', {
  get: function() {
    return this._y;
  },
  set: function(y) {
    this._y = y;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'z', {
  get: function() {
    return this._z;
  },
  set: function(z) {
    this._z = z;

    this.onChange.dispatch();
  }
});

Object.defineProperty(EZ3.Quaternion.prototype, 'w', {
  get: function() {
    return this._w;
  },
  set: function(w) {
    this._w = w;

    this.onChange.dispatch();
  }
});

/**
 * Representation of a 2D vector.
 * @class EZ3.Vector2
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 */
EZ3.Vector2 = function(x, y) {
  /**
   * @property {Number} x
   * @default 0
   */

  /**
   * @property {Number} y
   * @default 0
   */

  if (x !== undefined) {
    this.x = x;
    this.y = (y !== undefined) ? y : x;
  } else {
    this.x = 0.0;
    this.y = 0.0;
  }
};

EZ3.Vector2.prototype.constructor = EZ3.Vector2;

/**
 * @method EZ3.Vector2#add
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
  } else {
    this.x += v1.x;
    this.y += v1.y;
  }

  return this;
};

/**
 * @method EZ3.Vector2#sub
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
  } else {
    this.x -= v1.x;
    this.y -= v1.y;
  }
  return this;
};

/**
 * @method EZ3.Vector2#set
 * @param {Number} x
 * @param {Number} y
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.set = function(x, y) {
  this.x = x;
  this.y = y;

  return this;
};

/**
 * @method EZ3.Vector2#scale
 * @param {Number} s
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.scale = function(s, v) {
  if (v !== undefined) {
    this.x = v.x * s;
    this.y = v.y * s;
  } else {
    this.x *= s;
    this.y *= s;
  }

  return this;
};

/**
 * @method EZ3.Vector2#dot
 * @param {EZ3.Vector2} [v]
 * @return {Number}
 */
EZ3.Vector2.prototype.dot = function(v) {
  if (v !== undefined)
    return v.x * this.x + v.y * this.y;
  else
    return -1;
};

/**
 * @method EZ3.Vector2#max
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
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

/**
 * @method EZ3.Vector2#min
 * @param {EZ3.Vector2} v1
 * @param {EZ3.Vector2} [v2]
 * @return {EZ3.Vector2}
 */
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

/**
 * @method EZ3.Vector2#length
 * @return {Number}
 */
EZ3.Vector2.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector2#normalize
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      l = 1.0 / l;
      v.scale(l);
      this.x = v.x;
      this.y = v.y;
    } else {
      this.x = 0;
      this.y = 0;
    }
  } else {
    l = this.length();

    if (l > 0) {
      l = 1.0 / l;
      this.scale(l);
    } else {
      this.x = 0;
      this.y = 0;
    }
  }

  return this;
};

/**
 * @method EZ3.Vector2#negate
 * @param {EZ3.Vector2} [v]
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.negate = function(v) {
  if (v !== undefined) {
    this.x = -v.x;
    this.y = -v.y;
  } else {
    this.x = -this.x;
    this.y = -this.y;
  }

  return this;
};

/**
 * @method EZ3.Vector2#copy
 * @param {EZ3.Vector2} v
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;

  return this;
};

/**
 * @method EZ3.Vector2#clone
 * @return {EZ3.Vector2}
 */
EZ3.Vector2.prototype.clone = function() {
  return new EZ3.Vector2(this.x, this.y);
};

/**
 * @method EZ3.Vector2#isEqual
 * @param {EZ3.Vector2} v
 * @return {Boolean}
 */
EZ3.Vector2.prototype.isEqual = function(v) {
  if (v !== undefined)
    return (this.x === v.x) && (this.y === v.y);
  else
    return false;
};

/**
 * @method EZ3.Vector2#isDiff
 * @param {EZ3.Vector2} v
 * @return {Boolean}
 */
EZ3.Vector2.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector2#isZeroVector
 * @param {EZ3.Vector2} v
 * @return {Boolean}
 */
EZ3.Vector2.prototype.isZeroVector = function(v) {
  if (v !== undefined)
    return ((v.x === 0.0) && (v.y === 0.0));
  else
    return ((this.x === 0.0) && (this.y === 0.0));
};

/**
 * @method EZ3.Vector2#toArray
 * @return {Number[]}
 */
EZ3.Vector2.prototype.toArray = function() {
  return [this.x, this.y];
};

/**
 * @method EZ3.Vector2#toString
 * @return {String}
 */
EZ3.Vector2.prototype.toString = function() {
  return 'Vector2[' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ']';
};

/**
 * Representation of a 3D vector.
 * @class EZ3.Vector3
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 */
EZ3.Vector3 = function(x, y, z) {
  /**
   * @property {Number} x
   * @default 0
   */

  /**
   * @property {Number} y
   * @default 0
   */

   /**
    * @property {Number} z
    * @default 0
    */

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

/**
 * @method EZ3.Vector3#add
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
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

/**
 * @method EZ3.Vector3#sub
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
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

/**
 * @method EZ3.Vector3#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  return this;
};

/**
 * @method EZ3.Vector3#scale
 * @param {Number} s
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.scale = function(s, v) {
  if (v !== undefined) {
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

/**
 * @method EZ3.Vector3#dot
 * @param {EZ3.Vector3} v
 * @return {Number}
 */
EZ3.Vector3.prototype.dot = function(v) {
  if (v !== undefined)
    return v.x * this.x + v.y * this.y + v.z * this.z;
  else
    return -1;
};

/**
 * @method EZ3.Vector3#max
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
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

/**
 * @method EZ3.Vector3#min
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
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

/**
 * @method EZ3.Vector3#cross
 * @param {EZ3.Vector3} v1
 * @param {EZ3.Vector3} [v2]
 * @return {EZ3.Vector3}
 */
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

/**
 * @method EZ3.Vector3#mulMatrix3
 * @param {EZ3.Matrix3} m
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.mulMatrix3 = function(m, v) {
  var e;
  var x;
  var y;
  var z;

  if (m !== undefined) {
    e = m.elements;

    if (v !== undefined) {
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
  } else {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  return this;
};

/**
 * @method EZ3.Vector3#mulQuaternion
 * @param {EZ3.Vector3} q
 * @return {EZ3.Vector3}
 */
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

/**
 * @method EZ3.Vector3#length
 * @return {Number}
 */
EZ3.Vector3.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector3#normalize
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this;
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    }
  }
};

/**
 * @method EZ3.Vector3#negate
 * @param {EZ3.Vector3} [v]
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.negate = function(v) {
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

/**
 * @method EZ3.Vector3#clone
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.clone = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

/**
 * @method EZ3.Vector3#copy
 * @param {EZ3.Vector3} v
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;

  return this;
};

/**
 * @method EZ3.Vector3#setPositionFromWorldMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.setPositionFromWorldMatrix = function(m) {
  if (m !== undefined) {
    this.x = m.elements[12];
    this.y = m.elements[13];
    this.z = m.elements[14];
  }

  return this;
};

/**
 * @method EZ3.Vector3#setFromViewProjectionMatrix
 * @param {EZ3.Matrix3} m
 * @return {EZ3.Vector3}
 */
EZ3.Vector3.prototype.setFromViewProjectionMatrix = function(m) {
  var e = m.elements;
  var x = this.x;
  var y = this.y;
  var z = this.z;
  var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
  this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
  this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

  return this;
};

/**
 * @method EZ3.Vector3#isEqual
 * @param {EZ3.Vector3} v
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isEqual = function(v) {
  if (v !== undefined)
    return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
  else
    return false;
};

/**
 * @method EZ3.Vector3#isZeroVector
 * @param {EZ3.Vector3} [v]
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isZeroVector = function(v) {
  if (v !== undefined)
    return (v.x === 0.0) && (v.y === 0.0) && (v.z === 0.0);
  else
    return (this.x === 0.0) && (this.y === 0.0) && (this.z === 0.0);
};

/**
 * @method EZ3.Vector3#isDiff
 * @param {EZ3.Vector3} v
 * @return {Boolean}
 */
EZ3.Vector3.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector3#toArray
 * @return {Number[]}
 */
EZ3.Vector3.prototype.toArray = function() {
  return [this.x, this.y, this.z];
};

/**
 * @method EZ3.Vector3#toString
 * @return {String}
 */
EZ3.Vector3.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);

  return 'Vector3[' + x + ', ' + y + ', ' + z + ']';
};

/**
 * @method EZ3.Vector3#toVector2
 * @return {EZ3.Vector2}
 */
EZ3.Vector3.prototype.toVector2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

/**
 * Representation of a 4D vector.
 * @class EZ3.Vector4
 * @constructor
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 */

EZ3.Vector4 = function(x, y, z, w) {
  /**
   * @property {Number} x
   * @default 0
   */

  /**
   * @property {Number} y
   * @default 0
   */

  /**
   * @property {Number} z
   * @default 0
   */

  /**
   * @property {Number} z
   * @default 0
   */


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

/**
 * @method EZ3.Vector4#add
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.add = function(v1, v2) {
  if (v2 !== undefined) {
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

/**
 * @method EZ3.Vector4#sub
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.sub = function(v1, v2) {
  if (v2 !== undefined) {
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

/**
 * @method EZ3.Vector4#set
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} w
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.set = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

/**
 * @method EZ3.Vector4#scale
 * @param {Number} s
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.scale = function(s, v) {
  if (v !== undefined) {
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

/**
 * @method EZ3.Vector4#dot
 * @param {EZ3.Vector4} [v]
 * @return {Number}
 */
EZ3.Vector4.prototype.dot = function(v) {
  if (v !== undefined)
    return v.x * this.x + v.y * this.y + v.z * this.z + v.w * this.w;
  else
    return -1;
};

/**
 * @method EZ3.Vector4#max
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
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

/**
 * @method EZ3.Vector4#min
 * @param {EZ3.Vector4} v1
 * @param {EZ3.Vector4} [v2]
 * @return {EZ3.Vector4}
 */
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

/**
 * @method EZ3.Vector4#mulMatrix4
 * @param {EZ3.Matrix4} m
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.mulMatrix4 = function(m, v) {
  var x;
  var y;
  var z;
  var w;
  var e;

  if (m !== undefined) {
    e = m.elements;

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
  } else {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }

  return this;
};

/**
 * @method EZ3.Vector4#length
 * @return {Number}
 */
EZ3.Vector4.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

/**
 * @method EZ3.Vector4#normalize
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.normalize = function(v) {
  var l;

  if (v !== undefined) {
    l = v.length();

    if (l > 0) {
      v.scale(1.0 / l);

      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    }
  } else {
    l = this.length();

    if (l > 0) {
      this.scale(1.0 / l);

      return this;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 0;
    }
  }

  return this;
};

/**
 * @method EZ3.Vector4#negate
 * @param {EZ3.Vector4} [v]
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.negate = function(v) {
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

/**
 * @method EZ3.Vector4#copy
 * @param {EZ3.Vector4} v
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.copy = function(v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
  this.w = v.w;

  return this;
};

/**
 * @method EZ3.Vector4#clone
 * @return {EZ3.Vector4}
 */
EZ3.Vector4.prototype.clone = function() {
  return new EZ3.Vector4(this.x, this.y, this.z, this.w);
};

/**
 * @method EZ3.Vector4#isEqual
 * @param {EZ3.Vector4} v
 * @return {Boolean}
 */
EZ3.Vector4.prototype.isEqual = function(v) {
  if (v !== undefined)
    return this.x === v.x && this.y === v.y && this.z === v.z && this.w === v.w;
  else
    return false;
};

/**
 * @method EZ3.Vector4#isZeroVector
 * @param {EZ3.Vector4} [v]
 * @return {Boolean}
 */
EZ3.Vector4.prototype.isZeroVector = function(v) {
  var ex;
  var ey;
  var ez;
  var ew;

  if (v !== undefined) {
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

/**
 * @method EZ3.Vector4#isDiff
 * @param {EZ3.Vector4} v
 * @return {Boolean}
 */
EZ3.Vector4.prototype.isDiff = function(v) {
  return !this.isEqual(v);
};

/**
 * @method EZ3.Vector4#toArray
 * @return {Number[]}
 */
EZ3.Vector4.prototype.toArray = function() {
  return [this.x, this.y, this.z, this.w];
};

/**
 * @method EZ3.Vector4#toString
 * @return {String}
 */
EZ3.Vector4.prototype.toString = function() {
  var x = this.x.toFixed(4);
  var y = this.y.toFixed(4);
  var z = this.z.toFixed(4);
  var w = this.w.toFixed(4);

  return 'Vector4[' + x + ', ' + y + ', ' + z + ', ' + w + ']';
};

/**
 * @method EZ3.Vector4#toVector2
 * @return {EZ3.Vector2}
 */
EZ3.Vector4.prototype.toVector2 = function() {
  return new EZ3.Vector2(this.x, this.y);
};

/**
 * @method EZ3.Vector4#toVector3
 * @return {EZ3.Vector3}
 */
EZ3.Vector4.prototype.toVector3 = function() {
  return new EZ3.Vector3(this.x, this.y, this.z);
};

/**
 * @class Mesh
 * @extends Entity
 */

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.normal = new EZ3.Matrix3();
  this.geometry = geometry || new EZ3.Geometry();
  this.material = material || new EZ3.MeshMaterial();

  this.shadowCaster = false;
  this.shadowReceiver = false;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.updateProgram = function(gl, state, lights) {
  this.material.updateProgram(gl, state, lights, this.shadowReceiver);
};

EZ3.Mesh.prototype.updateLinearData = function() {
  if (this.material.fill === EZ3.Material.WIREFRAME)
    this.geometry.updateLinearData();
};

EZ3.Mesh.prototype.updateNormal = function() {
  if (this.world.isDiff(this._cache.world)) {
    this.normal.normalFromMat4(this.world);
    this._cache.world = this.world.clone();
  }
};

EZ3.Mesh.prototype.render = function(gl, attributes, state, extensions) {
  var mode;
  var index;
  var buffer;

  if (this.material.fill === EZ3.Material.WIREFRAME) {
    index = EZ3.IndexBuffer.LINEAR;
    buffer = this.geometry.buffers.getLinearBuffer();
    mode = gl.LINES;
  } else if (this.material.fill === EZ3.Material.POINTS) {
    buffer = this.geometry.buffers.getPositionBuffer();
    mode = gl.POINTS;
  } else {
    index = EZ3.IndexBuffer.TRIANGULAR;
    buffer = this.geometry.buffers.getTriangularBuffer();
    mode = gl.TRIANGLES;
  }

  if (index) {
    this.geometry.buffers.bind(gl, attributes, state, extensions, index);
    gl.drawElements(mode, buffer.data.length, buffer.getGLType(gl, extensions), 0);
  } else {
    this.geometry.buffers.bind(gl, attributes, state, extensions);
    gl.drawArrays(mode, 0, buffer.data.length / 3);
  }
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
    } else if (data instanceof EZ3.Vector2 && data.isDiff(this._cache[name])) {
      gl.uniform2iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && data.isDiff(this._cache[name])) {
      gl.uniform3iv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && data.isDiff(this._cache[name])) {
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
    } else if (data instanceof EZ3.Vector2 && data.isDiff(this._cache[name])) {
      gl.uniform2fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector3 && data.isDiff(this._cache[name])) {
      gl.uniform3fv(location, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Vector4 && data.isDiff(this._cache[name])) {
      gl.uniform4fv(location, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, data) {
  var location = this.uniforms[name];

  if (location) {
    if (data instanceof EZ3.Matrix3 && data.isDiff(this._cache[name])) {
      gl.uniformMatrix3fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    } else if (data instanceof EZ3.Matrix4 && data.isDiff(this._cache[name])) {
      gl.uniformMatrix4fv(location, false, data.toArray());
      this._cache[name] = data.clone();
    }
  }
};

EZ3.GLSLProgram.prototype.loadUniformSamplerArray = function(gl, name, data) {
  var location = this.uniforms[name];

  if(location) {
    if(data instanceof Array && this._cache[name] !== data.toString()) {
      this._cache[name] = data.toString();
      gl.uniform1iv(location, data);
    }
  }
};

EZ3.GLSLProgram.VERTEX = 0;
EZ3.GLSLProgram.FRAGMENT = 1;

/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.canvas = canvas;
  this.options = options;
  this.context = null;
  this.state = null;
  this.extensions = null;
  this.capabilities = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._renderMesh = function(mesh, camera, lights) {
  var gl = this.context;
  var program = mesh.material.program;
  var modelView = new EZ3.Matrix4();
  var light;
  var i;

  this.state.bindProgram(program);

  mesh.material.updateStates(gl, this.state);
  mesh.material.updateUniforms(gl, this.state, this.capabilities);

  modelView.mul(camera.view, mesh.world);

  program.loadUniformFloat(gl, 'uEyePosition', camera.position);
  program.loadUniformMatrix(gl, 'uModel', mesh.world);
  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', camera.projection);
  program.loadUniformMatrix(gl, 'uNormal', mesh.normal);

  for (i = 0; i < lights.spot.length; i++) {
    light = lights.spot[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.spot.length);
  }

  for (i = 0; i < lights.point.length; i++) {
    light = lights.point[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.point.length);
  }

  for (i = 0; i < lights.directional.length; i++) {
    light = lights.directional[i];
    light.updateUniforms(gl, this.state, this.capabilities, program, i, mesh.shadowReceiver, lights.directional.length);
  }

  mesh.render(gl, program.attributes, this.state, this.extensions);

  this.state.usedTextureSlots = 0;
};

EZ3.Renderer.prototype._renderMeshDepth = function(program, mesh, view, projection) {
  var gl = this.context;
  var modelView = new EZ3.Matrix4();

  modelView.mul(view, mesh.world);

  program.loadUniformMatrix(gl, 'uModelView', modelView);
  program.loadUniformMatrix(gl, 'uProjection', projection);

  mesh.render(gl, program.attributes, this.state, this.extensions);
};

EZ3.Renderer.prototype._renderOmnidirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var target = new EZ3.Vector3();
  var up = new EZ3.Vector3();
  var view = new EZ3.Matrix4();
  var position;
  var light;
  var i;
  var j;
  var k;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];
    position = light.getWorldPosition();

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

    for (j = 0; j < 6; j++) {
      switch (j) {
        case EZ3.Cubemap.POSITIVE_X:
          target.set(1, 0, 0);
          up.set(0, -1, 0);
          break;
        case EZ3.Cubemap.NEGATIVE_X:
          target.set(-1, 0, 0);
          up.set(0, -1, 0);
          break;
        case EZ3.Cubemap.POSITIVE_Y:
          target.set(0, 1, 0);
          up.set(0, 0, 1);
          break;
        case EZ3.Cubemap.NEGATIVE_Y:
          target.set(0, -1, 0);
          up.set(0, 0, -1);
          break;
        case EZ3.Cubemap.POSITIVE_Z:
          target.set(0, 0, 1);
          up.set(0, -1, 0);
          break;
        case EZ3.Cubemap.NEGATIVE_Z:
          target.set(0, 0, -1);
          up.set(0, -1, 0);
          break;
      }

      view.lookAt(position, target.add(position.clone()), up);

      light.depthFramebuffer.texture.attach(gl, j);

      this.clear();

      for (k = 0; k < meshes.length; k++)
        this._renderMeshDepth(program, meshes[k], view, light.projection);
    }
  }
};

EZ3.Renderer.prototype._renderDirectionalDepth = function(program, meshes, lights) {
  var gl = this.context;
  var light;
  var i;
  var j;

  for (i = 0; i < lights.length; i++) {
    light = lights[i];

    light.depthFramebuffer.bind(gl, this.state);
    light.depthFramebuffer.update(gl);

    this.clear();

    for (j = 0; j < meshes.length; j++)
      this._renderMeshDepth(program, meshes[j], light.view, light.projection);
  }
};

EZ3.Renderer.prototype._renderDepth = function(meshes, lights) {
  var gl = this.context;
  var vertex;
  var fragment;
  var program;

  this.state.disable(gl.BLEND);

  this.state.enable(gl.CULL_FACE);
  this.state.cullFace(gl.FRONT);

  if (!this.state.programs.depth) {
    vertex = EZ3.ShaderLibrary.depth.vertex;
    fragment = EZ3.ShaderLibrary.depth.fragment;
    this.state.programs.depth = new EZ3.GLSLProgram(gl, vertex, fragment);
  }

  program = this.state.programs.depth;

  this.state.bindProgram(program);

  this._renderDirectionalDepth(program, meshes, lights.directional);
  this._renderDirectionalDepth(program, meshes, lights.spot);
  this._renderOmnidirectionalDepth(program, meshes, lights.point);

  EZ3.Framebuffer.unbind(gl);
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

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options.');

  this.state = new EZ3.RendererState(this.context);
  this.extensions = new EZ3.RendererExtensions(this.context);
  this.capabilities = new EZ3.RendererCapabilities(this.context);

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);
};

EZ3.Renderer.prototype.clearColor = function(color) {
  var gl = this.context;

  gl.clearColor(color.x, color.y, color.z, color.w);
};

EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

EZ3.Renderer.prototype.render = function(position, size, scene, camera) {
  var gl = this.context;
  var meshes = {
    common: [],
    opaque: [],
    transparent: [],
    shadowCasters: []
  };
  var lights = {
    point: [],
    directional: [],
    spot: [],
    empty: true
  };
  var mesh;
  var depth;
  var viewProjection;
  var i;

  scene.updateWorldTraverse();

  scene.traverse(function(entity) {
    if (entity instanceof EZ3.Light) {
      lights.empty = false;

      entity.updateProjection();

      if (entity instanceof EZ3.PointLight)
        lights.point.push(entity);
      else if (entity instanceof EZ3.DirectionalLight) {
        entity.updateView();
        lights.directional.push(entity);
      } else if (entity instanceof EZ3.SpotLight) {
        entity.updateView();
        lights.spot.push(entity);
      }
    } else if (entity instanceof EZ3.Mesh && entity.material.visible)
      meshes.common.push(entity);
  });

  if (!camera.parent)
    camera.updateWorld();

  camera.updateView();
  camera.updateProjection();

  viewProjection = new EZ3.Matrix4().mul(camera.projection, camera.view);

  for (i = 0; i < meshes.common.length; i++) {
    mesh = meshes.common[i];
    depth = new EZ3.Vector3().setPositionFromWorldMatrix(mesh.world).setFromViewProjectionMatrix(viewProjection).z;

    if (mesh.geometry instanceof EZ3.Primitive)
      mesh.geometry.updateCommonData();

    mesh.updateLinearData();

    if (!lights.empty) {
      mesh.geometry.updateNormalData();
      mesh.updateNormal();
    }

    mesh.updateProgram(gl, this.state, lights);

    if (mesh.material.transparent)
      meshes.transparent.push({
        mesh: mesh,
        depth: depth
      });
    else
      meshes.opaque.push({
        mesh: mesh,
        depth: depth
      });

    if (mesh.shadowCaster)
      meshes.shadowCasters.push(mesh);
  }

  meshes.opaque.sort(function(a, b) {
    if (a.depth !== b.depth)
      return a.depth - b.depth;
  });

  meshes.transparent.sort(function(a, b) {
    if (a.depth !== b.depth)
      return b.depth - a.depth;
  });

  if (meshes.shadowCasters.length && !lights.empty)
    this._renderDepth(meshes.shadowCasters, lights);

  this.state.viewport(position, size);

  for (i = 0; i < meshes.opaque.length; i++)
    this._renderMesh(meshes.opaque[i].mesh, camera, lights);

  for (i = 0; i < meshes.transparent.length; i++)
    this._renderMesh(meshes.transparent[i].mesh, camera, lights);
};

/**
 * @class RendererCapabilities
 */

EZ3.RendererCapabilities = function(gl) {
  this.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) - 1;
};

/**
 * @class RendererExtensions
 */

EZ3.RendererExtensions = function(gl) {
  this.elementIndexUInt = gl.getExtension('OES_element_index_uint');
  this.vertexArrayObject = gl.getExtension('OES_vertex_array_object');
  this.standardDerivates = gl.getExtension('OES_standard_derivatives');
};

/**
 * @class RendererState
 */

EZ3.RendererState = function(context) {
  this._context = context;
  this._states = {};
  this._blendEquation = {};
  this._blendFunc = {};
  this._textureSlots = {};
  this._attributeLayouts = {};
  this._viewport = {};
  this._program = null;
  this._cullFace = null;
  this._depthFunc = null;
  this._textureSlot = null;

  this.programs = {};
  this.usedTextureSlots = 0;
  this.textureArraySlots = [];
};

EZ3.RendererState.prototype.constructor = EZ3.State;

EZ3.RendererState.prototype.enable = function(state) {
  var gl = this._context;

  if (!this._states[state]) {
    this._states[state] = true;

    gl.enable(state);
  }
};

EZ3.RendererState.prototype.disable = function(state) {
  var gl = this._context;

  if (this._states[state]) {
    this._states[state] = false;

    gl.disable(state);
  }
};

EZ3.RendererState.prototype.enableVertexAttribArray = function(layout) {
  var gl = this._context;

  if (!this._attributeLayouts[layout]) {
    gl.enableVertexAttribArray(layout);
    this._attributeLayouts[layout] = true;
  }
};

EZ3.RendererState.prototype.createProgram = function(id, vertex, fragment, prefix) {
  var gl = this._context;

  if (!this.programs[id])
    this.programs[id] = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);

  return this.programs[id];
};

EZ3.RendererState.prototype.bindProgram = function(program) {
  var gl = this._context;

  if (this._program !== program) {
    this._program = program;

    program.bind(gl);
  }
};

EZ3.RendererState.prototype.bindTexture = function(target, id) {
  var gl = this._context;
  var slot = gl.TEXTURE0 + this.usedTextureSlots;
  var changed;

  if (this._textureSlot !== slot) {
    gl.activeTexture(slot);
    this._textureSlot = slot;
  }

  if (!this._textureSlots[slot]) {
    this._textureSlots[slot] = {
      id: id,
      target: target
    };

    gl.bindTexture(target, id);
  } else {
    changed = false;

    if (this._textureSlots[slot].id !== id) {
      this._textureSlots[slot].id = id;
      changed = true;
    }

    if (this._textureSlots[slot].target !== target) {
      this._textureSlots[slot].target = target;
      changed = true;
    }

    if (changed)
      gl.bindTexture(target, id);
  }
};

EZ3.RendererState.prototype.viewport = function(position, size) {
  var gl = this._context;
  var changed = false;

  if (position.isDiff(this._viewport.position)) {
    this._viewport.position = position.clone();
    changed = true;
  }

  if (size.isDiff(this._viewport.size)) {
    this._viewport.size = size.clone();
    changed = true;
  }

  if (changed)
    gl.viewport(position.x, position.y, size.x, size.y);
};

EZ3.RendererState.prototype.depthFunc = function(func) {
  var gl = this._context;

  if (this._depthFunc !== func) {
    this._depthFunc = func;

    gl.depthFunc(func);
  }
};

EZ3.RendererState.prototype.cullFace = function(face) {
  var gl = this._context;

  if (this._cullFace !== face) {
    this._cullFace = face;

    gl.cullFace(face);
  }
};

EZ3.RendererState.prototype.blendEquation = function(modeRGB, modeAlpha) {
  var gl = this._context;
  var changed = false;

  modeAlpha = (modeAlpha !== undefined) ? modeAlpha : modeRGB;

  if (this._blendEquation.modeRGB !== modeRGB) {
    this._blendEquation.modeRGB = modeRGB;
    changed = true;
  }

  if (this._blendEquation.modeAlpha !== modeAlpha) {
    this._blendEquation.modeAlpha = modeAlpha;
    changed = true;
  }

  if (changed)
    gl.blendEquationSeparate(modeRGB, modeAlpha);
};

EZ3.RendererState.prototype.blendFunc = function(srcRGB, dstRGB, srcAlpha, dstAlpha) {
  var gl = this._context;
  var changed = false;

  srcAlpha = (srcAlpha !== undefined) ? srcAlpha : srcRGB;
  dstAlpha = (dstAlpha !== undefined) ? dstAlpha : dstRGB;

  if (this._blendFunc.srcRGB !== srcRGB) {
    this._blendFunc.srcRGB = srcRGB;
    changed = true;
  }

  if (this._blendFunc.dstRGB !== dstRGB) {
    this._blendFunc.dstRGB = dstRGB;
    changed = true;
  }

  if (this._blendFunc.srcAlpha !== srcAlpha) {
    this._blendFunc.srcAlpha = srcAlpha;
    changed = true;
  }

  if (this._blendFunc.dstAlpha !== dstAlpha) {
    this._blendFunc.dstAlpha = dstAlpha;
    changed = true;
  }

  if (changed)
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
};

/**
* @class ShaderLibrary
*/

EZ3.ShaderLibrary = function() {
  this.mesh = {};
  this.depth = {};
};

EZ3.ShaderLibrary = new EZ3.ShaderLibrary();

EZ3.ShaderLibrary['depth'].vertex = "precision highp float;\n\nattribute vec3 position;\n\nuniform mat4 uModelView;\nuniform mat4 uProjection;\n\nvoid main() {\n  gl_Position = uProjection * uModelView * vec4(position, 1.0);\n}\n";
EZ3.ShaderLibrary['mesh'].vertex = "precision highp float;\r\n\r\nattribute vec3 position;\r\nattribute vec3 normal;\r\nattribute vec2 uv;\r\n\r\nattribute vec3 morph1;\r\nattribute vec3 morph2;\r\n\r\nuniform mat4 uModel;\r\nuniform mat3 uNormal;\r\nuniform mat4 uModelView;\r\nuniform mat4 uProjection;\r\n\r\n#ifdef MORPH_TARGET\r\n  uniform float uInfluence1;\r\n  uniform float uInfluence2;\r\n#endif\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n  vec3 transformed = position;\r\n\r\n  #ifdef MORPH_TARGET\r\n    transformed += (morph1 - position) * uInfluence1;\r\n    transformed += (morph2 - position) * uInfluence2;\r\n  #endif\r\n\r\n  vPosition = vec3(uModel * vec4(transformed, 1.0));\r\n  vNormal = normalize(uNormal * normal);\r\n  vUv = uv;\r\n\r\n\r\n  gl_PointSize = 3.0;\r\n  gl_Position = uProjection * uModelView * vec4(transformed, 1.0);\r\n}\r\n";
EZ3.ShaderLibrary['depth'].fragment = "precision highp float;\n\nvec4 pack(const in float depth) {\n  const vec4 bitShift = vec4(255.0 * 255.0 * 255.0, 255.0 * 255.0, 255.0, 1.0);\n\tconst vec4 bitMask = vec4(0.0, 1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0);\n\n\tvec4 res = fract(depth * bitShift);\n\tres -= res.xxyz * bitMask;\n\n\treturn res;\n}\n\nvoid main() {\n  gl_FragColor = pack(gl_FragCoord.z);\n}\n";
EZ3.ShaderLibrary['mesh'].fragment = "precision highp float;\r\n\r\nstruct PointLight {\r\n\tvec3 position;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n\tfloat shadowBias;\r\n\tfloat shadowDarkness;\r\n};\r\n\r\nstruct DirectionalLight {\r\n\tvec3 direction;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n\tmat4 shadow;\r\n\tfloat shadowBias;\r\n\tfloat shadowDarkness;\r\n};\r\n\r\nstruct SpotLight {\r\n\tvec3 position;\r\n\tvec3 direction;\r\n\tfloat cutoff;\r\n\tvec3 diffuse;\r\n\tvec3 specular;\r\n\tmat4 shadow;\r\n\tfloat shadowBias;\r\n\tfloat shadowDarkness;\r\n};\r\n\r\nuniform vec3 uEmissive;\r\nuniform vec3 uDiffuse;\r\nuniform vec3 uSpecular;\r\nuniform float uShininess;\r\nuniform float uOpacity;\r\nuniform vec3 uEyePosition;\r\n\r\n#if MAX_POINT_LIGHTS > 0\r\n  uniform PointLight uPointLights[MAX_POINT_LIGHTS];\r\n\r\n\t#ifdef SHADOW_MAP\r\n\t\tuniform samplerCube uPointShadowSampler[MAX_POINT_LIGHTS];\r\n\t#endif\r\n#endif\r\n\r\n#if MAX_DIRECTIONAL_LIGHTS > 0\r\n  uniform DirectionalLight uDirectionalLights[MAX_DIRECTIONAL_LIGHTS];\r\n\r\n\t#ifdef SHADOW_MAP\r\n\t\tuniform sampler2D uDirectionalShadowSampler[MAX_DIRECTIONAL_LIGHTS];\r\n\t#endif\r\n#endif\r\n\r\n#if MAX_SPOT_LIGHTS > 0\r\n  uniform SpotLight uSpotLights[MAX_SPOT_LIGHTS];\r\n\r\n\t#ifdef SHADOW_MAP\r\n\t\tuniform sampler2D uSpotShadowSampler[MAX_SPOT_LIGHTS];\r\n\t#endif\r\n#endif\r\n\r\n#ifdef EMISSIVE_MAP\r\n\tuniform sampler2D uEmissiveSampler;\r\n#endif\r\n\r\n#ifdef DIFFUSE_MAP\r\n\tuniform sampler2D uDiffuseSampler;\r\n#endif\r\n\r\n#ifdef SPECULAR_MAP\r\n\tuniform sampler2D uSpecularSampler;\r\n#endif\r\n\r\n#ifdef ENVIRONMENT_MAP\r\n\tuniform samplerCube uEnvironmentSampler;\r\n#endif\r\n\r\n#ifdef REFRACTION\r\n\tuniform float uRefractiveIndex;\r\n#endif\r\n\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\nvarying vec2 vUv;\r\n\r\n#ifdef LAMBERT\r\n\tfloat lambert(in vec3 s, in vec3 n) {\r\n\t\treturn max(dot(s, n), 0.0);\r\n\t}\r\n#endif\r\n\r\n#ifdef OREN_NAYAR\r\n\tuniform float uAlbedo;\r\n\tuniform float uDiffuseRoughness;\r\n\r\n\tfloat orenNayar(in vec3 v, in vec3 s, in vec3 n) {\r\n\t\tfloat PI = acos(-1.0);\r\n\r\n\t\tfloat SdotV = dot(s, v);\r\n\t\tfloat SdotN = dot(s, n);\r\n\t\tfloat NdotV = dot(n, v);\r\n\r\n\t\tfloat S = SdotV - SdotN * NdotV;\r\n\t\tfloat T = mix(1.0, max(SdotN, NdotV), step(0.0, S));\r\n\t\tfloat sigma2 = uDiffuseRoughness * uDiffuseRoughness;\r\n\r\n\t\tfloat A = 1.0 + sigma2 * (uAlbedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\r\n\t\tfloat B = 0.45 * sigma2 / (sigma2 + 0.09);\r\n\r\n\t\treturn uAlbedo * max(0.0, SdotN) * (A + B * S / T) / PI;\r\n\t}\r\n#endif\r\n\r\n#ifdef PHONG\r\n\tfloat phong(in vec3 v, in vec3 s, in vec3 n) {\r\n\t\treturn pow(max(dot(reflect(-s, n), v), 0.0), uShininess);\r\n\t}\r\n#endif\r\n\r\n#ifdef BLINN_PHONG\r\n\tfloat blinnPhong(in vec3 v, in vec3 s, in vec3 n) {\r\n\t\treturn pow(max(dot(normalize(s + v), n), 0.0), uShininess);\r\n\t}\r\n#endif\r\n\r\n#ifdef COOK_TORRANCE\r\n\tuniform float uFresnel;\r\n\tuniform float uSpecularRoughness;\r\n\r\n\tfloat beckmannDistribution(in float NdotH) {\r\n\t\tfloat PI = acos(-1.0);\r\n\t\tfloat cos2Beta = NdotH * NdotH;\r\n\t\tfloat tan2Beta = (cos2Beta - 1.0) / cos2Beta;\r\n\t\tfloat div =  PI * uSpecularRoughness * uSpecularRoughness * cos2Beta * cos2Beta;\r\n\r\n\t\treturn exp(tan2Beta / (uSpecularRoughness * uSpecularRoughness)) / div;\r\n\t}\r\n\r\n\tfloat cookTorrance(in vec3 v, in vec3 s, in vec3 n) {\r\n\t\tvec3 h = normalize(s + v);\r\n\r\n\t\tfloat VdotN = max(dot(v, n), 0.000001);\r\n\t\tfloat SdotN = max(dot(s, n), 0.000001);\r\n\t\tfloat VdotH = max(dot(v, h), 0.000001);\r\n\t\tfloat SdotH = max(dot(s, h), 0.000001);\r\n\t\tfloat NdotH = max(dot(n, h), 0.000001);\r\n\r\n\t\tfloat G1 = (2.0 * NdotH * VdotN) / VdotH;\r\n\t\tfloat G2 = (2.0 * NdotH * SdotN) / SdotH;\r\n\t\tfloat G = min(1.0, min(G1, G2));\r\n\r\n\t\tfloat D = beckmannDistribution(NdotH);\r\n\t\tfloat F = pow(1.0 - VdotN, uFresnel);\r\n\t\tfloat PI = acos(-1.0);\r\n\r\n\t  return  G * F * D / max(PI * VdotN, 0.0);\r\n\t}\r\n#endif\r\n\r\n#ifdef NORMAL_MAP\r\n\t#extension GL_OES_standard_derivatives : enable\r\n\r\n\tuniform sampler2D uNormalSampler;\r\n\r\n\tvec3 pertubNormal(in vec3 v) {\r\n\t\tvec3 q0 = dFdx(v);\r\n\t\tvec3 q1 = dFdy(v);\r\n\r\n\t\tvec2 st0 = dFdx(vUv);\r\n\t\tvec2 st1 = dFdy(vUv);\r\n\r\n\t\tvec3 s = normalize(q0 * st1.t - q1 * st0.t);\r\n\t\tvec3 t = normalize(-q0 * st1.s + q1 * st0.s);\r\n\t\tvec3 n = normalize(vNormal);\r\n\r\n\t\tvec3 d = texture2D(uNormalSampler, vUv).xyz * 2.0 - 1.0;\r\n\r\n\t\treturn normalize(mat3(s, t, n) * d);\r\n\t}\r\n#endif\r\n\r\n#ifdef SHADOW_MAP\r\n\tbool isBounded(in float coordinate) {\r\n\t\treturn coordinate >= 0.0 && coordinate <= 1.0;\r\n\t}\r\n\r\n\tfloat unpack(in vec4 color) {\r\n\t\tconst vec4 bitShift = vec4(1.0 / (255.0 * 255.0 * 255.0), 1.0 / (255.0 * 255.0), 1.0 / 255.0, 1.0);\r\n\t  return dot(color, bitShift);\r\n\t}\r\n\r\n\t#if (MAX_POINT_LIGHTS > 0)\r\n\t\tfloat omnidirectionalShadow(in vec3 lightPosition, in float bias, in float darkness, in samplerCube sampler) {\r\n\t\t\tvec3 direction = vPosition - lightPosition;\r\n\t\t\tfloat vertexDepth = clamp(length(direction), 0.0, 1.0);\r\n\t\t\tfloat shadowMapDepth = unpack(textureCube(sampler, direction)) + bias;\r\n\r\n\t\t\treturn (vertexDepth > shadowMapDepth) ? darkness : 1.0;\r\n\t\t}\r\n\t#endif\r\n\r\n\t#if (MAX_DIRECTIONAL_LIGHTS > 0) || (MAX_SPOT_LIGHTS > 0)\r\n\t\tfloat directionalShadow(in mat4 shadowMatrix, in float bias, in float darkness, in sampler2D sampler) {\r\n\t\t\tvec4 lightCoordinates = shadowMatrix * vec4(vPosition, 1.0);\r\n\t\t\tvec3 shadowCoordinates = lightCoordinates.xyz / lightCoordinates.w;\r\n\r\n\t\t\tif(isBounded(shadowCoordinates.x) && isBounded(shadowCoordinates.y) && isBounded(shadowCoordinates.z)) {\r\n\t\t\t\tfloat vertexDepth = shadowCoordinates.z;\r\n\t\t\t\tfloat shadowMapDepth = unpack(texture2D(sampler, shadowCoordinates.xy)) + bias;\r\n\r\n\t\t\t\treturn (vertexDepth > shadowMapDepth) ? darkness : 1.0;\r\n\t\t\t}\r\n\r\n\t\t\treturn 1.0;\r\n\t\t}\r\n\t#endif\r\n#endif\r\n\r\nfloat computeDiffuseReflection(in vec3 v, in vec3 s, in vec3 n) {\r\n\tfloat diffuse = 1.0;\r\n\r\n\t#ifdef LAMBERT\r\n\t\tdiffuse = lambert(s, n);\r\n\t#endif\r\n\r\n\t#ifdef OREN_NAYAR\r\n\t\tdiffuse = orenNayar(v, s, n);\r\n\t#endif\r\n\r\n\treturn diffuse;\r\n}\r\n\r\nfloat computeSpecularReflection(in vec3 v, in vec3 s, in vec3 n) {\r\n\tfloat specular = 1.0;\r\n\r\n\t#ifdef BLINN_PHONG\r\n\t\tspecular = blinnPhong(v, s, n);\r\n\t#endif\r\n\r\n\t#ifdef COOK_TORRANCE\r\n\t\tspecular = cookTorrance(v, s, n);\r\n\t#endif\r\n\r\n\t#ifdef PHONG\r\n\t\tspecular = phong(v, s, n);\r\n\t#endif\r\n\r\n\treturn specular;\r\n}\r\n\r\nvoid main() {\r\n\tfloat shadow = 1.0;\r\n\r\n\tfloat diffuseReflection;\r\n\tfloat specularReflection;\r\n\r\n\tvec3 emissive = uEmissive;\r\n\tvec3 diffuse = vec3(0.0);\r\n\tvec3 specular = vec3(0.0);\r\n\r\n\tvec3 v = normalize(uEyePosition - vPosition);\r\n\r\n\t#ifdef FLAT\r\n\t\tvec3 fdx = dFdx(vPosition);\r\n\t\tvec3 fdy = dFdy(vPosition);\r\n\t\tvec3 n = normalize(cross(fdx, fdy));\r\n\t#else\r\n\t\tvec3 n = vNormal;\r\n\t#endif\r\n\r\n\t#ifdef NORMAL_MAP\r\n\t\tn = pertubNormal(-v);\r\n\t#endif\r\n\r\n\t#if MAX_POINT_LIGHTS > 0\r\n\t  for(int i = 0; i < MAX_POINT_LIGHTS; i++) {\r\n\t\t\tvec3 s = normalize(uPointLights[i].position - vPosition);\r\n\r\n\t\t\tdiffuseReflection = computeDiffuseReflection(v, s, n);\r\n\r\n\t\t\tif (diffuseReflection > 0.0) {\r\n\r\n\t\t\t\tspecularReflection = computeSpecularReflection(v, s, n);\r\n\r\n\t\t\t\t#ifdef SHADOW_MAP\r\n\t\t\t\t\tvec3 lightPosition = uPointLights[i].position;\r\n\t\t\t\t\tfloat shadowBias = uPointLights[i].shadowBias;\r\n\t\t\t\t\tfloat shadowDarkness = uPointLights[i].shadowDarkness;\r\n\r\n\t\t\t\t\tshadow = omnidirectionalShadow(lightPosition, shadowBias, shadowDarkness, uPointShadowSampler[i]);\r\n\t\t\t\t#endif\r\n\r\n\t\t\t\tdiffuse += uPointLights[i].diffuse * uDiffuse * diffuseReflection * shadow;\r\n\t\t\t\tspecular += uPointLights[i].specular * uSpecular * specularReflection * shadow;\r\n\t\t\t}\r\n\t  }\r\n\t#endif\r\n\r\n\t#if MAX_DIRECTIONAL_LIGHTS > 0\r\n\t  for(int i = 0; i < MAX_DIRECTIONAL_LIGHTS; i++) {\r\n\t\t\tvec3 s = uDirectionalLights[i].direction;\r\n\r\n\t\t\tdiffuseReflection = computeDiffuseReflection(v, s, n);\r\n\r\n\t\t\tif (diffuseReflection > 0.0) {\r\n\r\n\t\t\t\tspecularReflection = computeSpecularReflection(v, s, n);\r\n\r\n\t\t\t\t#ifdef SHADOW_MAP\r\n\t\t\t\t\tmat4 shadowMatrix = uDirectionalLights[i].shadow;\r\n\t\t\t\t\tfloat shadowBias = uDirectionalLights[i].shadowBias;\r\n\t\t\t\t\tfloat shadowDarkness = uDirectionalLights[i].shadowDarkness;\r\n\r\n\t\t\t\t\tshadow = directionalShadow(shadowMatrix, shadowBias, shadowDarkness, uDirectionalShadowSampler[i]);\r\n\t\t\t\t#endif\r\n\r\n\t\t\t\tdiffuse += uDirectionalLights[i].diffuse * uDiffuse * diffuseReflection * shadow;\r\n\t\t\t\tspecular += uDirectionalLights[i].specular * uSpecular * specularReflection * shadow;\r\n\t\t\t}\r\n\t  }\r\n\t#endif\r\n\r\n\t#if MAX_SPOT_LIGHTS > 0\r\n\t  for(int i = 0; i < MAX_SPOT_LIGHTS; i++) {\r\n\t\t\tvec3 s = normalize(uSpotLights[i].position - vPosition);\r\n\t\t\tfloat angle = max(dot(s, uSpotLights[i].direction), 0.0);\r\n\r\n\t\t\tif(angle > uSpotLights[i].cutoff) {\r\n\r\n\t\t\t\tdiffuseReflection = computeDiffuseReflection(v, s, n);\r\n\r\n\t\t\t\tif (diffuseReflection > 0.0) {\r\n\r\n\t\t\t\t\tspecularReflection = computeSpecularReflection(v, s, n);\r\n\r\n\t\t\t\t\t#ifdef SHADOW_MAP\r\n\t\t\t\t\t\tmat4 shadowMatrix = uSpotLights[i].shadow;\r\n\t\t\t\t\t\tfloat shadowBias = uSpotLights[i].shadowBias;\r\n\t\t\t\t\t\tfloat shadowDarkness = uSpotLights[i].shadowDarkness;\r\n\r\n\t\t\t\t\t\tshadow = directionalShadow(shadowMatrix, shadowBias, shadowDarkness, uSpotShadowSampler[i]);\r\n\t\t\t\t\t#endif\r\n\r\n\t\t\t\t\tdiffuse += uSpotLights[i].diffuse * uDiffuse * diffuseReflection * shadow;\r\n\t\t\t\t\tspecular += uSpotLights[i].specular * uSpecular * specularReflection * shadow;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t  }\r\n\t#endif\r\n\r\n\t#ifdef EMISSIVE_MAP\r\n\t  emissive *= texture2D(uEmissiveSampler, vUv).rgb;\r\n\t#endif\r\n\r\n\t#ifdef DIFFUSE_MAP\r\n\t\tdiffuse *= texture2D(uDiffuseSampler, vUv).rgb;\r\n\t#endif\r\n\r\n\t#ifdef SPECULAR_MAP\r\n\t\tspecular *= texture2D(uSpecularSampler, vUv).rgb;\r\n\t#endif\r\n\r\n\t#ifdef REFLECTION\r\n\t\tvec3 reflection = reflect(-v, n);\r\n\t\tdiffuse *= textureCube(uEnvironmentSampler, reflection).rgb;\r\n\t#endif\r\n\r\n\t#ifdef REFRACTION\r\n\t\tvec3 refraction = refract(-v, n, uRefractiveIndex);\r\n\t\tdiffuse *= textureCube(uEnvironmentSampler, refraction).rgb;\r\n\t#endif\r\n\r\n\tgl_FragColor = vec4(emissive + diffuse + specular, uOpacity);\r\n}\r\n";
/**
 * @class Screen
 */

EZ3.Screen = function(position, size) {
  this.position = position;
  this.size = size;
  this.load = new EZ3.RequestManager();
  this.scene = new EZ3.Scene();
  this.camera = null;
};

/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(canvas, bounds, renderer, time, input, screen) {
  this._screens = [];

  this.canvas = canvas;
  this.bounds = bounds;
  this.renderer = renderer;
  this.time = time;
  this.input = input;
  this.clearColor = new EZ3.Vector4(0, 0, 0, 1);
  this.fullScreeneded = false;

  if (screen)
    this.add('default', screen);
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

  this.renderer.clearColor(this.clearColor);
  this.renderer.clear();

  for (i = 0; i < this._screens.length; i++) {
    screen = this._screens[i];

    this.renderer.render(screen.position, screen.size, screen.scene, screen.camera);
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
  this.wheel = null;
  this.requestFullScreen = null;
  this.exitFullScreen = null;
  this.fullScreenChange = null;
  this.fullScreenError = null;
  this.requestPointerLock = null;
  this.exitPointerLock = null;
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
      that.exitFullScreen = 'exitFullscreen';
      that.fullScreenChange = 'fullscreenchange';
      that.fullScreenError = 'fullscreenerror';
    } else if (document.webkitFullscreenEnabled) {
      that.requestFullScreen = 'webkitRequestFullscreen';
      that.exitFullScreen = 'webkitExitFullscreen';
      that.fullScreenChange = 'webkitfullscreenchange';
      that.fullScreenError = 'webkitfullscreenerror';
    } else if (document.mozFullScreenEnabled) {
      that.requestFullScreen = 'mozRequestFullscreen';
      that.exitFullScreen = 'mozCancelFullScreen';
      that.fullScreenChange = 'mozfullscreenchange';
      that.fullScreenError = 'mozfullscreenerror';
    } else if (document.msFullscreenEnabled) {
      that.requestFullScreen = 'msRequestFullscreen';
      that.exitFullScreen = 'msExitFullscreen';
      that.fullScreenChange = 'MSFullscreenChange';
      that.fullScreenError = 'MSFullscreenError';
    }
  }

  function checkPointerLock() {
    if ('pointerLockElement' in document) {
      that.requestPointerLock = 'requestPointerLock';
      that.exitPointerLock = 'exitPointerLock';
      that.pointerLockChange = 'pointerlockchange';
      that.pointerLockCancel = 'pointerlockerror';
    } else if ('webkitPointerLockElement' in document) {
      that.requestPointerLock = 'webkitRequestPointerLock';
      that.exitPointerLock = 'webkitExitPointerLock';
      that.pointerLockChange = 'webkitpointerlockchange';
      that.pointerLockCancel = 'webkitpointerlockerror';
    } else if ('mozPointerLockElement' in document) {
      that.requestPointerLock = 'mozRequestPointerLock';
      that.exitPointerLock = 'mozExitPointerLock';
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

  this.generateMipmaps = (generateMipmaps === undefined) ? true : generateMipmaps;
  this.wrapS = EZ3.Texture.REPEAT;
  this.wrapT = EZ3.Texture.REPEAT;
  this.magFilter = EZ3.Texture.LINEAR;
  this.minFilter = EZ3.Texture.LINEAR_MIPMAP_LINEAR;
  this.flipY = false;
  this.needUpdate = true;
};

EZ3.Texture.prototype._getGLFilter = function(gl, filter) {
  if (filter === EZ3.Texture.LINEAR)
    return gl.LINEAR;
  else if (filter === EZ3.Texture.NEAREST)
    return gl.NEAREST;
  else if (filter === EZ3.Texture.LINEAR_MIPMAP_LINEAR)
    return gl.LINEAR_MIPMAP_LINEAR;
  else if (filter === EZ3.Texture.NEAREST_MIPMAP_NEAREST)
    return gl.NEAREST_MIPMAP_NEAREST;
  else if (filter === EZ3.Texture.NEAREST_MIPMAP_LINEAR)
    return gl.NEAREST_MIPMAP_LINEAR;
  else
    return gl.LINEAR_MIPMAP_NEAREST;
};

EZ3.Texture.prototype._getGLWrap = function(gl, wrap) {
  if (wrap === EZ3.Texture.CLAMP_TO_EDGE)
    return gl.CLAMP_TO_EDGE;
  else if (wrap  === EZ3.Texture.REPEAT)
    return gl.REPEAT;
  else
    return gl.MIRRORED_REPEAT;
};

EZ3.Texture.prototype._updateImage = function(gl, target, image) {
  var format = image.getGLFormat(gl);

  if (!EZ3.Math.isPowerOfTwo(image.width) || !EZ3.Math.isPowerOfTwo(image.height))
    image.toPowerOfTwo();

  gl.texImage2D(target, 0, format, image.width, image.height, 0, format, gl.UNSIGNED_BYTE, image.data);
};

EZ3.Texture.prototype._updateMipmaps = function(gl, target) {
  if (!this.generateMipmaps) {
    this.magFilter = EZ3.Texture.LINEAR;
    this.minFilter = EZ3.Texture.LINEAR;
  } else {
    gl.generateMipmap(target);
  }
};

EZ3.Texture.prototype._updatePixelStore = function(gl) {
  if (this._cache.flipY !== this.flipY) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    this._cache.flipY = this.flipY;
  }
};

EZ3.Texture.prototype._updateParameters = function(gl, target) {
  if (this._cache.wrapS !== this.wrapS) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, this._getGLWrap(gl, this.wrapS));
    this._cache.wrapS = this.wrapS;
  }

  if (this._cache.wrapT !== this.wrapT) {
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, this._getGLWrap(gl, this.wrapT));
    this._cache.wrapT = this.wrapT;
  }

  if (this._cache.magFilter !== this.magFilter) {
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, this._getGLFilter(gl, this.magFilter));
    this._cache.magFilter = this.magFilter;
  }

  if (this._cache.minFilter !== this.minFilter) {
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, this._getGLFilter(gl, this.minFilter));
    this._cache.minFilter = this.minFilter;
  }
};

EZ3.Texture.prototype.bind = function(gl, state, capabilities, target) {
  if (!this._id)
    this._id = gl.createTexture();

  if(state && capabilities) {
    if(state.usedTextureSlots < capabilities.maxTextureSlots + 1)
      state.bindTexture(target, this._id);
    else
      console.warn('EZ3.Texture.bind: not available enough texture slots.');
  } else
    gl.bindTexture(target, this._id);
};

EZ3.Texture.LINEAR = 1;
EZ3.Texture.NEAREST = 2;
EZ3.Texture.LINEAR_MIPMAP_LINEAR = 3;
EZ3.Texture.NEAREST_MIPMAP_NEAREST = 4;
EZ3.Texture.NEAREST_MIPMAP_LINEAR = 5;
EZ3.Texture.LINEAR_MIPMAP_NEAREST = 6;

EZ3.Texture.CLAMP_TO_EDGE = 1;
EZ3.Texture.REPEAT = 2;
EZ3.Texture.MIRRORED_REPEAT = 3;

EZ3.Texture.COLOR_ATTACHMENT0 = 1;

/**
 * @class EZ3.CameraControl
 * @extends EZ3.Control
 * @constructor
 * @param {EZ3.Entity} entity
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.CameraControl = function(entity, target, up) {
  EZ3.Control.call(this, entity);

  /**
   * @property {EZ3.Vector3} target
   */

  /**
   * @property {EZ3.Vector3} up
   */

  /**
   * @property {EZ3.Vector3} look
   */

  /**
   * @property {EZ3.Vector3} rigth
   */
  this.right = new EZ3.Vector3();

  /**
   * @property {Number} roll
   * @default 0
   */
  this.roll = 0;

  /**
   * @property {Number} minPitch
   * @default -EZ3.Math.HALF_PI
   */
  this.minPitch = -EZ3.Math.HALF_PI;

  /**
   * @property {Number} maxPitch
   * @default EZ3.Math.HALF_PI
   */
  this.maxPitch = EZ3.Math.HALF_PI;

  /**
   * @property {Number} minYaw
   * @default -Infinity
   */
  this.minYaw = -Infinity;

  /**
   * @property {Number} maxYaw
   */
  this.maxYaw = Infinity;

  this.lookAt(target, up);
};

EZ3.CameraControl.prototype = Object.create(EZ3.Control.prototype);
EZ3.CameraControl.prototype.constructor = EZ3.CameraControl;

/**
 * @method EZ3.CameraControl#lookAt
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.CameraControl.prototype.lookAt = function(target, up) {
  var xy;

  this.target = target || new EZ3.Vector3();
  this.up = up || new EZ3.Vector3(0, 1, 0);
  this.look = new EZ3.Vector3().sub(this.target, this.entity.position).normalize();
  this.right = new EZ3.Vector3().cross(this.look, this.up);

  xy = Math.sqrt(this.look.x * this.look.x + this.look.z * this.look.z);

  this.yaw = Math.atan2(this.look.x, this.look.z);
  this.pitch = Math.atan2(-this.look.y, xy);

  this.entity.lookAt(this.target, this.up);
};

/**
 * @method EZ3.CameraControl#rotate
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.CameraControl.prototype.rotate = function(dx, dy, speed) {
  speed = (speed !== undefined) ? speed : 1;

  this.yaw -= dx * speed;
  this.pitch += dy * speed;

  this.yaw = Math.max(this.minYaw, Math.min(this.maxYaw, this.yaw));
  this.pitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.pitch));
};

/**
 * @class EZ3.Camera
 * @extends EZ3.Entity
 * @constructor
 */
EZ3.Camera = function() {
  EZ3.Entity.call(this);

  /**
   * @property {EZ3.Matrix4} view
   */
  this.view = new EZ3.Matrix4();

  /**
   * @property {EZ3.Matrix4} projection
   */
  this.projection = new EZ3.Matrix4();
};

EZ3.Camera.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Camera.prototype.constructor = EZ3.Camera;

/**
 * @method EZ3.Camera#updateView
 */
EZ3.Camera.prototype.updateView = function() {
  if(this.world.isDiff(this._cache.world)) {
    this._cache.world = this.world.clone();
    this.view.inverse(this.world);
  }
};

/**
 * @class DepthCubeFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthCubeFramebuffer = function(size) {
  EZ3.Framebuffer.call(this, size);
};

EZ3.DepthCubeFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.DepthCubeFramebuffer.prototype.constructor = EZ3.DepthCubeFramebuffer;

EZ3.DepthCubeFramebuffer.prototype.update = function(gl) {
  if(this.size.isDiff(this._cache.size)) {
    this._cache.size = this.size.clone();

    this.texture = new EZ3.TargetCubemap(this.size, EZ3.Image.RGBA_FORMAT, gl.COLOR_ATTACHMENT0);
    this.texture.wrapS = EZ3.Texture.CLAMP_TO_EDGE;
    this.texture.wrapT = EZ3.Texture.CLAMP_TO_EDGE;

    EZ3.Framebuffer.prototype.update.call(this, gl);
  }
};

/**
 * @class DepthFramebuffer
 * @extends Framebuffer
 */

EZ3.DepthFramebuffer = function(size) {
  EZ3.Framebuffer.call(this, size);
};

EZ3.DepthFramebuffer.prototype = Object.create(EZ3.Framebuffer.prototype);
EZ3.DepthFramebuffer.prototype.constructor = EZ3.DepthFramebuffer;

EZ3.DepthFramebuffer.prototype.update = function(gl) {
  if(this.size.isDiff(this._cache.size)) {
    this._cache.size = this.size.clone();

    this.texture = new EZ3.TargetTexture2D(this.size, EZ3.Image.RGBA_FORMAT, gl.COLOR_ATTACHMENT0);
    this.texture.wrapS = EZ3.Texture.CLAMP_TO_EDGE;
    this.texture.wrapT = EZ3.Texture.CLAMP_TO_EDGE;

    EZ3.Framebuffer.prototype.update.call(this, gl);
  }
};

/**
 * @class Primitive
 * @extends Geometry
 */

EZ3.Primitive = function() {
  EZ3.Geometry.call(this);
};

EZ3.Primitive.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Primitive.prototype.constructor = EZ3.Primitive;

EZ3.Primitive.prototype.updateCommonData = function() {
  if (this.needGenerate) {
    this.generate();
    this.linearDataNeedUpdate = true;
    this.normalDataNeedUpdate = false;
  }
};

/**
 * @class IndexBuffer
 * @extends Buffer
 */

EZ3.IndexBuffer = function(data, need32Bits, dynamic) {
  EZ3.Buffer.call(this, data, dynamic);

  this.need32Bits = (need32Bits !== undefined) ? need32Bits : false;
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

EZ3.IndexBuffer.prototype.getGLType = function(gl, extensions) {
  return (extensions.elementIndexUInt && this.need32Bits) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
};

EZ3.IndexBuffer.TRIANGULAR = 1;
EZ3.IndexBuffer.LINEAR = 2;

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

EZ3.VertexBuffer.prototype.isValid = function(gl, attributes) {
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
      if (state)
        state.enableVertexAttribArray(layout);
      else
        gl.enableVertexAttribArray(layout);
      gl.vertexAttribPointer(layout, size, type, normalized, this._stride, offset);
    }
  }
};

EZ3.VertexBuffer.prototype.update = function(gl) {
  EZ3.Buffer.prototype.update.call(this, gl, gl.ARRAY_BUFFER, 4);
};

EZ3.VertexBuffer.prototype.addAttribute = function(name, attribute) {
  this._stride += 4 * attribute.size;
  this._attributes[name] = attribute;
};

/**
 * @class MousePointer
 * @extends Pointer
 */

EZ3.MousePointer = function() {
  EZ3.Pointer.call(this);

  this._buttons = [];

  this.wheel = new EZ3.Vector2();
  this.movement = new EZ3.Vector2();
  this.locked = false;
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.prototype.processPress = function(event, domElement, bounds, onPress, onMove) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processPress();
  EZ3.Pointer.prototype.processPress.call(this, event, domElement, bounds);

  onPress.dispatch(this._buttons[event.button]);
  onMove.dispatch(this);
};

EZ3.MousePointer.prototype.processMove = function(event, domElement, bounds, onMove) {
  if (!this.locked)
    EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
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

EZ3.TouchPointer = function(code, id) {
  EZ3.Pointer.call(this);
  EZ3.Switch.call(this, code);

  this.id = id || 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.extends(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

EZ3.TouchPointer.prototype.processPress = function(event, domElement, bounds, onPress, onMove) {
  EZ3.Pointer.prototype.processPress.call(this, event, domElement, bounds);
  EZ3.Switch.prototype.processPress.call(this);

  this.last.page.copy(this.current.position);
  this.last.client.copy(this.current.client);
  this.last.screen.copy(this.current.screen);
  this.last.position.copy(this.current.position);

  onPress.dispatch(this);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processMove = function(event, domElement, bounds, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event, domElement, bounds);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processUp = function(onUp) {
  EZ3.Switch.prototype.processUp.call(this);
  onUp.dispatch(this);
};

/**
 * @class DirectionalLight
 * @extends Light
 * @extends OrthographicCamera
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);
  EZ3.OrthographicCamera.call(this, -100.0, 100.0, 100.0, -100.0, 1.0, 5000.0);

  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.DirectionalLight.prototype, EZ3.OrthographicCamera.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = this.getWorldDirection();
  var viewProjection;
  var shadow;
  var bias;

  if (!direction.isZeroVector())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);

  if (shadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uDirectionalShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};

/**
 * @class PointLight
 * @extends Light
 * @extends PerspectiveCamera
 */

EZ3.PointLight = function() {
  EZ3.Light.call(this);
  EZ3.PerspectiveCamera.call(this, 90.0, 1.0, 1.0, 5000.0);

  this.depthFramebuffer = new EZ3.DepthCubeFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.PointLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

EZ3.PointLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);

  if(shadowReceiver) {
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uPointShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};

/**
 * @class SpotLight
 * @extends Light
 * @extends OrthographicCamera
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);
  EZ3.PerspectiveCamera.call(this, 60.0, 1.0, 1.0, 4000.0);

  this.cutoff = 0.9;
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.SpotLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = this.getWorldDirection();
  var viewProjection;
  var shadow;
  var bias;

  if(!direction.isZeroVector())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
  program.loadUniformFloat(gl, prefix + 'direction', direction);
  program.loadUniformFloat(gl, prefix + 'cutoff', this.cutoff);

  if(shadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uSpotShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};

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

EZ3.Image.prototype.getGLFormat = function(gl) {
  if (this.format === EZ3.Image.RGB_FORMAT)
    return gl.RGB;
  else
    return gl.RGBA;
};

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

EZ3.Image.prototype.download = function() {
  var a = document.createElement('a');

  a.href = this.getCanvas().toDataURL();
  a.download = 'output.png';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

EZ3.Image.RGB_FORMAT = 1;
EZ3.Image.RGBA_FORMAT = 2;

/**
 * @class FileRequest
 * @extends Request
 */

EZ3.FileRequest = function(url, cached, crossOrigin, responseType) {
  EZ3.Request.call(this, url, new EZ3.File(), cached, crossOrigin);

  this._request = new XMLHttpRequest();

  this.responseType = responseType;
};

EZ3.FileRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.FileRequest.prototype.constructor = EZ3.FileRequest;

EZ3.FileRequest.prototype._processLoad = function(data, onLoad) {
  this._removeEventListeners();

  this.asset.data = data.response;

  onLoad(this.url, this.asset, this.cached);
};

EZ3.FileRequest.prototype._processError = function(onError) {
  this._removeEventListeners();
  onError(this.url);
};

EZ3.FileRequest.prototype._addEventListeners = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function() {
    that._processError(onError);
  };

  this._request.addEventListener('load', this._onLoad, false);
  this._request.addEventListener('error', this._onError, false);
};

EZ3.FileRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

EZ3.FileRequest.prototype.send = function(onLoad, onError) {
  this._request.open('GET', this.url, true);

  this._addEventListeners(onLoad, onError);

  if (this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  if (this.responseType)
    this._request.responseType = this.responseType;

  this._request.send(null);
};

/**
 * @class ImageRequest
 * @extends Request
 */

EZ3.ImageRequest = function(url, crossOrigin, cached) {
  EZ3.Request.call(this, url, new EZ3.Image(), cached, crossOrigin);

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

  this.asset.width = image.width;
  this.asset.height = image.height;
  this.asset.data = new Uint8Array(context.getImageData(0, 0, image.width, image.height).data);

  this._removeEventListeners();

  onLoad(this.url, this.asset, this.cached);
};

EZ3.ImageRequest.prototype._processError = function(onError) {
  this._removeEventListeners();
  onError(this.url);
};

EZ3.ImageRequest.prototype._addEventListeners = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function() {
    that._processError(onError);
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
 * @class MD2Request
 * @extends Request
 */

 EZ3.MD2Request = function(url, cached, crossOrigin) {
   EZ3.Request.call(this, url, new EZ3.Mesh(), cached, crossOrigin);
 };

 EZ3.MD2Request.prototype = Object.create(EZ3.Request.prototype);
 EZ3.MD2Request.prototype.constructor = EZ3.MD2Request;

 EZ3.MD2Request.prototype._parse = function(data, onLoad, onError) {
 };

 EZ3.MD2Request.prototype.send = function(onLoad, onError) {
   var that = this;
   var requests = new EZ3.RequestManager();

   requests.addFileRequest(this.url, this.cached, this.crossOrigin, 'arraybuffer');

   requests.onComplete.add(function(assets, failed) {
     if (failed)
       return onError(that.url);

     that._parse(assets.get(that.url).data, onLoad, onError);
   });

   requests.send();
 };

/**
 * @class MDLRequest
 * @extends Request
 */

EZ3.MDLRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Mesh(), cached, crossOrigin);
};

EZ3.MDLRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.MDLRequest.prototype.constructor = EZ3.MDLRequest;

EZ3.MDLRequest.prototype._parse = function(data, onLoad, onError) {
  var that = this;
  var offset = 0;
  var palette = [
    [  0,   0,   0], [ 15,  15,  15], [ 31,  31,  31], [ 47,  47,  47],
    [ 63,  63,  63], [ 75,  75,  75], [ 91,  91,  91], [107, 107, 107],
    [123, 123, 123], [139, 139, 139], [155, 155, 155], [171, 171, 171],
    [187, 187, 187], [203, 203, 203], [219, 219, 219], [235, 235, 235],
    [ 15,  11,   7], [ 23,  15,  11], [ 31,  23,  11], [ 39,  27,  15],
    [ 47,  35,  19], [ 55,  43,  23], [ 63,  47,  23], [ 75,  55,  27],
    [ 83,  59,  27], [ 91,  67,  31], [ 99,  75,  31], [107,  83,  31],
    [115,  87,  31], [123,  95,  35], [131, 103,  35], [143, 111,  35],
    [ 11,  11,  15], [ 19,  19,  27], [ 27,  27,  39], [ 39,  39,  51],
    [ 47,  47,  63], [ 55,  55,  75], [ 63,  63,  87], [ 71,  71, 103],
    [ 79,  79, 115], [ 91,  91, 127], [ 99,  99, 139], [107, 107, 151],
    [115, 115, 163], [123, 123, 175], [131, 131, 187], [139, 139, 203],
    [  0,   0,   0], [  7,   7,   0], [ 11,  11,   0], [ 19,  19,   0],
    [ 27,  27,   0], [ 35,  35,   0], [ 43,  43,   7], [ 47,  47,   7],
    [ 55,  55,   7], [ 63,  63,   7], [ 71,  71,   7], [ 75,  75,  11],
    [ 83,  83,  11], [ 91,  91,  11], [ 99,  99,  11], [107, 107,  15],
    [  7,   0,   0], [ 15,   0,   0], [ 23,   0,   0], [ 31,   0,   0],
    [ 39,   0,   0], [ 47,   0,   0], [ 55,   0,   0], [ 63,   0,   0],
    [ 71,   0,   0], [ 79,   0,   0], [ 87,   0,   0], [ 95,   0,   0],
    [103,   0,   0], [111,   0,   0], [119,   0,   0], [127,   0,   0],
    [ 19,  19,   0], [ 27,  27,   0], [ 35,  35,   0], [ 47,  43,   0],
    [ 55,  47,   0], [ 67,  55,   0], [ 75,  59,   7], [ 87,  67,   7],
    [ 95,  71,   7], [107,  75,  11], [119,  83,  15], [131,  87,  19],
    [139,  91,  19], [151,  95,  27], [163,  99,  31], [175, 103,  35],
    [ 35,  19,   7], [ 47,  23,  11], [ 59,  31,  15], [ 75,  35,  19],
    [ 87,  43,  23], [ 99,  47,  31], [115,  55,  35], [127,  59,  43],
    [143,  67,  51], [159,  79,  51], [175,  99,  47], [191, 119,  47],
    [207, 143,  43], [223, 171,  39], [239, 203,  31], [255, 243,  27],
    [ 11,   7,   0], [ 27,  19,   0], [ 43,  35,  15], [ 55,  43,  19],
    [ 71,  51,  27], [ 83,  55,  35], [ 99,  63,  43], [111,  71,  51],
    [127,  83,  63], [139,  95,  71], [155, 107,  83], [167, 123,  95],
    [183, 135, 107], [195, 147, 123], [211, 163, 139], [227, 179, 151],
    [171, 139, 163], [159, 127, 151], [147, 115, 135], [139, 103, 123],
    [127,  91, 111], [119,  83,  99], [107,  75,  87], [ 95,  63,  75],
    [ 87,  55,  67], [ 75,  47,  55], [ 67,  39,  47], [ 55,  31,  35],
    [ 43,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [187, 115, 159], [175, 107, 143], [163,  95, 131], [151,  87, 119],
    [139,  79, 107], [127,  75,  95], [115,  67,  83], [107,  59,  75],
    [ 95,  51,  63], [ 83,  43,  55], [ 71,  35,  43], [ 59,  31,  35],
    [ 47,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [219, 195, 187], [203, 179, 167], [191, 163, 155], [175, 151, 139],
    [163, 135, 123], [151, 123, 111], [135, 111,  95], [123,  99,  83],
    [107,  87,  71], [ 95,  75,  59], [ 83,  63,  51], [ 67,  51,  39],
    [ 55,  43,  31], [ 39,  31,  23], [ 27,  19,  15], [ 15,  11,   7],
    [111, 131, 123], [103, 123, 111], [ 95, 115, 103], [ 87, 107,  95],
    [ 79,  99,  87], [ 71,  91,  79], [ 63,  83,  71], [ 55,  75,  63],
    [ 47,  67,  55], [ 43,  59,  47], [ 35,  51,  39], [ 31,  43,  31],
    [ 23,  35,  23], [ 15,  27,  19], [ 11,  19,  11], [  7,  11,   7],
    [255, 243,  27], [239, 223,  23], [219, 203,  19], [203, 183,  15],
    [187, 167,  15], [171, 151,  11], [155, 131,   7], [139, 115,   7],
    [123,  99,   7], [107,  83,   0], [ 91,  71,   0], [ 75,  55,   0],
    [ 59,  43,   0], [ 43,  31,   0], [ 27,  15,   0], [ 11,   7,   0],
    [  0,   0, 255], [ 11,  11, 239], [ 19,  19, 223], [ 27,  27, 207],
    [ 35,  35, 191], [ 43,  43, 175], [ 47,  47, 159], [ 47,  47, 143],
    [ 47,  47, 127], [ 47,  47, 111], [ 47,  47,  95], [ 43,  43,  79],
    [ 35,  35,  63], [ 27,  27,  47], [ 19,  19,  31], [ 11,  11,  15],
    [ 43,   0,   0], [ 59,   0,   0], [ 75,   7,   0], [ 95,   7,   0],
    [111,  15,   0], [127,  23,   7], [147,  31,   7], [163,  39,  11],
    [183,  51,  15], [195,  75,  27], [207,  99,  43], [219, 127,  59],
    [227, 151,  79], [231, 171,  95], [239, 191, 119], [247, 211, 139],
    [167, 123,  59], [183, 155,  55], [199, 195,  55], [231, 227,  87],
    [127, 191, 255], [171, 231, 255], [215, 255, 255], [103,   0,   0],
    [139,   0,   0], [179,   0,   0], [215,   0,   0], [255,   0,   0],
    [255, 243, 147], [255, 247, 199], [255, 255, 255], [159,  91,  83]
  ];


  function processSkins(header, skins) {
    var skinSize = header.skinWidth * header.skinHeight;
    var skinData;
    var image;
    var i;
    var j;

    for (i = 0; i < header.numSkins; i++) {
      skinData = [];
      offset += 4;

      for (j = 0; j < skinSize; j++)
        skinData.push(data.getUint8(offset++, true));

      image = new EZ3.Image(header.skinWidth, header.skinHeight, EZ3.Image.RGBA, new Uint8Array(4 * skinSize));

      for (j = 0; j < skinSize; j++) {
        image.data[4 * j] = palette[skinData[j]][0];
        image.data[4 * j + 1] = palette[skinData[j]][1];
        image.data[4 * j + 2] = palette[skinData[j]][2];
        image.data[4 * j + 3] = 255;
      }

      skins.push(new EZ3.Texture2D(image));
    }
  }

  function processTexCoords(header, seams, uvs) {
    var i;

    for (i = 0; i < header.numVerts; i++) {
      seams.push(data.getInt32(offset, true));
      uvs.push(data.getInt32(offset + 4, true));
      uvs.push(data.getInt32(offset + 8, true));

      offset += 12;
    }
  }

  function processTriangles(header, facesFront, indices) {
    var i;
    var j;

    for (i = 0; i < header.numTris; i++) {
      facesFront.push(data.getInt32(offset, true));

      for (j = 0; j < 3; j++)
        indices.push(data.getInt32(offset + (j + 1) * 4, true));

      offset += 16;
    }
  }

  function processFrames(header, frames) {
    var c;
    var i;
    var j;
    var w;

    for (i = 0; i < header.numFrames; i++) {
      frames[i] = {
        name: [],
        vertices: [],
        normals: []
      };

      offset += 12;

      for (j = 0; j < 16; j++) {
        c = data.getInt8(offset + j, true);

        if (c === 0)
          break;

        frames[i].name.push(c);
      }

      frames[i].name = String.fromCharCode.apply(null, frames[i].name);

      offset += 16;

      for (j = 0; j < header.numVerts; j++) {
        for (w = 2; w >= 0; w--)
          frames[i].vertices.push(header.scale[w] * data.getUint8(offset + w, true) + header.translate[w]);

        offset += 3;

        frames[i].normals.push(data.getUint8(offset++, true));
      }
    }
  }

  function init() {
    var skins = [];
    var seams = [];
    var uvs = [];
    var facesFront = [];
    var indices = [];
    var frames = [];
    var header;
    var n;
    var i;
    var j;
    var w;

    data = new DataView(data);

    header = {
      ident: data.getInt32(offset, true),
      version: data.getInt32(offset + 4, true),
      scale: [
        data.getFloat32(offset + 8, true),
        data.getFloat32(offset + 12, true),
        data.getFloat32(offset + 16, true)
      ],
      translate: [
        data.getFloat32(offset + 20, true),
        data.getFloat32(offset + 24, true),
        data.getFloat32(offset + 28, true)
      ],
      numSkins: data.getInt32(offset + 48, true),
      skinWidth: data.getInt32(offset + 52, true),
      skinHeight: data.getInt32(offset + 56, true),
      numVerts: data.getInt32(offset + 60, true),
      numTris: data.getInt32(offset + 64, true),
      numFrames: data.getInt32(offset + 68, true)
    };

    if (header.ident !== 1330660425 || header.version !== 6)
      return onError(that.url);

    offset += 84;

    processSkins(header, skins);
    processTexCoords(header, seams, uvs);
    processTriangles(header, facesFront, indices);
    processFrames(header, frames);

    var rev = {};
    var numVerts = header.numVerts;

    for (i = 0; i < header.numTris; i++) {
      for (j = 0; j < 3; j++) {
        n = 3 * i + j;

        if (!facesFront[i] && seams[indices[n]]) {
          if (!rev[indices[n]]) {

            for (w = 0; w < header.numFrames; w++) {
              frames[w].vertices.push(frames[w].vertices[3 * indices[n]]);
              frames[w].vertices.push(frames[w].vertices[3 * indices[n] + 1]);
              frames[w].vertices.push(frames[w].vertices[3 * indices[n] + 2]);
            }

            uvs.push(uvs[2 * indices[n]] + header.skinWidth * 0.5);
            uvs.push(uvs[2 * indices[n] + 1]);
            rev[indices[n]] = numVerts++;
          }

          indices[n] = rev[indices[n]];
        }
      }
    }

    for (i = 0; i < uvs.length / 2; i++) {
      j = 2 * i;

      uvs[j] = (uvs[j] + 0.5) / header.skinWidth;
      uvs[j + 1] = (uvs[j + 1] + 0.5) / header.skinHeight;
    }

    that.asset.geometry.buffers.addTriangularBuffer(indices, (frames[0].vertices.length / 3) > EZ3.Math.MAX_USHORT);
    that.asset.geometry.buffers.addPositionBuffer(frames[0].vertices);
    that.asset.geometry.buffers.addUvBuffer(uvs);

    that.asset.material.diffuseMap = skins[0];

    onLoad(that.url, that.asset);
  }

  init();
};

EZ3.MDLRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.cached, this.crossOrigin, 'arraybuffer');

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad, onError);
  });

  requests.send();
};

/**
 * @class OBJRequest
 * @extends Request
 */

EZ3.OBJRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Entity(), cached, crossOrigin);
};

EZ3.OBJRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.OBJRequest.prototype.constructor = EZ3.OBJRequest;

EZ3.OBJRequest.prototype._parseMTL = function(baseUrl, data, materials, requests) {
  var that = this;
  var currents;

  function processColor(color) {
    var values = color.split(' ');

    return new EZ3.Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
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

  function processTransparency(opacity, invert) {
    var i;

    opacity = parseFloat(opacity);

    if (invert)
      opacity = 1 - opacity;

    if (opacity >= 1)
      return;

    for (i = 0; i < currents.length; i++) {
      currents[i].transparent = true;
      currents[i].opacity = opacity;
    }
  }

  function processDiffuseMap(url) {
    var texture = new EZ3.Texture2D(requests.addImageRequest(baseUrl + url, that.cached, that.crossOrigin));
    var i;

    for (i = 0; i < currents.length; i++)
      currents[i].diffuseMap = texture;
  }

  function init() {
    var lines = data.split('\n');
    var line;
    var key;
    var value;
    var i;
    var j;

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      j = line.indexOf(' ');

      key = (j >= 0) ? line.substring(0, j) : line;
      key = key.toLowerCase();

      value = (j >= 0) ? line.substring(j + 1) : '';
      value = value.trim();

      if (key === 'newmtl')
        currents = materials[value];
      else if (currents) {
        if (key === 'kd')
          processDiffuse(value);
        else if (key === 'ks')
          processSpecular(value);
        else if (key === 'map_kd')
          processDiffuseMap(value);
        else if (key === 'd')
          processTransparency(value);
        else if (key === 'tr')
          processTransparency(value, true);
      }
    }
  }

  init();
};

EZ3.OBJRequest.prototype._parseOBJ = function(data, onLoad) {
  var that = this;
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var fixedIndices = [];
  var fixedVertices = [];
  var fixedNormals = [];
  var fixedUvs = [];

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

  function processMesh(mesh) {
    if (fixedIndices.length) {
      mesh.geometry.buffers.addTriangularBuffer(fixedIndices, (fixedVertices.length / 3) > EZ3.Math.MAX_USHORT);
      mesh.geometry.buffers.addPositionBuffer(fixedVertices);

      if (fixedUvs.length) {
        mesh.geometry.buffers.addUvBuffer(fixedUvs);
        fixedUvs = [];
      }

      if (fixedNormals.length) {
        mesh.geometry.buffers.addNormalBuffer(fixedNormals);
        fixedNormals = [];
      }

      indices = [];
      fixedIndices = [];
      fixedVertices = [];

      that.asset.add(mesh);

      return new EZ3.Mesh();
    }

    return mesh;
  }

  function processLibraries(libraries, materials) {
    var requests = new EZ3.RequestManager();
    var baseUrl = EZ3.toBaseUrl(that.url);
    var files = [];
    var i;

    for (i = 0; i < libraries.length; i++)
      files.push(requests.addFileRequest(baseUrl + libraries[i], that.cached, that.crossOrigin));

    requests.onComplete.add(function() {
      for (i = 0; i < files.length; i++)
        that._parseMTL(baseUrl, files[i].data, materials, requests);

      requests.onComplete.removeAll();
      requests.onComplete.add(function() {
        onLoad(that.url, that.asset);
      });

      requests.start();
    });

    requests.start();
  }

  function init() {
    var mesh = new EZ3.Mesh();
    var libraries = [];
    var materials = [];
    var lines = data.split('\n');
    var line;
    var result;
    var i;

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
        mesh = processMesh(mesh);
        mesh.name = line.substring(2).trim();
      } else if (/^usemtl/.test(line)) {
        mesh = processMesh(mesh);
        mesh.material.name = line.substring(7).trim();

        if (!materials[mesh.material.name])
          materials[mesh.material.name] = [];

        materials[mesh.material.name].push(mesh.material);
      }
    }

    processMesh(mesh);
    processLibraries(libraries, materials);
  }

  init();
};

EZ3.OBJRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.crossOrigin);

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url, true);

    that._parseOBJ(assets.get(that.url).data, onLoad);
  });

  requests.send();
};

/**
 * @class OFFRequest
 * @extends Request
 */

EZ3.OFFRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Mesh(), cached, crossOrigin);
};

EZ3.OFFRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.OFFRequest.prototype.constructor = EZ3.OFFRequest;

EZ3.OFFRequest.prototype._parse = function(data, onLoad, onError) {
  var that = this;
  var indices = [];
  var vertices = [];

  function triangulate(face) {
    var data = [];
    var length;
    var i;

    face = face.split(' ');
    length = parseInt(face[0]);

    for (i = 2; i < length; i++)
      data.push(face[1], face[i], face[i + 1]);

    return data;
  }

  function processVertex(vertex) {
    var i;

    for (i = 0; i < 3; i++)
      vertices.push(parseFloat(vertex[i]));
  }

  function processFace(face) {
    var i;

    for (i = 0; i < face.length; i++)
      indices.push(parseInt(face[i]));
  }

  function init() {
    var lines = data.split('\n');
    var i = 0;
    var j = 0;
    var numVertices;
    var numFaces;
    var line;

    line = lines[j++];

    if (!/OFF/g.exec(line))
      onError(that.url);

    line = lines[j++].trim().replace(/ +(?= )/g, '').split(' ');

    numVertices = parseInt(line[0]);
    numFaces = parseInt(line[1]);

    while (i < numVertices) {
      line = lines[j++].trim().replace(/ +(?= )/g, '');

      if (line.length === 0 || line.charAt(0) === '#')
        continue;

      processVertex(line.split(' '));

      i++;
    }

    i = 0;

    while (i < numFaces) {
      line = lines[j++].trim().replace(/ +(?= )/g, '');

      if (line.length === 0 || line.charAt(0) === '#')
        continue;

      processFace(triangulate(line));

      i++;
    }

    that.asset.geometry.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
    that.asset.geometry.buffers.addPositionBuffer(vertices);

    onLoad(that.url, that.asset);
  }

  init();
};

EZ3.OFFRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.cached, this.crossOrigin);

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad, onError);
  });

  requests.send();
};

/**
 * @class TGARequest
 * @extends Request
 */

EZ3.TGARequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), cached, crossOrigin);
};

EZ3.TGARequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.TGARequest.prototype.constructor = EZ3.TGARequest;

EZ3.TGARequest.prototype._parse = function(data, onLoad, onError) {
  var TYPE_NO_DATA = 0;
  var TYPE_INDEXED = 1;
  var TYPE_RGB = 2;
  var TYPE_GREY = 3;
  var TYPE_RLE_INDEXED = 9;
  var TYPE_RLE_RGB = 10;
  var TYPE_RLE_GREY = 11;
  var ORIGIN_MASK = 0x30;
  var ORIGIN_SHIFT = 0x04;
  var ORIGIN_BL = 0x00;
  var ORIGIN_BR = 0x01;
  var ORIGIN_UL = 0x02;
  var ORIGIN_UR = 0x03;
  var that = this;

  function checkHeader(header) {
    switch (header.imageType) {
      case TYPE_INDEXED:
      case TYPE_RLE_INDEXED:
        if (header.colormapLength > 256 || header.colormapSize !== 24 || header.colormapType !== 1)
          onError(that.url);
        break;
      case TYPE_RGB:
      case TYPE_GREY:
      case TYPE_RLE_RGB:
      case TYPE_RLE_GREY:
        if (header.colormapType)
          onError(that.url);
        break;
      case TYPE_NO_DATA:
        onError(that.url);
        break;
      default:
        onError(that.url);
    }

    if (header.width <= 0 || header.height <= 0)
      onError(that.url);

    if (header.pixelSize !== 8 && header.pixelSize !== 16 && header.pixelSize !== 24 && header.pixelSize !== 32)
      onError(that.url);
  }

  function processData(useRle, usePal, header, offset, data) {
    var pixelSize =  header.pixelSize >> 3;
    var pixelTotal = header.width * header.height * pixelSize;
    var pixelData;
    var palettes;
    var pixels;
    var shift;
    var count;
    var c;
    var i;

    if (usePal)
      palettes = data.subarray(offset, offset += header.colormapLength * (header.colormapSize >> 3));

    if (useRle) {
      pixelData = new Uint8Array(pixelTotal);
      pixels = new Uint8Array(pixelSize);
      shift = 0;

      while (shift < pixelTotal) {
        c = data[offset++];
        count = (c & 0x7f) + 1;

        if (c & 0x80) {
          for (i = 0; i < pixelSize; ++i)
            pixels[i] = data[offset++];

          for (i = 0; i < count; ++i)
            pixelData.set(pixels, shift + i * pixelSize);

          shift += pixelSize * count;
        } else {
          count *= pixelSize;

          for (i = 0; i < count; ++i)
            pixelData[shift + i] = data[offset++];

          shift += count;
        }
      }
    } else
      pixelData = data.subarray(offset, offset += (usePal ? header.width * header.height : pixelTotal));

    return {
      pixelData: pixelData,
      palettes: palettes
    };
  }

  function processImageData8bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palettes) {
    var colormap = palettes;
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i++) {
        color = image[i];
        imageData[(x + width * y) * 4 + 3] = 255;
        imageData[(x + width * y) * 4 + 2] = colormap[(color * 3) + 0];
        imageData[(x + width * y) * 4 + 1] = colormap[(color * 3) + 1];
        imageData[(x + width * y) * 4 + 0] = colormap[(color * 3) + 2];
      }
    }

    return imageData;
  }

  function processImageData16bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 2) {
        color = image[i + 0] + (image[i + 1] << 8);
        imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
        imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
        imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
        imageData[(x + width * y) * 4 + 3] = (color & 0x8000) ? 0 : 255;
      }
    }

    return imageData;
  }

  function processImageData24bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 3) {
        imageData[(x + width * y) * 4 + 3] = 255;
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 1];
        imageData[(x + width * y) * 4 + 0] = image[i + 2];
      }
    }

    return imageData;
  }

  function processImageData32bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 4) {
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 1];
        imageData[(x + width * y) * 4 + 0] = image[i + 2];
        imageData[(x + width * y) * 4 + 3] = image[i + 3];
      }
    }

    return imageData;
  }

  function processImageDataGrey8bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i++) {
        color = image[i];
        imageData[(x + width * y) * 4 + 0] = color;
        imageData[(x + width * y) * 4 + 1] = color;
        imageData[(x + width * y) * 4 + 2] = color;
        imageData[(x + width * y) * 4 + 3] = 255;
      }
    }

    return imageData;
  }

  function processImageDataGrey16bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 2) {
        imageData[(x + width * y) * 4 + 0] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 0];
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 3] = image[i + 1];
      }
    }

    return imageData;
  }

  function processImageData(useGrey, header, image, palette) {
    var width = header.width;
    var height = header.height;
    var data = new Uint8Array(width * height * 4);
    var xStart;
    var yStart;
    var xStep;
    var yStep;
    var xEnd;
    var yEnd;

    switch ((header.flags & ORIGIN_MASK) >> ORIGIN_SHIFT) {
      default:
      case ORIGIN_UL:
        xStart = 0;
        xStep = 1;
        xEnd = width;
        yStart = 0;
        yStep = 1;
        yEnd = height;
      break;

      case ORIGIN_BL:
        xStart = 0;
        xStep = 1;
        xEnd = width;
        yStart = height - 1;
        yStep = -1;
        yEnd = -1;
        break;

      case ORIGIN_UR:
        xStart = width - 1;
        xStep = -1;
        xEnd = -1;
        yStart = 0;
        yStep = 1;
        yEnd = height;
        break;

      case ORIGIN_BR:
        xStart = width - 1;
        xStep = -1;
        xEnd = -1;
        yStart = height - 1;
        yStep = -1;
        yEnd = -1;
        break;
    }

    if (useGrey) {
      switch (header.pixelSize) {
        case 8:
          processImageDataGrey8bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        case 16:
          processImageDataGrey16bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        default:
          onError(that.url);
          break;
      }
    } else {
      switch (header.pixelSize) {
        case 8:
          processImageData8bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palette);
          break;

        case 16:
          processImageData16bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 24:
          processImageData24bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 32:
          processImageData32bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        default:
          onError(that.url);
          break;
      }
    }

    return data;
  }

  function init() {
    var useRle = false;
    var usePal = false;
    var useGrey = false;
    var content;
    var offset;
    var header;
    var result;

    if (data.length < 19)
      onError(that.url);

    content = new Uint8Array(data);
    offset = 0;
    header = {
      idLenght: content[offset++],
      colormapType: content[offset++],
      imageType: content[offset++],
      colormapIndex: content[offset++] | content[offset++] << 8,
      colormapLength: content[offset++] | content[offset++] << 8,
      colormapSize: content[offset++],
      origin: [
        content[offset++] | content[offset++] << 8,
        content[offset++] | content[offset++] << 8
      ],
      width: content[offset++] | content[offset++] << 8,
      height: content[offset++] | content[offset++] << 8,
      pixelSize: content[offset++],
      flags: content[offset++]
    };

    checkHeader(header);

    if (header.idLenght + offset > data.length)
      onError(that.url);

    offset += header.idLenght;

    switch (header.imageType) {
      case TYPE_RLE_INDEXED:
        useRle = true;
        usePal = true;
        break;

      case TYPE_INDEXED:
        usePal = true;
        break;

      case TYPE_RLE_RGB:
        useRle = true;
        break;

      case TYPE_RGB:
        break;

      case TYPE_RLE_GREY:
        useRle = true;
        useGrey = true;
        break;

      case TYPE_GREY:
        useGrey = true;
        break;
    }

    result = processData(useRle, usePal, header, offset, content);

    that.asset.data = processImageData(useGrey, header, result.pixelData, result.palettes);
    that.asset.width = header.width;
    that.asset.height = header.height;

    onLoad(that.url, that.asset, that.cached);
  }

  init();
};

EZ3.TGARequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, false, this.crossOrigin, 'arraybuffer');

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad);
  });

  requests.send();
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

  this.shading = EZ3.MeshMaterial.SMOOTH;

  this.normalMap = null;
  this.diffuseMap = null;
  this.emissiveMap = null;
  this.specularMap = null;
  this.environmentMap = null;

  this.reflective = false;
  this.refractive = false;

  this.diffuseReflection = EZ3.MeshMaterial.LAMBERT;
  this.specularReflection = EZ3.MeshMaterial.BLINN_PHONG;

  this.albedo = 3.0;
  this.fresnel = 0.0;
  this.opacity = 1.0;
  this.shininess = 180;
  this.refractiveIndex = 1.0;
  this.diffuseRoughness = 0.2;
  this.specularRoughness = 0.2;

  this.morphTarget = false;
  this.tick = 0;
};

EZ3.MeshMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.MeshMaterial.prototype.constructor = EZ3.Material;

EZ3.MeshMaterial.prototype.updateProgram = function(gl, state, lights, shadowReceiver) {
  var id = 'MESH.';
  var defines = [];
  var prefix = '#define ';

  defines.push('MAX_POINT_LIGHTS ' + lights.point.length);
  defines.push('MAX_DIRECTIONAL_LIGHTS ' + lights.directional.length);
  defines.push('MAX_SPOT_LIGHTS ' + lights.spot.length);

  if(this.morphTarget)
    defines.push('MORPH_TARGET');

  if(this.shading === EZ3.MeshMaterial.FLAT)
    defines.push('FLAT');

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

  if(shadowReceiver)
    defines.push('SHADOW_MAP');

  id += defines.join('.');
  prefix += defines.join('\n ' + prefix) + '\n';

  if (this._id !== id) {
    this._id = id;
    this.program = state.createProgram(id, EZ3.ShaderLibrary.mesh.vertex, EZ3.ShaderLibrary.mesh.fragment, prefix);
  }
};

EZ3.MeshMaterial.prototype.updateUniforms = function(gl, state, capabilities) {
  this.program.loadUniformFloat(gl, 'uEmissive', this.emissive);
  this.program.loadUniformFloat(gl, 'uDiffuse', this.diffuse);
  this.program.loadUniformFloat(gl, 'uSpecular', this.specular);
  this.program.loadUniformFloat(gl, 'uShininess', this.shininess);
  this.program.loadUniformFloat(gl, 'uOpacity', this.opacity);

  if (this.morphTarget) {
    this.program.loadUniformFloat(gl, 'uInfluence1', this.tick);
    this.program.loadUniformFloat(gl, 'uInfluence2', 1 - this.tick);

    this.tick += 0.01;

    if (this.tick >= 1)
      this.tick = 0;
  }

  if (this.emissiveMap instanceof EZ3.Texture2D) {
    this.emissiveMap.bind(gl, state, capabilities);
    this.emissiveMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEmissiveSampler', state.usedTextureSlots++);
  }

  if (this.diffuseMap instanceof EZ3.Texture2D) {
    this.diffuseMap.bind(gl, state, capabilities);
    this.diffuseMap.update(gl);

    this.program.loadUniformInteger(gl, 'uDiffuseSampler', state.usedTextureSlots++);
  }

  if (this.normalMap instanceof EZ3.Texture2D) {
    this.normalMap.bind(gl, state, capabilities);
    this.normalMap.update(gl);

    this.program.loadUniformInteger(gl, 'uNormalSampler', state.usedTextureSlots++);
  }

  if(this.environmentMap instanceof EZ3.Cubemap) {
    this.environmentMap.bind(gl, state, capabilities);
    this.environmentMap.update(gl);

    this.program.loadUniformInteger(gl, 'uEnvironmentSampler', state.usedTextureSlots++);
  }

  if(this.refractive)
    this.program.loadUniformFloat(gl, 'uRefractiveIndex', this.refractiveIndex);

  if(this.diffuseReflection === EZ3.MeshMaterial.OREN_NAYAR) {
    this.program.loadUniformFloat(gl, 'uAlbedo', this.albedo);
    this.program.loadUniformFloat(gl, 'uDiffuseRoughness', this.diffuseRoughness);
  }

  if(this.specularReflection === EZ3.MeshMaterial.COOK_TORRANCE) {
    this.program.loadUniformFloat(gl, 'uFresnel', this.fresnel);
    this.program.loadUniformFloat(gl, 'uSpecularRoughness', this.specularRoughness);
  }
};

EZ3.MeshMaterial.FLAT = 0;
EZ3.MeshMaterial.SMOOTH = 1;

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
  EZ3.Material.call(this, 'SHADER.' + id);

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
  if (!this.program)
    this.program = state.createProgram(this._id, this._vertex, this._fragment);
};

EZ3.ShaderMaterial.prototype.updateUniforms = function(gl, state, capabilities) {
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

    texture.bind(gl, state, capabilities);
    texture.update(gl);

    this.program.loadUniformInteger(gl, name, state.usedTextureSlots++);
  }
};

EZ3.ShaderMaterial.prototype.setUniformInteger = function(name, value) {
  this._uniformIntegers[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformFloat = function(name, value) {
  this._uniformFloats[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformMatrix = function(name, value) {
  this._uniformMatrices[name] = value;
};

EZ3.ShaderMaterial.prototype.setUniformTexture = function(name, value) {
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

EZ3.Cubemap.prototype.bind = function(gl, state, capabilities) {
  EZ3.Texture.prototype.bind.call(this, gl,  state, capabilities, gl.TEXTURE_CUBE_MAP);
};

EZ3.Cubemap.prototype.update = function(gl) {
  var k;

  if (this.needUpdate) {
    for(k = 0; k < 6; k++)
      EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X + k, this._images[k]);

    EZ3.Texture.prototype._updateMipmaps.call(this, gl, gl.TEXTURE_CUBE_MAP);

    this.needUpdate = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_CUBE_MAP);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

EZ3.Cubemap.prototype.setImage = function(target, image) {
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

EZ3.Texture2D.prototype.bind = function(gl, state, capabilities) {
  EZ3.Texture.prototype.bind.call(this, gl, state, capabilities, gl.TEXTURE_2D);
};

EZ3.Texture2D.prototype.update = function(gl) {
  if (this.needUpdate) {
    EZ3.Texture.prototype._updateImage.call(this, gl, gl.TEXTURE_2D, this.image);
    EZ3.Texture.prototype._updateMipmaps.call(this, gl, gl.TEXTURE_2D);

    this.needUpdate = false;
  }

  EZ3.Texture.prototype._updateParameters.call(this, gl, gl.TEXTURE_2D);
  EZ3.Texture.prototype._updatePixelStore.call(this, gl);
};

/**
 * @class EZ3.FreeControl
 * @extends EZ3.CameraControl
 * @constructor
 * @param {EZ3.Entity} entity
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.FreeControl = function(entity, target, up) {
  EZ3.CameraControl.call(this, entity, target, up);
};

EZ3.FreeControl.prototype = Object.create(EZ3.CameraControl.prototype);
EZ3.FreeControl.prototype.constructor = EZ3.FreeControl;

/**
 * @method EZ3.FreeControl#rotate
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.FreeControl.prototype.rotate = function(dx, dy, speed) {
  var matrix;

  EZ3.CameraControl.prototype.rotate.call(this, dx, dy, speed);

  matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);

  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMatrix4(matrix).toVector3();
  this.look = new EZ3.Vector4(0, 0, 1, 0).mulMatrix4(matrix).toVector3();
  this.right = new EZ3.Vector4(-1, 0, 0, 0).mulMatrix4(matrix).toVector3();

  this.target = new EZ3.Vector3().add(this.entity.position, this.look);

  this.entity.lookAt(this.target, this.up);
};

/**
 * @method EZ3.FreeControl#lift
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.lift = function(speed) {
  var lift = this.up.clone().scale(speed);
  this.entity.position.add(lift);
};

/**
 * @method EZ3.FreeControl#walk
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.walk = function(speed) {
  var walk = this.look.clone().scale(speed);
  this.entity.position.add(walk);
};

/**
 * @method EZ3.FreeControl#strafe
 * @param {Number} speed
 */
EZ3.FreeControl.prototype.strafe = function(speed) {
  var strafe = this.right.clone().scale(speed);
  this.entity.position.add(strafe);
};

/**
 * @class EZ3.TargetControl
 * @extends EZ3.CameraControl
 * @constructor
 * @param {EZ3.Entity} entity
 * @param {EZ3.Vector3} [target]
 * @param {EZ3.Vector3} [up]
 */
EZ3.TargetControl = function(entity, target, up) {
  EZ3.CameraControl.call(this, entity, target, up);
};

EZ3.TargetControl.prototype = Object.create(EZ3.CameraControl.prototype);
EZ3.TargetControl.prototype.constructor = EZ3.TargetControl;

/**
 * @method EZ3.TargetControl#rotate
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.TargetControl.prototype.rotate = function(dx, dy, speed) {
  var matrix;
  var vector;

  EZ3.CameraControl.prototype.rotate.call(this, dx, dy, speed);

  matrix = new EZ3.Matrix4().yawPitchRoll(this.yaw, this.pitch, this.roll);
  vector = new EZ3.Vector4(0, 0, -1, 0).mulMatrix4(matrix).toVector3();

  this.distance = new EZ3.Vector3().sub(this.entity.position, this.target).length();
  this.distance = Math.max(1, this.distance);

  vector.scale(this.distance);

  this.entity.position = new EZ3.Vector3().add(this.target, vector);
  this.look = new EZ3.Vector3().sub(this.target, this.entity.position);
  this.up = new EZ3.Vector4(0, 1, 0, 0).mulMatrix4(matrix).toVector3();
  this.right = new EZ3.Vector3().cross(this.look.normalize(), this.up);

  this.entity.lookAt(this.target, this.up);
};

/**
 * @method EZ3.TargetControl#pan
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} [speed]
 */
EZ3.TargetControl.prototype.pan = function(dx, dy, speed) {
  var rx;
  var ry;
  var up;
  var right;
  var vector;

  speed = (speed !== undefined) ? speed : 100;

  rx = dx * speed;
  ry = -dy * speed;

  right = new EZ3.Vector3().copy(this.right).scale(rx);
  up = new EZ3.Vector3().copy(this.up).scale(ry);
  vector = new EZ3.Vector3().add(right, up);

  this.entity.position.add(vector);
  this.target.add(vector);
};

/**
 * @method EZ3.TargetControl#zoom
 * @param {Number} speed
 */
EZ3.TargetControl.prototype.zoom = function(speed) {
  var look = this.look.clone().scale(speed);
  this.entity.position.add(look);
};

/**
 * @class EZ3.OrthographicCamera
 * @extends EZ3.Camera
 * @constructor
 * @param {Number} [left]
 * @param {Number} [right]
 * @param {Number} [top]
 * @param {Number} [bottom]
 * @param {Number} [near]
 * @param {Number} [far]
 */

EZ3.OrthographicCamera = function(left, right, top, bottom, near, far) {
  EZ3.Camera.call(this);

  /**
   * @property {Number} left
   * @default -25
   */
  this.left = (left !== undefined) ? left : -25;

  /**
   * @property {Number} right
   * @default 25
   */
  this.right = (right !== undefined) ? right : 25;

  /**
   * @property {Number} top
   * @default 25
   */
  this.top = (top !== undefined) ? top : 25;

  /**
   * @property {Number} bottom
   * @default -25
   */
  this.bottom = (bottom !== undefined) ? bottom : -25;

  /**
   * @property {Number} near
   * @default 0.1
   */
  this.near = (near !== undefined) ? near : 0.1;

  /**
   * @property {Number} far
   * @default 2000
   */
  this.far = (far !== undefined) ? far : 2000;
};

EZ3.OrthographicCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.OrthographicCamera.prototype.constructor = EZ3.OrthographicCamera;

/**
 * @method EZ3.OrthographicCamera#updateProjection
 */
EZ3.OrthographicCamera.prototype.updateProjection = function() {
  var changed = false;
  var dx;
	var dy;
	var cx;
	var cy;

  if(this._cache.left !== this.left) {
    this._cache.left = this.left;
    changed = true;
  }

  if(this._cache.right !== this.right) {
    this._cache.right = this.right;
    changed = true;
  }

  if(this._cache.top !== this.top) {
    this._cache.top = this.top;
    changed = true;
  }

  if(this._cache.bottom !== this.bottom) {
    this._cache.bottom = this.bottom;
    changed = true;
  }

  if(this._cache.near !== this.near) {
    this._cache.near = this.near;
    changed = true;
  }

  if(this._cache.far !== this.far) {
    this._cache.far = this.far;
    changed = true;
  }

  if(changed) {
    dx = (this.right - this.left) / 2;
    dy = (this.top - this.bottom) / 2;
    cx = (this.right + this.left) / 2;
    cy = (this.top + this.bottom) / 2;

    this.projection.orthographic(cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far);
  }
};

/**
 * @class EZ3.PerspectiveCamera
 * @extends EZ3.Camera
 * @constructor
 * @param {Number} [fov]
 * @param {Number} [aspect]
 * @param {Number} [near]
 * @param {Number} [far]
 */
EZ3.PerspectiveCamera = function(fov, aspect, near, far) {
  EZ3.Camera.call(this);

  /**
   * @property {Number} fov
   * @default 70
   */
  this.fov = (fov !== undefined) ? fov : 70;

  /**
   * @property {Number} aspect
   * @default 1
   */
  this.aspect = (aspect !== undefined) ? aspect : 1;

  /**
   * @property {Number} near
   * @default 0.1
   */
  this.near = (near !== undefined) ? near : 0.1;

  /**
   * @property {Number} far
   * @default 2000
   */
  this.far = (far !== undefined) ? far : 2000;
};

EZ3.PerspectiveCamera.prototype = Object.create(EZ3.Camera.prototype);
EZ3.PerspectiveCamera.prototype.constructor = EZ3.PerspectiveCamera;

/**
 * @method EZ3.PerspectiveCamera#updateProjection
 */
EZ3.PerspectiveCamera.prototype.updateProjection = function() {
  var changed = false;

  if(this._cache.fov !== this.fov) {
    this._cache.fov = this.fov;
    changed = true;
  }

  if(this._cache.aspect !== this.aspect) {
    this._cache.aspect = this.aspect;
    changed = true;
  }

  if(this._cache.near !== this.near) {
    this._cache.near = this.near;
    changed = true;
  }

  if(this._cache.far !== this.far) {
    this._cache.far = this.far;
    changed = true;
  }

  if(changed)
    this.projection.perspective(this.fov, this.aspect, this.near, this.far);
};

/**
 * @class AstroidalEllipsoid
 * @extends Primitive
 */

EZ3.AstroidalEllipsoid = function(resolution, radiouses) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiouses = radiouses || new EZ3.Vector3(90, 90, 90);
  this.resolution = resolution || new EZ3.Vector2(150, 150);
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.AstroidalEllipsoid.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var phi;
  var rho;
  var cosr;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u - EZ3.Math.PI;
      rho = EZ3.Math.PI * v - EZ3.Math.HALF_PI;

      cosr = Math.pow(Math.cos(rho), 3.0);

      vertex.x = (this.radiouses.x * cosr * Math.pow(Math.cos(phi), 3.0));
      vertex.y = (this.radiouses.y * Math.pow(Math.sin(rho), 3.0));
      vertex.z = (this.radiouses.z * cosr * Math.pow(Math.sin(phi), 3.0));

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.x /= this.radiouses.x;
      vertex.y /= this.radiouses.y;
      vertex.z /= this.radiouses.z;

      if (!vertex.isZeroVector())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; s++) {
    for (t = 0; t < this.resolution.y - 1; t++) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.AstroidalEllipsoid.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (!this.radiouses.isEqual(this._cache.radiouses)) {
      this._cache.radiouses = this.radiouses.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});

/**
 * @class Box
 * @extends Primitive
 */

EZ3.Box = function(resolution, dimensions) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.dimensions = dimensions || new EZ3.Vector3(1, 1, 1);
  this.resolution = resolution || new EZ3.Vector3(1, 1, 1);
};

EZ3.Box.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Box.prototype.generate = function() {
  var that = this;
  var uvs = [];
  var indices = [];
  var vertices = [];
  var normals = [];
  var widthHalf = this.dimensions.x * 0.5;
  var heightHalf = this.dimensions.y * 0.5;
  var depthHalf = this.dimensions.z * 0.5;

  function computeFace(u, v, udir, vdir, width, height, depth) {
    var gridX = that.resolution.x;
    var gridY = that.resolution.y;
    var widthHalf = width * 0.5;
    var heightHalf = height * 0.5;
    var offset = vertices.length / 3;
    var vector = new EZ3.Vector3();
    var normal = new EZ3.Vector3();
    var segmentWidth;
    var segmentHeight;
    var a;
    var w;
    var s;
    var t;

    if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x'))
      w = 'z';
    else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
      w = 'y';
      gridY = that.resolution.z;
    } else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
      w = 'x';
      gridX = that.resolution.z;
    }

    normal[w] = (depth > 0) ? 1 : -1;

    segmentWidth = width / gridX;
    segmentHeight = height / gridY;

    for (s = 0; s < gridY + 1; s++) {
      for (t = 0; t < gridX + 1; t++) {
        vector[u] = (t * segmentWidth - widthHalf) * udir;
        vector[v] = (s * segmentHeight - heightHalf) * vdir;
        vector[w] = depth;

        uvs.push(t / gridX, s / gridY);
        vertices.push(vector.x, vector.y, vector.z);
        normals.push(normal.x, normal.y, normal.z);
      }
    }

    for (s = 0; s < gridY; s++) {
      for (t = 0; t < gridX; t++) {
        a = offset + (s * (gridX + 1) + t);
        w = offset + ((s + 1) * (gridX + 1) + (t + 1));

        indices.push(a, w, offset + (s * (gridX + 1) + (t + 1)));
        indices.push(a, offset + ((s + 1) * (gridX + 1) + t), w);
      }
    }
  }

  computeFace('z', 'y', -1, -1, this.dimensions.z, this.dimensions.y, widthHalf);
  computeFace('z', 'y', 1, -1, this.dimensions.z, this.dimensions.y, -widthHalf);
  computeFace('x', 'z', 1, 1, this.dimensions.x, this.dimensions.z, heightHalf);
  computeFace('x', 'z', 1, -1, this.dimensions.x, this.dimensions.z, -heightHalf);
  computeFace('x', 'y', 1, -1, this.dimensions.x, this.dimensions.y, depthHalf);
  computeFace('x', 'y', -1, -1, this.dimensions.x, this.dimensions.y, -depthHalf);

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Box.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (!this.dimensions.isEqual(this._cache.dimensions)) {
      this._cache.dimensions = this.dimensions.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});

/**
 * @class Ellipsoid
 * @extends Primitive
 */

EZ3.Ellipsoid = function(resolution, radiouses) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiouses = radiouses || new EZ3.Vector3(10, 5, 10);
  this.resolution = resolution || new EZ3.Vector2(100, 100);
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

EZ3.Ellipsoid.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var phi;
  var rho;
  var sinr;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      sinr = Math.sin(rho);

      vertex.x = this.radiouses.x * Math.cos(phi) * sinr;
      vertex.y = this.radiouses.y * Math.sin(rho - EZ3.Math.HALF_PI);
      vertex.z = this.radiouses.z * Math.sin(phi) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.x /= this.radiouses.x;
      vertex.y /= this.radiouses.y;
      vertex.z /= this.radiouses.z;

      if (!vertex.isZeroVector())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; s++) {
    for (t = 0; t < this.resolution.y - 1; t++) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Ellipsoid.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (!this.radiouses.isEqual(this._cache.radiouses)) {
      this._cache.radiouses = this.radiouses.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});

/**
 * @class Plane
 * @extends Primitive
 */

EZ3.Plane = function(resolution) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.resolution = resolution || new EZ3.Vector2(2, 2);
};

EZ3.Plane.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Plane.prototype.constructor = EZ3.Plane;

EZ3.Plane.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var a;
  var b;
  var c;
  var d;
  var x;
  var z;

  for (z = 0; z < this.resolution.x + 1; ++z) {
    for (x = 0; x < this.resolution.y + 1; ++x) {
      vertices.push(x, 0, z);
      normals.push(0, 1, 0);
      uvs.push(x / this.resolution.y, z / this.resolution.x);
    }
  }

  for (z = 0; z < this.resolution.x; ++z) {
    for (x = 0; x < this.resolution.y; ++x) {
      a = z * (this.resolution.x + 1) + x;
      b = a + 1;
      c = a + (this.resolution.x + 1);
      d = c + 1;

      indices.push(a, c, b, b, c, d);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Plane.prototype, 'needGenerate', {
  get: function() {
    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      return true;
    }

    return false;
  }
});

/**
 * @class Sphere
 * @extends Primitive
 */

EZ3.Sphere = function(resolution, radius) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radius = radius || 5;
  this.resolution = resolution || new EZ3.Vector2(6, 6);
};

EZ3.Sphere.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Sphere.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var phi;
  var rho;
  var sinr;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      phi = EZ3.Math.DOUBLE_PI * u;
      rho = EZ3.Math.PI * v;

      sinr = Math.sin(rho);

      vertex.x = this.radius * Math.cos(phi) * sinr;
      vertex.y = this.radius * Math.sin(rho - EZ3.Math.HALF_PI);
      vertex.z = this.radius * Math.sin(phi) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      if (!vertex.isZeroVector())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Sphere.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (this._cache.radius !== this.radius) {
      this._cache.radius = this.radius;
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});

/**
 * @class Torus
 * @extends Primitive
 */

EZ3.Torus = function(resolution, radiouses) {
  EZ3.Primitive.call(this);

  this._cache = {};

  this.radiouses = radiouses || new EZ3.Vector2(7, 3);
  this.resolution = resolution || new EZ3.Vector2(5, 5);
};

EZ3.Torus.prototype = Object.create(EZ3.Primitive.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Torus.prototype.generate = function() {
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var vertex = new EZ3.Vector3();
  var center = new EZ3.Vector3();
  var rho;
  var phi;
  var cosr;
  var sinr;
  var cosp;
  var u;
  var v;
  var s;
  var t;

  for (s = 0; s < this.resolution.x; s++) {
    u = s / (this.resolution.x - 1);

    for (t = 0; t < this.resolution.y; t++) {
      v = t / (this.resolution.y - 1);

      rho = EZ3.Math.DOUBLE_PI * u;
      phi = EZ3.Math.DOUBLE_PI * v;

      cosr = Math.cos(rho);
      sinr = Math.sin(rho);
      cosp = Math.cos(phi);

      center.x = this.radiouses.x * cosr;
      center.z = this.radiouses.x * sinr;

      vertex.x = (this.radiouses.x + this.radiouses.y * cosp) * cosr;
      vertex.y = (this.radiouses.y * Math.sin(phi));
      vertex.z = (this.radiouses.x + this.radiouses.y * cosp) * sinr;

      vertices.push(vertex.x, vertex.y, vertex.z);

      vertex.sub(center);

      if (!vertex.isZeroVector())
        vertex.normalize();

      normals.push(vertex.x, vertex.y, vertex.z);

      uvs.push(u, v);
    }
  }

  for (s = 0; s < this.resolution.x - 1; ++s) {
    for (t = 0; t < this.resolution.y - 1; ++t) {
      u = s * this.resolution.y + t;
      v = (s + 1) * this.resolution.y + (t + 1);

      indices.push(u, s * this.resolution.y + (t + 1), v);
      indices.push(u, v, (s + 1) * this.resolution.y + t);
    }
  }

  this.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
  this.buffers.addPositionBuffer(vertices);
  this.buffers.addNormalBuffer(normals);
  this.buffers.addUvBuffer(uvs);
};

Object.defineProperty(EZ3.Torus.prototype, 'needGenerate', {
  get: function() {
    var changed = false;

    if (!this.radiouses.isEqual(this._cache.radiouses)) {
      this._cache.radiouses = this.radiouses.clone();
      changed = true;
    }

    if (!this.resolution.isEqual(this._cache.resolution)) {
      this._cache.resolution = this.resolution.clone();
      changed = true;
    }

    return changed;
  }
});

/**
 * @class TargetCubemap
 * @extends Cubemap
 */

 EZ3.TargetCubemap = function(size, format, attachment) {
   EZ3.Cubemap.call(this,
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     new EZ3.Image(size.x, size.y, format, null),
     false
   );

   this.attachment = attachment;
 };

 EZ3.TargetCubemap.prototype = Object.create(EZ3.Cubemap.prototype);
 EZ3.TargetCubemap.prototype.constructor = EZ3.TargetCubemap;

 EZ3.TargetCubemap.prototype.attach = function(gl, face) {
   var index = face || 0;

   gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachment, gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, this._id, 0);
 };

/**
 * @class TargetTexture2D
 * @extends Texture2D
 */

 EZ3.TargetTexture2D = function(size, format, attachment) {
   EZ3.Texture2D.call(this, new EZ3.Image(size.x, size.y, format, null), false);

   this.attachment = attachment;
 };

 EZ3.TargetTexture2D.prototype = Object.create(EZ3.Texture2D.prototype);
 EZ3.TargetTexture2D.prototype.constructor = EZ3.TargetTexture2D;

 EZ3.TargetTexture2D.prototype.attach = function(gl) {
   gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachment, gl.TEXTURE_2D, this._id, 0);
 };
