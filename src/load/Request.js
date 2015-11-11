/**
 * @class Request
 */

EZ3.Request = function(url, response, crossOrigin) {
  this.url = url;
  this.response = response;
  this.crossOrigin = crossOrigin || false;
};

EZ3.Request.prototype.constructor = EZ3.Request;