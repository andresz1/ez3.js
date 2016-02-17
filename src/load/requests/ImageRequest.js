/**
 * @class EZ3.ImageRequest
 * @extends EZ3.Request
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 */
EZ3.ImageRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), cached, crossOrigin);

  /**
   * @property {Image} _request
   * @private
   */
  this._request = new Image();
};

EZ3.ImageRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.ImageRequest.prototype.constructor = EZ3.ImageRequest;

/**
 * @method EZ3.ImageRequest#_processLoad
 * @param {Image} image
 * @param {Function} onLoad
 */
EZ3.ImageRequest.prototype._processLoad = function(image, onLoad) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  this.asset.size.x = image.width;
  this.asset.size.y = image.height;
  this.asset.data = new Uint8Array(context.getImageData(0, 0, image.width, image.height).data);

  this._removeEventListeners();

  onLoad(this.url, this.asset, this.cached);
};

/**
 * @method EZ3.ImageRequest#_processError
 * @param {Function} onError
 */
EZ3.ImageRequest.prototype._processError = function(onError) {
  this._removeEventListeners();
  onError(this.url);
};

/**
 * @method EZ3.ImageRequest#_addEventListeners
 * @param {Function} onLoad
 * @param {Function} onError
 */
EZ3.ImageRequest.prototype._addEventListeners = function(onLoad, onError) {
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

/**
 * @method EZ3.ImageRequest#_removeEventListeners
 */
EZ3.ImageRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

/**
 * @method EZ3.ImageRequest#send
 * @param {Function} onLoad
 * @param {Function} onError
 */
EZ3.ImageRequest.prototype.send = function(onLoad, onError) {
  this._addEventListeners(onLoad, onError);

  if (!this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  this._request.src = this.url;
};
