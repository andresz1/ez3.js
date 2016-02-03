/**
 * @class EZ3.SignalBinding
 * @constructor
 * @param {EZ3.Signal} signal
 * @param {Function} listener
 * @param {Boolean} isOnce
 * @param {Object} [listenerContext]
 * @param {Number} [priority]
 */
EZ3.SignalBinding = function(signal, listener, isOnce, listenerContext, priority) {
  /**
   * @property {EZ3.Signal} _signal
   * @private
   */
  this._signal = signal;
  /**
   * @property {Number} _priority
   * @private
   * @default 0
   */
  this._priority = (priority !== undefined) ? priority : 0;

  /**
   * @property {Function} listener
   */
  this.listener = listener;
  /**
   * @property {Boolean} isOnce
   */
  this.isOnce = isOnce;
  /**
   * @property {Object} context
   */
  this.context = listenerContext;
};

/**
 * @property {Boolean} active
 * @memberof EZ3.SignalBinding
 * @default true
 * @static
 */
EZ3.SignalBinding.prototype.active = true;
/**
 * @property {Number} params
 * @memberof EZ3.SignalBinding
 * @default null
 * @static
 */
EZ3.SignalBinding.prototype.params = null;

/**
 * @method EZ3.SignalBinding#_destroy
 * @private
 */
EZ3.SignalBinding.prototype._destroy = function() {
  delete this._signal;
  delete this.listener;
  delete this.context;
};

/**
 * @method EZ3.SignalBinding#execute
 * @param {Any[]} paramsArr
 * @return Any
 */
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

/**
 * @method EZ3.SignalBinding#detach
 * @return {Function|null}
 */
EZ3.SignalBinding.prototype.detach = function() {
  return this.isBound() ? this._signal.remove(this.listener, this.context) : null;
};

/**
 * @method EZ3.SignalBinding#isBound
 * @return {Boolean}
 */
EZ3.SignalBinding.prototype.isBound = function() {
  return !!this._signal && !!this.listener;
};
