/**
 * @class EZ3.RequestManager
 * @constructor
 */
EZ3.RequestManager = function() {
  /**
   * @property {Object} _requests
   * @private
   */
  this._requests = {};
  /**
   * @property {AssetManager} _assets
   * @private
   */
  this._assets = new EZ3.AssetManager();

  /**
   * @property {Boolean} started
   * @default false
   */
  this.started = false;
  /**
   * @property {Number} toSend
   * @default 0
   */
  this.toSend = 0;
  /**
   * @property {Number} loaded
   * @default 0
   */
  this.loaded = 0;
  /**
   * @property {Number} failed
   * @default 0
   */
  this.failed = 0;
  /**
   * @property {EZ3.Signal} onComplete
   */
  this.onComplete = new EZ3.Signal();
  /**
   * @property {EZ3.Signal} onProgress
   */
  this.onProgress = new EZ3.Signal();
};

/**
 * @method EZ3.RequestManager#_processLoad
 * @param {String} url
 * @param {EZ3.File|EZ3.Entity} asset
 * @param {Boolean} cached
 */
EZ3.RequestManager.prototype._processLoad = function(url, asset, cached) {
  var cache;

  if (asset instanceof EZ3.File && cached) {
    cache = EZ3.Cache;
    cache.add(url, asset);
  }

  this.loaded++;
  this._assets.add(url, asset);

  this._processProgress(url, asset);
};

/**
 * @method EZ3.RequestManager#_processError
 * @param {String} url
 */
EZ3.RequestManager.prototype._processError = function(url) {
  this.failed++;

  this._processProgress(url);
};

/**
 * @method EZ3.RequestManager#_processProgress
 * @param {String} url
 * @param {EZ3.File|EZ3.Entity} asset
 */
EZ3.RequestManager.prototype._processProgress = function(url, asset) {
  var loaded, failed, assets;

  this.onProgress.dispatch(url, asset, this.loaded, this.failed, this.toSend);

  if (this.toSend === this.loaded + this.failed) {
    assets = this._assets;
    loaded = this.loaded;
    failed = this.failed;

    this._requests = {};
    this._assets = new EZ3.AssetManager();
    this.toSend = 0;
    this.loaded = 0;
    this.failed = 0;
    this.started = false;

    this.onComplete.dispatch(assets, failed, loaded);
  }
};

/**
 * @method EZ3.RequestManager#addFileRequest
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 * @param {String} [responseType]
 * @return {EZ3.File}
 */
EZ3.RequestManager.prototype.addFileRequest = function(url, cached, crossOrigin, responseType) {
  var cache = EZ3.Cache;
  var file = cache.get(url);

  if (file) {
    this._assets.add(url, file);
    return file;
  }

  if (!this._requests[url]) {
    this._requests[url] = new EZ3.FileRequest(url, cached, crossOrigin, responseType);
    this.toSend++;
  }

  return this._requests[url].asset;
};

/**
 * @method EZ3.RequestManager#addImageRequest
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 * @return {EZ3.Image}
 */
EZ3.RequestManager.prototype.addImageRequest = function(url, cached, crossOrigin) {
  var cache = EZ3.Cache;
  var image = cache.get(url);

  if (image) {
    this._assets.add(url, image);
    return image;
  }

  if (!this._requests[url]) {
    var extension = EZ3.toFileExtension(url);

    if (extension === 'tga')
      this._requests[url] = new EZ3.TGARequest(url, cached, crossOrigin);
    else
      this._requests[url] = new EZ3.ImageRequest(url, cached, crossOrigin);

    this.toSend++;
  }

  return this._requests[url].asset;
};

/**
 * @method EZ3.RequestManager#addEntityRequest
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 * @return {EZ3.Entity}
 */
EZ3.RequestManager.prototype.addEntityRequest = function(url, cached, crossOrigin) {
  if (!this._requests[url]) {
    var extension = EZ3.toFileExtension(url);

    if (extension === 'obj')
      this._requests[url] = new EZ3.OBJRequest(url, cached, crossOrigin);
    else if (extension === 'off')
      this._requests[url] = new EZ3.OFFRequest(url, cached, crossOrigin);
    else if (extension === 'mdl')
      this._requests[url] = new EZ3.MDLRequest(url, cached, crossOrigin);
    else if (extension === 'md2')
      this._requests[url] = new EZ3.MD2Request(url, cached, crossOrigin);
    else
      return;

    this.toSend++;
  }

  return this._requests[url].asset;
};

/**
 * @method EZ3.RequestManager#send
 */
EZ3.RequestManager.prototype.send = function() {
  var assets;
  var url;

  if (!this.toSend) {
    assets = this._assets;
    this._assets = new EZ3.AssetManager();
    this.onComplete.dispatch(assets, 0, 0);
  }

  this.started = true;

  for (url in this._requests)
    this._requests[url].send(this._processLoad.bind(this), this._processError.bind(this));
};

EZ3.RequestManager.prototype.file = EZ3.RequestManager.prototype.addFileRequest;
EZ3.RequestManager.prototype.image = EZ3.RequestManager.prototype.addImageRequest;
EZ3.RequestManager.prototype.entity = EZ3.RequestManager.prototype.addEntityRequest;
EZ3.RequestManager.prototype.start = EZ3.RequestManager.prototype.send;
