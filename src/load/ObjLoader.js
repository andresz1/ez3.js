EZ3.ObjLoader = function(manager, crossOrigin) {
  this._manager = manager;

  this.crossOrigin = crossOrigin;
};

EZ3.ObjLoader.prototype._parse = function(manager, text, container) {
  var vertexPattern, normalPattern, uvPattern, facePattern1, facePattern2, facePattern3, facePattern4;
  var lines, line, result, face, i, j;

  function triangulate(face) {
    var data, i;

    data = [];
    face = face.split(" ");

    for (i = 1; i < face.length - 1; i++)
      data.push(face[0], face[i], face[i + 1]);

    return data;
  }

  vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
  normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
  uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
  facePattern1 = /f\s(([\d]{1,}[\s]?){3,})+/;
  facePattern2 = /f\s((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
  facePattern3 = /f\s((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
  facePattern4 = /f\s((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/;

  lines = text.split('\n');

  if (!/^o /gm.test(text)) {}

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    } else if ((result = vertexPattern.exec(line))) {

    } else if ((result = normalPattern.exec(line))) {

    } else if ((result = uvPattern.exec(line))) {

    } else if ((result = facePattern1.exec(line))) {

    } else if ((result = facePattern2.exec(line))) {

    } else if ((result = facePattern3.exec(line))) {

    } else if ((result = facePattern4.exec(line))) {

      face = triangulate(result[1]);

      for (j = 0; j < face.length; j++) {
        var point = face[j].split("//");
        var indicePositionFromObj = parseInt(point[0]) - 1;
        var indiceNormalFromObj = parseInt(point[1]) - 1;
      }

    } else if (/^o /.test(line)) {

    } else if (/^g /.test(line)) {

    } else if (/^usemtl /.test(line)) {

    } else if (/^mtllib /.test(line)) {

    } else if (/^s /.test(line)) {

    }
  }
};

EZ3.ObjLoader.prototype.start = function(url, onLoad, onError) {
  var that, manager, dataLoader, file, container, cached;

  cached = this._manager.add(url);

  if (cached) {
    if (onLoad)
      onLoad(cached);

    return cached;
  }

  that = this;
  manager = new EZ3.LoadManager(this._manager.cache);
  dataLoader = new EZ3.DataLoader(manager);
  container = new EZ3.Entity();

  file = dataLoader.start(url);

  manager.onComplete.add(function() {
    that._parse(manager, file.response, container);
    that._manager.processLoad(url, container);
  });

  return container;
};
