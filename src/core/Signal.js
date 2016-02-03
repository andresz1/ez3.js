/**
 * @class EZ3.Signal
 * @constructor
 */
EZ3.Signal = function() {
  var that = this;

  /**
   * @property {EZ3.SignalBinding[]} _bindings
   * @private
   */
  this._bindings = [];
  /**
   * @property {Any[]} _prevParams
   * @private
   */
  this._prevParams = null;

  this.dispatch = function() {
    EZ3.Signal.prototype.dispatch.apply(that, arguments);
  };
};

/**
 * @property {Boolean} _shouldPropagate
 * @memberof EZ3.Signal
 * @static
 * @private
 * @default true
 */
EZ3.Signal.prototype._shouldPropagate = true;
/**
 * @property {Boolean} memorize
 * @memberof EZ3.Signal
 * @static
 * @default false
 */
EZ3.Signal.prototype.memorize = false;
/**
 * @property {Boolean} active
 * @memberof EZ3.Signal
 * @static
 * @default true
 */
EZ3.Signal.prototype.active = true;

/**
 * @method EZ3.Signal#_registerListener
 * @private
 * @param {Function} listener
 * @param {Boolean} isOnce
 * @param {Object} [listenerContext]
 * @param {Number} [priority]
 * @return {EZ3.SignalBinding}
 */
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

/**
 * @method EZ3.Signal#_addBinding
 * @private
 * @param {EZ3.SignalBinding} binding
 */
EZ3.Signal.prototype._addBinding = function(binding) {
  var n = this._bindings.length;

  do {
    --n;
  } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);

  this._bindings.splice(n + 1, 0, binding);
};

/**
 * @method EZ3.Signal#_indexOfListener
 * @private
 * @param {Function} listener
 * @param {Object} [context]
 */
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

/**
 * @method EZ3.Signal#has
 * @param {Function} listener
 * @param {Object} [context]
 */
EZ3.Signal.prototype.has = function(listener, context) {
  return this._indexOfListener(listener, context) !== -1;
};

/**
 * @method EZ3.Signal#add
 * @param {Function} listener
 * @param {Object} [listenerContext]
 * @param {Number} [priority]
 * @return {EZ3.SignalBinding}
 */
EZ3.Signal.prototype.add = function(listener, listenerContext, priority) {
  return this._registerListener(listener, false, listenerContext, priority);
};

/**
 * @method EZ3.Signal#addOnce
 * @param {Function} listener
 * @param {Object} [listenerContext]
 * @param {Number} [priority]
 * @return {EZ3.SignalBinding}
 */
EZ3.Signal.prototype.addOnce = function(listener, listenerContext, priority) {
  return this._registerListener(listener, true, listenerContext, priority);
};

/**
 * @method EZ3.Signal#remove
 * @param {Function} listener
 * @param {Object} [context]
 * @return {Function}
 */
EZ3.Signal.prototype.remove = function(listener, context) {
  var i = this._indexOfListener(listener, context);

  if (i !== -1) {
    this._bindings[i]._destroy();
    this._bindings.splice(i, 1);
  }

  return listener;
};

/**
 * @method EZ3.Signal#removeAll
 * @param {Object} [context]
 */
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

/**
 * @method EZ3.Signal#getNumListeners
 * @return {Number}
 */
EZ3.Signal.prototype.getNumListeners = function() {
  return this._bindings.length;
};

/**
 * @method EZ3.Signal#halt
 */
EZ3.Signal.prototype.halt = function() {
  this._shouldPropagate = false;
};

/**
 * @method EZ3.Signal#dispatch
 * @param {Any[]} params
 */
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

/**
 * @method EZ3.Signal#forget
 */
EZ3.Signal.prototype.forget = function() {
  this._prevParams = null;
};

/**
 * @method EZ3.Signal#dispose
 */
EZ3.Signal.prototype.dispose = function() {
  this.removeAll();
  delete this._bindings;
  delete this._prevParams;
};
