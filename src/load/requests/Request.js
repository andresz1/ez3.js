/**
 * @class Request
 */

EZ3.Request = function(url, asset, crossOrigin) {
  this.url = url;
  this.asset = asset;
  this.crossOrigin = crossOrigin || false;
  this.cached = true;
};

EZ3.Request.prototype.constructor = EZ3.Request;
