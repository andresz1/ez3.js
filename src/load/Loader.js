/**
 * @class Loader
 */

EZ3.Loader = function() {
  this._requests = {};

  this.started = false;
  this.toSend = 0;
  this.loaded = 0;
  this.failed = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.Loader.prototype._processLoad = function(url, data) {
  var cache = EZ3.Cache;

  this.loaded++;

  cache.add(url, data);
  this._processProgress(url);
};

EZ3.Loader.prototype._processError = function(url, data) {
  this.failed++;

  this._processProgress(url, data);
};

EZ3.Loader.prototype._processProgress = function(url, error) {
  var loaded, failed;

  this.onProgress.dispatch(url, error, this.loaded, this.failed, this.toSend);

  if (this.toSend === this.loaded + this.failed) {
    loaded = this.loaded;
    failed = this.failed;

    this._requests = {};
    this.toSend = 0;
    this.loaded = 0;
    this.failed = 0;
    this.started = false;

    this.onComplete.dispatch(failed, loaded);
  }
};

EZ3.Loader.prototype.add = function(request) {
  var cache;
  var file;

  if (request instanceof EZ3.Request) {
    cache = EZ3.Cache;

    if ((request instanceof EZ3.ImageRequest || request instanceof EZ3.DataRequest)) {
      file = cache.get(request.url);

      if (file)
        return file;
    }

    if (!this._requests[request.url]) {
      this._requests[request.url] = request;
      this.toSend++;
    }

    return this._requests[request.url].response;
  }
};

EZ3.Loader.prototype.start = function() {
  var i;

  if (!this.toSend)
    this.onComplete.dispatch(0, 0);

  this.started = true;

  for (i in this._requests)
    this._requests[i].send(this._processLoad.bind(this), this._processError.bind(this));
};
