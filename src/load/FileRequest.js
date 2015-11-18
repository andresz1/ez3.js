/**
 * @class FileRequest
 * @extends Request
 */

EZ3.FileRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.File(), crossOrigin);

  this._request = new XMLHttpRequest();
};

EZ3.FileRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.FileRequest.prototype.constructor = EZ3.FileRequest;

EZ3.FileRequest.prototype._processLoad = function(data, onLoad) {
  this._removeEventListeners();

  this.asset.data = data.response;

  onLoad(this.url, this.asset);
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

  this._request.send(null);
};
