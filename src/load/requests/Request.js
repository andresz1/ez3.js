/**
 * @class EZ3.Request
 * @constructor
 * @param {String} url
 * @param {EZ3.File|EZ3.Entity} asset
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 */
EZ3.Request = function(url, asset, cached, crossOrigin) {
  /**
   * @property {String} url
   */
  this.url = url;
  /**
   * @property {EZ3.File|EZ3.Entity} asset
   */
  this.asset = asset;
  /**
   * @property {Boolean} cached
   * @default true
   */
  this.cached = (cached !== undefined) ? cached : true;
  /**
   * @property {Boolean} crossOrigin
   * @default false
   */
  this.crossOrigin = (crossOrigin !== undefined) ? crossOrigin : false;
};

EZ3.Request.prototype.constructor = EZ3.Request;
