/**
 * @class Cache
 */

EZ3.Cache = function() {
  this.ASSET = {};
  this.ASSET.IMAGE = 0;
  this.ASSET.DATA = 1;
  this.ASSET.ENTITY = 2;

  this._assets = [];
  this._assets[this.ASSET.IMAGE] = {};
  this._assets[this.ASSET.DATA] = {};
  this._assets[this.ASSET.ENTITY] = {};
};

EZ3.Cache = new EZ3.Cache();

EZ3.Cache.add = function(url, asset) {
  if (asset instanceof Image)
    this._assets[this.ASSET.IMAGE][url] = asset;
  else if (asset instanceof XMLHttpRequest)
    this._assets[this.ASSET.DATA][url] = asset;
  else if (asset instanceof EZ3.Entity)
    this._assets[this.ASSET.ENTITY][url] = asset;
};

EZ3.Cache.image = function(url) {
  return this._assets[this.ASSET.IMAGE][url];
};

EZ3.Cache.data = function(url) {
  return this._assets[this.ASSET.DATA][url];
};

EZ3.Cache.entity = function(url) {
  return this._assets[this.ASSET.ENTITY][url];
};
