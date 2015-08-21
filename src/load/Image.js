/**
 * @class Data
 */

EZ3.Image = function(url, crossOrigin) {
  this.content = new Image();
  this.url = url;
  this.crossOrigin = crossOrigin;
};

EZ3.Image.prototype._processLoad = function(onLoad) {
  this._end();

  onLoad(this);
};

EZ3.Image.prototype._processReadyStateChange = function(onLoad) {
  if (this.content.readyState === 'complete') {
    this._end();

    onLoad(this);
  }
};

EZ3.Image.prototype._processError = function(onError) {
  this._end();

  onError(this);
};

EZ3.Image.prototype._end = function() {
  this.content.removeEventListener('load', this._onLoad);
  this.content.removeEventListener('readystatechange', this._onReadyStateChange);
  this.content.removeEventListener('error', this._onError);

  delete this._onLoad;
  delete this._onReadyStateChange;
  delete this._onError;
};

EZ3.Image.prototype.load = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(onLoad);
  };

  this._onReadyStateChange = function() {
    that._processReadyStateChange(onLoad);
  };

  this._onError = function() {
    that._processError(onError);
  };

  this.content.addEventListener('load', this._onLoad);
  this.content.addEventListener('readystatechange', this._onReadyStateChange);
  this.content.addEventListener('error', this._onError);

  if (this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.src = this.url;
};
