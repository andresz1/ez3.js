/**
 * @class EZ3.FileRequest
 * @extends EZ3.Request
 * @constructor
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 * @param {String} [responseType]
 */
EZ3.FileRequest = function(url, cached, crossOrigin, responseType) {
  EZ3.Request.call(this, url, new EZ3.File(), cached, crossOrigin);

  /**
   * @property {XMLHttpRequest} _request
   * @private
   */
  this._request = new XMLHttpRequest();

  /**
   * @property {String} responseType
   */
  this.responseType = responseType;
};

EZ3.FileRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.FileRequest.prototype.constructor = EZ3.FileRequest;

/**
 * @method EZ3.FileRequest#_processLoad
 * @param {XMLHttpRequest} data
 * @param {Function} onLoad
 */
EZ3.FileRequest.prototype._processLoad = function(data, onLoad) {
  this._removeEventListeners();

  this.asset.data = data.response;

  onLoad(this.url, this.asset, this.cached);
};

/**
 * @method EZ3.FileRequest#_processError
 * @param {Function} onError
 */
EZ3.FileRequest.prototype._processError = function(onError) {
  this._removeEventListeners();
  onError(this.url);
};

/**
 * @method EZ3.FileRequest#_addEventListeners
 * @param {Function} onLoad
 * @param {Function} onError
 */
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

/**
 * @method EZ3.FileRequest#_removeEventListeners
 */
EZ3.FileRequest.prototype._removeEventListeners = function() {
  this._request.removeEventListener('load', this._onLoad, false);
  this._request.removeEventListener('error', this._onError, false);

  delete this._onLoad;
  delete this._onError;
};

/**
 * @method EZ3.FileRequest#send
 * @param {Function} onLoad
 * @param {Function} onError
 */
EZ3.FileRequest.prototype.send = function(onLoad, onError) {
  this._request.open('GET', this.url, true);

  this._addEventListeners(onLoad, onError);

  if (this.crossOrigin)
    this._request.crossOrigin = this.crossOrigin;

  if (this.responseType)
    this._request.responseType = this.responseType;

  this._request.send(null);
};
