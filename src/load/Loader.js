/**
 * @class Loader
 */

EZ3.Loader = function(cache) {
  this._cache = cache;
  this._files = {};
  this._numOfFilesLoaded = 0;
  this._numOfFilesErrors = 0;

  this.started = false;
  this.onProgress = new EZ3.Signal();
  this.onComplete = new EZ3.Signal();
};

EZ3.Loader.prototype._processFileLoad = function(file) {
  this._numOfFilesLoaded++;
  this._cache.set(file.id, file.content);

  this._processProgress(file, EZ3.Loader.FILE.LOADED);
};

EZ3.Loader.prototype._processFileError = function(file) {
  this._numOfFilesErrors++;

  this._processProgress(file, EZ3.Loader.FILE.ERROR);
};

EZ3.Loader.prototype._processProgress = function(file, status) {
  var numOfFiles, numOfFilesLoaded, numOfFilesErrors;

  numOfFiles = Object.keys(this._files).length;

  this.onProgress.dispatch(file, status, this._numOfFilesLoaded, this._numOfFilesErrors, numOfFiles);

  if (numOfFiles === this._numOfFilesLoaded + this._numOfFilesErrors) {
    numOfFilesLoaded = this._numOfFilesLoaded;
    numOfFilesErrors = this._numOfFilesErrors;

    this.started = false;
    this._files = {};
    this._numOfFilesLoaded = 0;
    this._numOfFilesErrors = 0;

    this.onComplete.dispatch(numOfFilesLoaded, numOfFilesErrors);
  }
};

EZ3.Loader.prototype.start = function() {
  this.started = true;

  for (var url in this._files)
    this._files[url].load(this._processFileLoad.bind(this), this._processFileError.bind(this));
};

EZ3.Loader.prototype.add = function(id, file) {
  var type;

  if (file instanceof EZ3.Image)
    type = EZ3.Cache.IMAGE;
  else if (file instanceof EZ3.Data)
    type = EZ3.Cache.DATA;
  else
    return;

  if (!this.started && !this._cache.get(type, id) && !this._files[file.url]) {
    file.id = id;
    this._files[file.url] = file;
  }
};

EZ3.Loader.FILE = {};
EZ3.Loader.FILE.ERROR = 0;
EZ3.Loader.FILE.LOADED = 1;
