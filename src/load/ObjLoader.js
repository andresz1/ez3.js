EZ3.ObjLoader = function(manager, crossOrigin) {
  this._manager = manager;

  this.crossOrigin = crossOrigin;
};

EZ3.ObjLoader.prototype._parse = function(manager, text, container) {
  var patterns, lines, line, result;
  var geometry, normals, uvs, indicesCount;

  function triangulate(face) {
    var data, i;

    data = [];
    face = face.split(' ');

    for (i = 1; i < face.length - 1; i++)
      data.push(face[0], face[i], face[i + 1]);

    return data;
  }

  function processVertex(vertex) {
    var i;

    for (i = 1; i < 4; i++) {
      geometry.vertices.push(parseFloat(vertex[i]));
      geometry.normals.push(0);
    }

    indicesCount.push(0);
  }

  function processNormal(normal) {
    var i;

    for (i = 1; i < 4; i++)
      normals.push(parseFloat(normal[i]));
  }

  function processUv(uv) {
    var i;

    for (i = 1; i < 3; i++)
      uvs.push(parseFloat(uv[i]));
  }

  function processNormalIndex(vertexIndex, normalIndex) {
    var i;

    indicesCount[vertexIndex]++;

    vertexIndex *= 3;
    normalIndex *= 3;

    for (i = 0; i < 3; i++)
      geometry.normals[vertexIndex + i] += normals[normalIndex + i];
  }

  function processUvIndex(vertexIndex, uvIndex) {
    var i;

    vertexIndex *= 2;
    uvIndex *= 2;

    for(i = 0; i < 2; i++)
      geometry.uvs[vertexIndex + i] = uvs[uvIndex + i];
  }

  function processFace1(face) {
    var i;

    for (i = 0; i < face.length; i++)
      indices.vertices.push(parseInt(face[i]) - 1);
  }

  function processFace2(face) {
    var point, vertexIndex, uvIndex, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');
      vertexIndex = parseInt(point[0]) - 1;
      uvIndex = parseInt(point[1]) - 1;

      geometry.indices.push(vertexIndex);
      processUvIndex(vertexIndex, uvIndex);
    }
  }

  function processFace3(face) {
    var point, vertexIndex, normalIndex, uvIndex, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');
      vertexIndex = parseInt(point[0]) - 1;
      uvIndex = parseInt(point[1]) - 1;
      normalIndex = parseInt(point[2]) - 1;

      geometry.indices.push(vertexIndex);
      processUvIndex(vertexIndex, uvIndex);
      processNormalIndex(vertexIndex, normalIndex);
    }
  }

  function processFace4(face) {
    var point, vertexIndex, normalIndex, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('//');
      vertexIndex = parseInt(point[0]) - 1;
      normalIndex = parseInt(point[1]) - 1;

      geometry.indices.push(vertexIndex);
      processNormalIndex(vertexIndex, normalIndex);
    }
  }

  function avarageNormals() {
    var i, j, k;

    for (i = 0, j = 0; i < geometry.normals.length; i += 3, j++)
      for (k = 0; k < 3; k++)
        geometry.normals[i + k] /= indicesCount[j];
  }

  patterns = {
    obj: /^o/,
    group: /^g/,
    mtllib: /^mtllib/,
    usemtl: /^usemtl/,
    smooth: /^s/,
    vertex: /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    normal: /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    uv: /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    face1: /f\s(([\d]{1,}[\s]?){3,})+/,
    face2: /f\s((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face3: /f\s((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face4: /f\s((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/
  };
  lines = text.split('\n');

  if (!/^o /gm.test(text)) {
    geometry = new EZ3.Geometry();
    normals = [];
    uvs = [];
    indicesCount = [];

    container.add(new EZ3.Mesh(geometry, new EZ3.Material({})));
  }

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    } else if ((result = patterns.vertex.exec(line))) {
      processVertex(result);
    } else if ((result = patterns.normal.exec(line))) {
      processNormal(result);
    } else if ((result = patterns.uv.exec(line))) {
      processUv(result);
    } else if ((result = patterns.face1.exec(line))) {
      processFace1(triangulate(result[1]));
    } else if ((result = patterns.face2.exec(line))) {
      processFace2(triangulate(result[1]));
    } else if ((result = patterns.face3.exec(line))) {
      processFace3(triangulate(result[1]));
    } else if ((result = patterns.face4.exec(line))) {
      processFace4(triangulate(result[1]));
    } else if (patterns.obj.test(line)) {
      geometry = new EZ3.Geometry();
      normals = [];
      uvs = [];
      indicesCount = [];

      container.add(new EZ3.Mesh(geometry, new EZ3.Material({})));
    } else if (patterns.group.test(line)) {

    } else if (patterns.mtllib.test(line)) {

    } else if (patterns.usemtl.test(line)) {

    } else if (patterns.smooth.test(line)) {

    }
  }

  console.log(geometry.uvs);

  if (normals.length)
    avarageNormals();
  else
    geometry.normals = [];
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
