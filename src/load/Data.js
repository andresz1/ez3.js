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
