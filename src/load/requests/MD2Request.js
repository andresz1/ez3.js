/**
 * @class MD2Request
 * @extends Request
 */

 EZ3.MD2Request = function(url, cached, crossOrigin) {
   EZ3.Request.call(this, url, new EZ3.Mesh(), cached, crossOrigin);
 };

 EZ3.MD2Request.prototype = Object.create(EZ3.Request.prototype);
 EZ3.MD2Request.prototype.constructor = EZ3.MD2Request;

 EZ3.MD2Request.prototype._parse = function(data, onLoad, onError) {
 };

 EZ3.MD2Request.prototype.send = function(onLoad, onError) {
   var that = this;
   var requests = new EZ3.RequestManager();

   requests.addFileRequest(this.url, this.cached, this.crossOrigin, 'arraybuffer');

   requests.onComplete.add(function(assets, failed) {
     if (failed)
       return onError(that.url);

     that._parse(assets.get(that.url).data, onLoad, onError);
   });

   requests.send();
 };
