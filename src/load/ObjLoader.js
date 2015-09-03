EZ3.ObjLoader = function(manager, crossOrigin) {
  this._manager = manager;

  this.crossOrigin = crossOrigin;
};


EZ3.ObjLoader.prototype._parse = function(text, container, loader, manager, onLoad, onError) {
  var patterns, lines, line, result;
  var mtllibs, materials, material, geometry, mesh, indices, normals, uvs;

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

    for (i = 1; i < 4; i++)
      vertices.push(parseFloat(vertex[i]));
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

  function processFace1(face) {
    var i;

    for (i = 0; i < face.length; i++)
      indices.vertex.push(parseInt(face[i]) - 1);
  }

  function processFace2(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.uv.push(parseInt(point[1]) - 1);
    }
  }

  function processFace3(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.uv.push(parseInt(point[1]) - 1);
      indices.normal.push(parseInt(point[2]) - 1);
    }
  }

  function processFace4(face) {
    var point, i;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('//');

      indices.vertex.push(parseInt(point[0]) - 1);
      indices.normal.push(parseInt(point[1]) - 1);
    }
  }

  function computeNormals() {
    var indicesCount, i, j, k;

    indicesCount = [];

    for (i = 0; i < vertices.length / 3; i++) {
      indicesCount.push(0);

      for (j = 0; j < 3; j++)
        geometry.normals.push(0);
    }

    for (i = 0; i < indices.vertex.length; i++) {
      indicesCount[indices.vertex[i]]++;

      for (j = 0; j < 3; j++)
        geometry.normals[3 * indices.vertex[i] + j] += normals[3 * indices.normal[i] + j];
    }

    for (i = 0, j = 0; i < vertices.length; i += 3, j++)
      for (k = 0; k < 3; k++)
        geometry.normals[i + k] /= indicesCount[j];
  }

  function computeUvs() {
    for (i = 0; i < indices.vertex.length; i++)
      for (j = 0; j < 2; j++)
        geometry.uvs[2 * indices.vertex[i] + j] = uvs[2 * indices.uv[i] + j];
  }

  function processMesh() {
    if (indices.vertex.length && vertices.length) {
      geometry.indices = indices.vertex;
      geometry.vertices = vertices;

      if (indices.normal.length && normals.length)
        computeNormals();

      if (indices.uv.length && uvs.length)
        computeUvs();

      container.add(mesh);

      material = new EZ3.Material({});
      geometry = new EZ3.Geometry();
      mesh = new EZ3.Mesh(geometry, material);

      indices.vertex = [];
      indices.normal = [];
      indices.uv = [];
    }
  }

  function processMtls() {
    var i;

    for (i = 0; i < mtllibs.length; i++)
      loader.start('assets/' + mtllibs[i]);
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

  mtllibs = [];
  materials = {};
  material = new EZ3.Material({});
  geometry = new EZ3.Geometry();
  mesh = new EZ3.Mesh(geometry, material);

  indices = {
    vertex: [],
    normal: [],
    uv: []
  };
  vertices = [];
  normals = [];
  uvs = [];

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
    } else if (patterns.obj.test(line) || patterns.group.test(line)) {
      processMesh();
      mesh.name = line.substring(2).trim();
    } else if (patterns.mtllib.test(line)) {
      mtllibs.push(line.substring(7).trim());
    } else if (patterns.usemtl.test(line)) {
      processMesh();
      material.name = line.substring(7).trim();
      materials[material.name] = material;
    } else if (patterns.smooth.test(line)) {

    }
  }

  processMesh();
  processMtls();
};

EZ3.ObjLoader.prototype.start = function(url, onLoad, onError) {
  var that, manager, loader, container, cached;

  cached = this._manager.add(url);

  if (cached) {
    if (onLoad)
      onLoad(cached);

    return cached;
  }

  that = this;
  manager = new EZ3.LoadManager(this._manager.cache);
  loader = new EZ3.DataLoader(manager);
  container = new EZ3.Entity();

  loader.start(url, function(file) {
    that._parse(file.response, container, loader, that._manager, onLoad, onError);
    that._manager.processLoad(url, container);
  });

  return container;
};
