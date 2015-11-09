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
