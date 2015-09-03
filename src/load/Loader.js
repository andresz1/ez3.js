EZ3.Loader = function(cache) {
  this._cache = cache;
  this._files = {};

  this.filesToLoad = 0;
  this.loadedFiles = 0;
  this.failedFiles = 0;
  this.onComplete = new EZ3.Signal();
  this.onProgress = new EZ3.Signal();
};

EZ3.Loader.prototype._processLoad = function(url, data) {
  this.loadedFiles++;

  this._cache.add(url, data);
  this._processProgress(url);
};

EZ3.Loader.prototype._processError = function(url, data) {
  this.failedFiles++;

  this._processProgress(url, data);
};

EZ3.Loader.prototype._processProgress = function(url, error) {
  var loadedFiles, failedFiles;

  this.onProgress.dispatch(url, error, this.loadedFiles, this.failedFiles, this.filesToLoad);

  if(this.filesToLoad === this.loadedFiles + this.failedFiles) {
    loadedFiles = this.loadedFiles;
    failedFiles = this.failedFiles;

    this.filesToLoad = 0;
    this.loadedFiles = 0;
    this.failedFiles = 0;

    this.onComplete.dispatch(loadedFiles, failedFiles);
  }
};

EZ3.Loader.prototype.data = function(url, crossOrigin, responseType) {
  var cached;

  cached = this._cache.get(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Data(url, crossOrigin, responseType);
  this.filesToLoad++;

  return this._files[url].content;
};

EZ3.Loader.prototype.image = function(url, crossOrigin) {
  var cached;

  cached = this._cache.get(url);

  if(cached)
    return cached;

  this._files[url] = new EZ3.Image(url, crossOrigin);
  this.filesToLoad++;

  return this._files[url].content;
};

/*
EZ3.Loader.prototype.add = function(file) {
  var cached;

  cached = this._cache.get(file.url);

  if(cached)
    return cached;

  this._files[file.url] = file;
  this.filesToLoad++;

  return file.content;
};*/

EZ3.Loader.prototype.start = function() {
  var i;

  for (i in this._files)
    this._files[i].load(this._processLoad.bind(this), this._processError.bind(this));
};
