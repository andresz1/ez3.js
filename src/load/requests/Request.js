/**
 * @class Request
 */

EZ3.Request = function(url, asset, cached, crossOrigin) {
  this.url = url;
  this.asset = asset;
  this.cached = (cached !== undefined) ? cached : true;
  this.crossOrigin = (crossOrigin !== undefined) ? crossOrigin : false;
};

EZ3.Request.prototype.constructor = EZ3.Request;
