/**
 * @class EZ3.AssetsManager
 * @constructor
 */
EZ3.AssetManager = function() {
  /**
   * @property {Object} _assets
   * @private
   */
  this._assets = {};
};

/**
 * @method EZ3.AssetManager#add
 * @param {String} url
 * @param {EZ3.File|EZ3.Entity} asset
 * @return {EZ3.File|EZ3.Entity}
 */
EZ3.AssetManager.prototype.add = function(url, asset) {
  this._assets[url] = asset;

  return this._assets[url];
};

/**
 * @method EZ3.AssetManager#get
 * @param {String} id
 * @return {EZ3.File|EZ3.Entity}
 */
EZ3.AssetManager.prototype.get = function(id) {
  var asset = this._assets[id];
  var url;

  if (asset)
    return asset;

  for (url in this._assets)
    if (EZ3.toFileName(url) === id)
      return this._assets[url];
};
