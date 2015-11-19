/**
 * @class RequestManager
 */

EZ3.RequestManager = function() {
  this._requests = {};
  this._assets = new EZ3.AssetManager();

  this.started = false;
  this.toSend = 0;
  this.loaded = 0;
  this.failed = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.RequestManager.prototype._processLoad = function(url, asset) {
  var cache;

  if (asset instanceof EZ3.File) {
    cache = EZ3.Cache;
    cache.add(url, asset);
  }

  this.loaded++;
  this._assets.add(url, asset);

  this._processProgress(url, asset);
};

EZ3.RequestManager.prototype._processError = function(url) {
  this.failed++;

  this._processProgress(url);
};

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

EZ3.RequestManager.prototype.addFileRequest = function(url, crossOrigin) {
  var cache = EZ3.Cache;
  var file = cache.get(url);

  if (file) {
    this._assets.add(url, file);
    return file;
  }

  if(!this._requests[url]) {
    this._requests[url] = new EZ3.FileRequest(url, crossOrigin);
    this.toSend++;
  }

  return this._requests[url].asset;
};

EZ3.RequestManager.prototype.addImageRequest = function(url, crossOrigin) {
  var cache = EZ3.Cache;
  var image = cache.get(url);

  if (image) {
    this._assets.add(url, image);
    return image;
  }

  if(!this._requests[url]) {
    this._requests[url] = new EZ3.ImageRequest(url, crossOrigin);
    this.toSend++;
  }

  return this._requests[url].asset;
};

EZ3.RequestManager.prototype.addEntityRequest = function(url, crossOrigin) {
  if(!this._requests[url]) {
    this._requests[url] = new EZ3.OBJRequest(url, crossOrigin);
    this.toSend++;
  }

  return this._requests[url].asset;
};

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
