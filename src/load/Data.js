/**
 * @class Data
 */

EZ3.Data = function(url, crossOrigin) {
  this.content = new XMLHttpRequest();
  this.url = url;
  this.crossOrigin = crossOrigin;
};

EZ3.Data.prototype._processLoad = function(onLoad) {
  this._end();

  onLoad(this);
};

EZ3.Data.prototype._processError = function(onError) {
  this._end();

  onError(this);
};

EZ3.Data.prototype._end = function() {
  this.content.removeEventListener('load', this._onLoad);
  this.content.removeEventListener('error', this._onError);

  delete this._onLoad;
  delete this._onError;
};

EZ3.Data.prototype.load = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(onLoad);
  };

  this._onError = function() {
    that._processError(onError);
  };

  this.content.addEventListener('load', this._onLoad);
  this.content.addEventListener('error', this._onError);

  this.content.open('GET', this.url, true);

  if(this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.send(null);
};
