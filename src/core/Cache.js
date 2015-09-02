/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._files = {};
};

EZ3.Cache.prototype.add = function(url, file) {
  this._files[url] = file;
};

EZ3.Cache.prototype.get = function(url) {
  return this._files[url];
};
