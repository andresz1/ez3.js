/**
 * @class Loader
 */

EZ3.Loader = function(cache) {
  this._cache = cache;
  this._resources = {};
  this._numOfResourcesLoaded = 0;
  this._numOfResourcesErrors = 0;

  this.started = false;
  this.onProgress = new EZ3.Signal();
  this.onLoad = new EZ3.Signal();
};

EZ3.Loader.prototype._processResourceLoad = function(resource) {
  this._numOfResourcesLoaded++;
  this._cache.set((resource instanceof EZ3.Image)? EZ3.Cache.IMAGE: EZ3.Cache.DATA, resource.id, resource.content);
  this._processProgress(resource, EZ3.Loader.RESOURCE.ERROR);
};

EZ3.Loader.prototype._processResourceError = function(resource) {
  this._numOfResourcesErrors++;

  this._processProgress(resource, EZ3.Loader.RESOURCE.LOADED);
};

EZ3.Loader.prototype._processProgress = function(resource, status) {
  var numOfResources, numOfResourcesLoaded, numOfResourcesErrors;

  numOfResources = Object.keys(this._resources).length;

  console.log(numOfResources);

  this.onProgress.dispatch(resource, status, numOfResourcesLoaded, numOfResourcesErrors, numOfResources);

  console.log(resource);

  if (numOfResources === this._numOfResourcesLoaded + this._numOfResourcesErrors) {
    numOfResourcesLoaded = this._numOfResourcesLoaded;
    numOfResourcesErrors = this._numOfResourcesErrors;

    this.started = false;
    this._resources = {};
    this._numOfResourcesLoaded = 0;
    this._numOfResourcesErrors = 0;

    this.onLoad.dispatch(numOfResourcesLoaded, numOfResourcesErrors);
  }
};

EZ3.Loader.prototype.start = function() {
  this.started = true;

  for (var id in this._resources)
    this._resources[id].load(this._processResourceLoad.bind(this), this._processResourceError.bind(this));
};

EZ3.Loader.prototype.add = function(id, resource) {
  if (resource instanceof EZ3.Image) {
    if (this._cache.get(EZ3.Cache.IMAGE, id))
      return;
  } else if (resource instanceof EZ3.Data) {
    if (this._cache.get(EZ3.Cache.DATA, id))
      return;
  } else
    return;

  if (!this.started && !this._resources[resource.url]) {
    resource.id = id;
    this._resources[resource.url] = resource;
  }
};

EZ3.Loader.RESOURCE = {};
EZ3.Loader.RESOURCE.ERROR = 0;
EZ3.Loader.RESOURCE.LOADED = 1;
