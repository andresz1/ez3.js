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

EZ3.Obj.prototype._parse = function(data, onLoad) {
  var that = this;
  var mesh = new EZ3.Mesh(new EZ3.Geometry(), new EZ3.MeshMaterial());
  var lines = data.split('\n');
  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];
  var fixedIndices = [];
  var fixedVertices = [];
  var fixedNormals = [];
  var fixedUvs = [];
  var materials = [];
  var libraries = [];
  var line;
  var result;
  var i;

  function triangulate(face) {
    var data = [];
    var i;

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

  function processVertexIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return vertices.length / 3 + index;

    return index - 1;
  }

  function processNormalIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return normals.length / 3 + index;

    return index - 1;
  }

  function processUvIndex(index) {
    index = parseInt(index);

    if (index <= 0)
      return uvs.length / 2 + index;

    return index - 1;
  }

  function processFace1(face) {
    var vertex;
    var index;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      vertex = processVertexIndex(face[i]);

      if (indices[vertex] === undefined) {
        index = fixedVertices.length / 3;
        indices[vertex] = index;

        fixedIndices.push(index);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);
      } else
        fixedIndices.push(indices[vertex]);
    }
  }

  function processFace2(face) {
    var point;
    var vertex;
    var uv;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      vertex = processVertexIndex(point[0]);
      uv = processUvIndex(point[1]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].uv === uv) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          uv: uv,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        for (j = 0; j < 2; j++)
          fixedUvs.push(uvs[2 * uv + j]);
      }
    }
  }

  function processFace3(face) {
    var point;
    var vertex;
    var uv;
    var normal;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('/');

      vertex = processVertexIndex(point[0]);
      uv = processUvIndex(point[1]);
      normal = processNormalIndex(point[2]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].uv === uv && indices[vertex][j].normal === normal) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          uv: uv,
          normal: normal,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        for (j = 0; j < 2; j++)
          fixedUvs.push(uvs[2 * uv + j]);

        for (j = 0; j < 3; j++)
          fixedNormals.push(normals[3 * normal + j]);
      }
    }
  }

  function processFace4(face) {
    var point;
    var vertex;
    var normal;
    var index;
    var count;
    var i;
    var j;

    for (i = 0; i < face.length; i++) {
      point = face[i].split('//');

      vertex = processVertexIndex(point[0]);
      normal = processNormalIndex(point[1]);

      index = -1;
      count = fixedVertices.length / 3;

      if (!indices[vertex])
        indices[vertex] = [];

      for (j = 0; j < indices[vertex].length; j++) {
        if (indices[vertex][j].normal === normal) {
          index = indices[vertex][j].index;
          break;
        }
      }

      if (index >= 0)
        fixedIndices.push(index);
      else {
        indices[vertex].push({
          normal: normal,
          index: count
        });

        fixedIndices.push(count);

        for (j = 0; j < 3; j++)
          fixedVertices.push(vertices[3 * vertex + j]);

        for (j = 0; j < 3; j++)
          fixedNormals.push(normals[3 * normal + j]);
      }
    }
  }

  function processMesh() {
    var buffer;

    if (fixedIndices.length) {
      /*console.log(fixedIndices);
      console.log(fixedVertices);
      console.log(fixedUvs);
      console.log(fixedNormals);

      console.log(fixedIndices.length);
      console.log(fixedVertices.length/3);
      console.log(fixedUvs.length/2);
      console.log(fixedNormals.length/3);*/

      var maxx = -9999999;
      var minx = 9999999;
      var maxy = -9999999;
      var miny = 9999999;

      for (var i = 0; i < fixedUvs.length; i+=2) {
        maxx = Math.max(maxx, fixedUvs[i]);
        minx = Math.min(minx, fixedUvs[i]);
        maxy = Math.max(maxy, fixedUvs[i + 1]);
        miny = Math.min(miny, fixedUvs[i + 1]);
      }

      for (i = 0; i < fixedUvs.length; i+=2) {
        fixedUvs[i + 1] = 1.0 - fixedUvs[i + 1];
      }

      console.log(fixedUvs);

      /*console.log('xxxxxxxxxxxxxxxxxxxxxx');
      console.log(maxx);
      console.log(minx);
      console.log(maxy);
      console.log(miny);*/

      buffer = new EZ3.IndexBuffer(fixedIndices, false, true);
      mesh.geometry.buffers.add('triangle', buffer);

      buffer = new EZ3.VertexBuffer(fixedVertices);
      buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
      mesh.geometry.buffers.add('position', buffer);

      if (fixedUvs.length) {
        buffer = new EZ3.VertexBuffer(fixedUvs);
        buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
        mesh.geometry.buffers.add('uv', buffer);

        fixedUvs = [];
      }

      if (fixedNormals.length) {
        buffer = new EZ3.VertexBuffer(fixedNormals);
        buffer.addAttribute('normal', new EZ3.VertexBufferAttribute(3));
        mesh.geometry.buffers.add('normal', buffer);

        fixedNormals = [];
      }

      indices = [];
      fixedIndices = [];
      fixedVertices = [];

      that.content.add(mesh);

      mesh = new EZ3.Mesh(new EZ3.Geometry(), new EZ3.MeshMaterial());
    }
  }

  function processMaterials() {
    var load, data, tokens, baseUrl;
    var i;

    load = new EZ3.LoadManager();
    data = [];

    tokens = that.url.split('/');
    baseUrl = that.url.substr(0, that.url.length - tokens[tokens.length - 1].length);

    for (i = 0; i < libraries.length; i++)
      data.push(load.data(baseUrl + libraries[i]));

    load.onComplete.add(function() {
      var i;

    //  console.log('1');

      for (i = 0; i < data.length; i++)
        processMaterial(baseUrl, data[i].response, load);

      load.onComplete.removeAll();
      load.onComplete.add(function() {
    //    console.log('3');
        onLoad(that.url, that.content);
      });
      load.onProgress.add(function(a, b, c, d, e) {
      //    console.log(a + ' ' + b + ' ' + c + ' '+ d + ' ' + e);
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

      key = key.toLowerCase();

      if (key === 'newmtl') {
        material = materials[value];
      } else if (key === 'kd') {

      } else if (key === 'ka') {

      } else if (key === 'ks') {

      } else if (key === 'ns') {

      } else if (key === 'd') {

      } else if (key === 'map_ka') {

      } else if (key === 'map_kd') {
        console.log(baseUrl + value);
        material.diffuseMap = new EZ3.Texture2D(load.image(baseUrl + value));
      } else if (key === 'map_ks') {

      } else if (key === 'map_ns') {

      } else if (key === 'map_bump') {

      } else if (key === 'map_d') {

      }
    }
  }

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#') {
      continue;
    } else if ((result = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line))) {
      processVertex(result);
    } else if ((result = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line))) {
      processNormal(result);
    } else if ((result = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line))) {
      processUv(result);
    } else if ((result = /f\s(([+-]?\d+\s){2,}[+-]?\d+)/.exec(line))) {
      //console.log('f1');
      processFace1(triangulate(result[1]));
    } else if ((result = /f\s(([+-]?\d+\/[+-]?\d+\s){2,}[+-]?\d+\/[+-]?\d+)/.exec(line))) {
    //  console.log('f2');
      processFace2(triangulate(result[1]));
    } else if ((result = /f\s((([+-]?\d+\/[+-]?\d+\/[+-]?\d+\s){2,})[+-]?\d+\/[+-]?\d+\/[+-]?\d+)/.exec(line))) {
    //  console.log('f3');
      processFace3(triangulate(result[1]));
    } else if ((result = /f\s(([+-]?\d+\/\/[+-]?\d+\s){2,}[+-]?\d+\/\/[+-]?\d+)/.exec(line))) {
    //  console.log('f4');
      processFace4(triangulate(result[1]));
    } else if (/^o/.test(line) || /^g/.test(line)) {
      processMesh();
      mesh.name = line.substring(2).trim();
    } else if (/^mtllib/.test(line)) {
      libraries.push(line.substring(7).trim());
    } else if (/^usemtl/.test(line)) {
      processMesh();
      mesh.material.name = line.substring(7).trim();
      materials[mesh.material.name] = mesh.material;
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
