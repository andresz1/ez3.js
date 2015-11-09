/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._files = [];
};

EZ3.Cache = new EZ3.Cache();

EZ3.Cache.add = function(url, file) {
  if (file instanceof EZ3.File) {
    this._files[url] = file;
    return this._files[url];
  }
};

EZ3.Cache.get = function(url) {
  return this._files[url];
};
