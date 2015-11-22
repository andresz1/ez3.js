/**
 * @class MD2Request
 * @extends Request
 */

EZ3.MD2Request = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Entity(), crossOrigin);
};

EZ3.MD2Request.prototype = Object.create(EZ3.Request.prototype);
EZ3.MD2Request.prototype.constructor = EZ3.MD2Request;

EZ3.MD2Request.prototype._parse = function(data, onLoad) {
  var that = this;

  function init() {
    var header = {};
    var names = [
      'ident',
      'version',
      'skinwidth',
      'skinheight',
      'framesize',
      'num_skins',
      'num_vertices',
      'num_st',
      'num_tris',
      'num_glcmds',
      'num_frames',
      'offset_skins',
      'offset_st',
      'offset_tris',
      'offset_frames',
      'offset_glcmds',
      'offset_end'
    ];
    var i;
    var l;

    for (i = 0; i < names.length; i++) {
      header[names[i]] = data.getInt32(i * 4, true);
    }

    if (header.ident !== 844121161 || header.version !== 8) {
      console.error('Not a valid MD2 file');
      return;
    }

    if (header['offset_end'] !== data.byteLength) {
      console.error('Corrupted MD2 file');
      return;
    }

    var uvs = [];
    var offset = header['offset_st'];

    for (i = 0, l = header['num_st']; i < l; i++) {
      var u = data.getInt16(offset + 0, true);
      var v = data.getInt16(offset + 2, true);

      uvs.push(u / header.skinwidth, 1 - (v / header.skinheight));
      offset += 4;
    }

    offset = header['offset_tris'];

    var indices = [];
    var uvindices = [];

    for (i = 0, l = header['num_tris']; i < l; i++) {
      var a = data.getUint16(offset + 0, true);
      var b = data.getUint16(offset + 2, true);
      var c = data.getUint16(offset + 4, true);

      indices.faces.push(a, b, c);

      uvindices.faceVertexUvs[0].push([
        uvs[data.getUint16(offset + 6, true)],
        uvs[data.getUint16(offset + 8, true)],
        uvs[data.getUint16(offset + 10, true)]
      ]);

      offset += 12;
    }

    onLoad(that.url);
  }

  init();
};

EZ3.MD2Request.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.crossOrigin);

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url, true);

    that._parse(new DataView(assets.get(that.url).data), onLoad);
  });

  requests.send();
};
