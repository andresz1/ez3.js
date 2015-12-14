/**
 * @class OFFRequest
 * @extends Request
 */

EZ3.OFFRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Mesh(), cached, crossOrigin);
};

EZ3.OFFRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.OFFRequest.prototype.constructor = EZ3.OFFRequest;

EZ3.OFFRequest.prototype._parse = function(data, onLoad, onError) {
  var that = this;
  var indices = [];
  var vertices = [];

  function triangulate(face) {
    var data = [];
    var length;
    var i;

    face = face.split(' ');
    length = parseInt(face[0]);

    for (i = 2; i < length; i++)
      data.push(face[1], face[i], face[i + 1]);

    return data;
  }

  function processVertex(vertex) {
    var i;

    for (i = 0; i < 3; i++)
      vertices.push(parseFloat(vertex[i]));
  }

  function processFace(face) {
    var i;

    for (i = 0; i < face.length; i++)
      indices.push(parseInt(face[i]));
  }

  function init() {
    var lines = data.split('\n');
    var i = 0;
    var j = 0;
    var numVertices;
    var numFaces;
    var line;

    line = lines[j++];

    if (!/OFF/g.exec(line))
      onError(that.url);

    line = lines[j++].trim().replace(/ +(?= )/g, '').split(' ');

    numVertices = parseInt(line[0]);
    numFaces = parseInt(line[1]);

    while (i < numVertices) {
      line = lines[j++].trim().replace(/ +(?= )/g, '');

      if (line.length === 0 || line.charAt(0) === '#')
        continue;

      processVertex(line.split(' '));

      i++;
    }

    i = 0;

    while (i < numFaces) {
      line = lines[j++].trim().replace(/ +(?= )/g, '');

      if (line.length === 0 || line.charAt(0) === '#')
        continue;

      processFace(triangulate(line));

      i++;
    }

    that.asset.geometry.buffers.addTriangularBuffer(indices, (vertices.length / 3) > EZ3.Math.MAX_USHORT);
    that.asset.geometry.buffers.addPositionBuffer(vertices);

    onLoad(that.url, that.asset);
  }

  init();
};

EZ3.OFFRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.cached, this.crossOrigin);

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad, onError);
  });

  requests.send();
};
