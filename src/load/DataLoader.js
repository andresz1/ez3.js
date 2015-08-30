EZ3.DataLoader = function(manager, crossOrigin, responseType) {
  this._manager = manager;

  this.crossOrigin = crossOrigin;
  this.responseType = responseType;
};

EZ3.DataLoader.prototype._processLoad = function(url, request, onLoad) {
  if(onLoad)
    onLoad(request);

  this._manager.processLoad(url, request);
};

EZ3.DataLoader.prototype._processError = function(url, event, onError) {
  if (onError)
    onError(event);

  this._manager.processError(url, event);
};

EZ3.DataLoader.prototype.start = function(url, onLoad, onError) {
  var that, request, cached;

  cached = this._manager.add(url);

  if(cached){
    if(onLoad)
      onLoad(cached);

    return cached;
  }

  that = this;
  request = new XMLHttpRequest();

  request.open('GET', url, true);

  request.addEventListener('load', function() {
    that._processLoad(url, this, onLoad);
  }, false);

  request.addEventListener('error', function(event) {
    that._processError(url, event, onError);
  }, false);

  if (this.crossOrigin)
    request.crossOrigin = this.crossOrigin;

  if (this.responseType)
    request.responseType = this.responseType;

  request.send(null);

  return request;
};
