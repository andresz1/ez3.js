/**
 * @class LoadManager
 */

EZ3.LoadManager = function() {
  this._cache = EZ3.Cache;
  this._files = {};

  this.started = false;
  this.filesToLoad = 0;
  this.loadedFiles = 0;
  this.failedFiles = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.LoadManager.prototype._processLoad = function(url, data) {
  this.loadedFiles++;

  this._cache.add(url, data);
  this._processProgress(url);
};

EZ3.LoadManager.prototype._processError = function(url, data) {
  this.failedFiles++;

  this._processProgress(url, data);
};

EZ3.LoadManager.prototype._processProgress = function(url, error) {
  var loadedFiles, failedFiles;

  this.onProgress.dispatch(url, error, this.loadedFiles, this.failedFiles, this.filesToLoad);

  if(this.filesToLoad === this.loadedFiles + this.failedFiles) {
    loadedFiles = this.loadedFiles;
    failedFiles = this.failedFiles;

    this._files = {};
    this.filesToLoad = 0;
    this.loadedFiles = 0;
    this.failedFiles = 0;
    this.started = false;

    this.onComplete.dispatch(failedFiles, loadedFiles);
  }
};

EZ3.LoadManager.prototype.data = function(url, crossOrigin, responseType) {
  var cached;

  cached = this._cache.data(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Data(url, crossOrigin, responseType);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.image = function(url, crossOrigin) {
  var cached;

  cached = this._cache.image(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Image(url, crossOrigin);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.obj = function(url, crossOrigin) {
  var cached;

  cached = this._cache.entity(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Obj(url, crossOrigin);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.LoadManager.prototype.start = function() {
  var i;

  if (!this.filesToLoad)
    this.onComplete.dispatch(0, 0);

  this.started = true;

  for (i in this._files)
    this._files[i].load(this._processLoad.bind(this), this._processError.bind(this));
};
