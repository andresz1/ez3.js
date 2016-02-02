/**
 * @class EZ3.Cache
 * @static
 */
EZ3.Cache = function() {
  /**
   * @property {Object} _files
   * @private
   */
  this._files = {};
};

EZ3.Cache = new EZ3.Cache();

/**
 * @method EZ3.Cache#add
 * @param {String} url
 * @param {EZ3.File} file
 * @return {EZ3.File}
 */
EZ3.Cache.add = function(url, file) {
  this._files[url] = file;

  return this._files[url];
};

/**
 * @method EZ3.Cache#get
 * @param {String} url
 * @return {EZ3.File}
 */
EZ3.Cache.get = function(url) {
  return this._files[url];
};
