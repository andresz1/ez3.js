/**
 * @class Obj
 */

EZ3.Obj = function(url, crossOrigin) {
  this.url = url;
  this.crossOrigin = crossOrigin;
  this.content = new EZ3.Entity();
};

EZ3.Obj.prototype._parseMaterial = function() {

};

EZ3.Obj.prototype._parse = function(data, onLoad, onError) {
  var that, patterns, lines, line, result;
  var mtllibs, materials, material, geometry, mesh, indices, vertices, normals, uvs;
  var i;

  function triangulate(face) {
    var data, i;

    data = [];
    face = face.trim().split(' ');

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
    var indicesCount;
    var i, j, k;
    var buffer;

    indicesCount = [];

    buffer = new EZ3.VertexBuffer();
    buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
    geometry.buffers.add('normal', buffer);

    for (i = 0; i < vertices.length / 3; i++) {
      indicesCount.push(0);

      for (j = 0; j < 3; j++)
        buffer.data.push(0);
    }

    for (i = 0; i < indices.vertex.length; i++) {
      indicesCount[indices.vertex[i]]++;

      for (j = 0; j < 3; j++)
        buffer.data[3 * indices.vertex[i] + j] += normals[3 * indices.normal[i] + j];
    }

    for (i = 0, j = 0; i < vertices.length; i += 3, j++)
      for (k = 0; k < 3; k++)
        buffer.data[i + k] /= indicesCount[j];
  }

  function computeUvs() {
    var i, j;
    var buffer;

    buffer = new EZ3.VertexBuffer();
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    geometry.buffers.add('uv', buffer);

    for (i = 0; i < indices.vertex.length; i++)
      for (j = 0; j < 2; j++)
        buffer.data[2 * indices.vertex[i] + j] = uvs[2 * indices.uv[i] + j];
  }

  function processMesh() {
    var buffer;

    if (indices.vertex.length > 0 && vertices.length > 0) {
      buffer = new EZ3.IndexBuffer(indices.vertex, false, true);
      geometry.buffers.add('triangle', buffer);

      buffer = new EZ3.VertexBuffer(vertices);
      buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
      geometry.buffers.add('position', buffer);

      if (indices.normal.length && normals.length)
        computeNormals();

      if (indices.uv.length && uvs.length)
        computeUvs();

      console.log('2');

      that.content.add(mesh);

      material = new EZ3.MeshMaterial();
      geometry = new EZ3.Geometry();
      mesh = new EZ3.Mesh(geometry, material);

      indices.vertex = [];
      indices.normal = [];
      indices.uv = [];
    }
  }

  function processMaterials() {
    var load, data, tokens, baseUrl;
    var i;

    load = new EZ3.LoadManager();
    data = [];

    tokens = that.url.split('/');
    baseUrl = that.url.substr(0, that.url.length - tokens[tokens.length - 1].length);

    for (i = 0; i < mtllibs.length; i++)
      data.push(load.data(baseUrl + mtllibs[i]));

    load.onComplete.add(function() {
      var i;

      for (i = 0; i < data.length; i++)
        processMaterial(baseUrl, data[i].response, load);

      load.onComplete.removeAll();
      load.onComplete.add(function() {
        onLoad(that.url, that.content);
      });

      load.start();
    });

    load.start();
  }

  function processMaterial(baseUrl, data, load) {
    var lines, line, key, value, material;
    var i, j;

    lines = data.split('\n');

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      j = line.indexOf(' ');

      key = (j >= 0) ? line.substring(0, j) : line;
      key = key.toLowerCase();

      value = (j >= 0) ? line.substring(j + 1) : '';
      value = value.trim();

      if (key === 'newmtl') {
        material = materials[value];
      } else if (key === 'kd') {

      } else if (key === 'ka') {

      } else if (key === 'ks') {

      } else if (key === 'ns') {

      } else if (key === 'd') {

      } else if (key === 'map_ka') {

      } else if (key === 'map_kd') {

        material.diffuseMap = new EZ3.Texture(load.image(baseUrl + value));
      } else if (key === 'map_ks') {

      } else if (key === 'map_ns') {

      } else if (key === 'map_bump') {

      } else if (key === 'map_d') {

      }
    }
  }

  that = this;
  patterns = {
    obj: /^o/,
    group: /^g/,
    mtllib: /^mtllib/,
    usemtl: /^usemtl/,
    smooth: /^s/,
    vertex: /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    normal: /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    uv: /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,
    face1: /f\s(([\d]+[\s]){2,}[\d]+)+/,
    face2: /f\s((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face3: /f\s((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/,
    face4: /f\s((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/
  };
  mtllibs = [];
  materials = {};
  material = new EZ3.MeshMaterial();
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
  lines = data.split('\n');

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
  processMaterials();
};

EZ3.Obj.prototype.load = function(onLoad, onError) {
  var that, load, data;

  that = this;
  load = new EZ3.LoadManager();

  data = load.data(this.url);
  load.onComplete.add(function() {
    that._parse(data.response, onLoad, onError);
  });

  load.start();

  return this.content;
};
