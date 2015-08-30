EZ3.LoadManager = function(cache) {
  this.cache = cache;

  this.toLoad = 0;
  this.loaded = 0;
  this.errors = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.LoadManager.prototype._processProgress = function(url, error) {
  var loaded, errors;

  this.onProgress.dispatch(url, error, this.loaded, this.errors, this.toLoad);

  if(this.toLoad == this.loaded + this.errors) {
    loaded = this.loaded;
    errors = this.errors;

    this.toLoad = 0;
    this.loaded = 0;
    this.errors = 0;

    this.onComplete.dispatch(loaded, errors);
  }
};

EZ3.LoadManager.prototype.add = function(url) {
  var cached;

  cached = this.cache.get(url);

  if(cached)
    return cached;

  this.toLoad++;
};

EZ3.LoadManager.prototype.processLoad = function(url, data) {
  this.loaded++;
  this.cache.add(url, data);
  this._processProgress(url);
};

EZ3.LoadManager.prototype.processError = function(url, data) {
  this.errors++;
  this._processProgress(url, data);
};
