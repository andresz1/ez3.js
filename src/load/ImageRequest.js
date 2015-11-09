/**
 * @class ImageRequest
 * @extends Request
 */

EZ3.ImageRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), crossOrigin);

  this._request = new Image();
};

EZ3.ImageRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.ImageRequest.prototype.constructor = EZ3.ImageRequest;

EZ3.ImageRequest.prototype._processLoad = function(image, onLoad) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  this.response.width = image.width;
  this.response.height = image.height;
  this.response.data = new Uint8Array(context.getImageData(0, 0, image.width, image.height).data);

  this._removeEventListeners();

  onLoad(this.url, this.response);
};

EZ3.ImageRequest.prototype._processError = function(event, onError) {
  this._removeEventListeners();
  onError(this.url, event);
};

EZ3.ImageRequest.prototype._addEventListeners = function(onLoad, onError) {
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

EZ3.ImageRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

EZ3.ImageRequest.prototype.send = function(onLoad, onError) {
  this._addEventListeners(onLoad, onError);

  if (!this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  this._request.src = this.url;
};
