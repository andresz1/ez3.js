EZ3.ImageLoader = function(manager, crossOrigin) {
  this._manager = manager;

  this.crossOrigin = crossOrigin;
};

EZ3.ImageLoader.prototype._processLoad = function(url, image, onLoad) {
  if (onLoad)
    onLoad(request);

  this._manager.processLoad(url, image);
};

EZ3.ImageLoader.prototype._processError = function(url, event, onError) {
  if (onError)
    onError(event);

  this._manager.processError(url, event);
};

EZ3.ImageLoader.prototype.start = function(url, onLoad, onError) {
  var that, image, cached;

  cached = this._manager.add(url);

  if(cached){
    if(onLoad)
      onLoad(cached);

    return cached;
  }

  that = this;
  image = new Image();

  image.addEventListener('load', function() {
    that._processLoad(url, this, onLoad);
  }, false);


  image.addEventListener('error', function(event) {
    that._processLoad(url, event, onError);
  }, false);


  if (!this.crossOrigin)
    image.crossOrigin = this.crossOrigin;

  image.src = url;

  return image;
};
