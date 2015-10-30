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
