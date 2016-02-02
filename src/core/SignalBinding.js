/**
 * @class EZ3.SignalBinding
 * @constructor
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
