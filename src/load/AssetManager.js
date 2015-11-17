/**
 * @class AssetsManager
 */

EZ3.AssetManager = function() {
  this._assets = {};
};

EZ3.AssetManager.prototype.add = function(url, asset) {
  this._assets[url] = asset;

  return this._assets[url];
};

EZ3.AssetManager.prototype.get = function(id) {
  var asset = this._assets[id];
  var url;

  if (asset)
    return asset;

  for (url in this._assets)
    if (EZ3.toFileName(url) === id)
      return this._assets[url];
};
