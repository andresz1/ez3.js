EZ3.Image = function(url, crossOrigin) {
  this.url = url;
  this.crossOrigin = crossOrigin;
  this.content = new Image();
};

EZ3.Image.prototype._processLoad = function(image, onLoad) {
  this._removeEventHandlers();
  onLoad(this.url, image);
};

EZ3.Image.prototype._processError = function(event, onError) {
  this._removeEventHandlers();
  onError(this.url, event);
};

EZ3.Image.prototype.load = function(onLoad, onError) {
  var that;

  that = this;

  this._onLoad = function() {
    that._processLoad(this, onLoad);
  };

  this._onError = function(event) {
    that._processError(event, onLoad);
  };

  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  if (!this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.src = this.url;
};

EZ3.Image.prototype._removeEventHandlers = function() {
  this.content.addEventListener('load', this._onLoad, false);
  this.content.addEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};
