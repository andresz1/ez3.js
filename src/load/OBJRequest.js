/**
 * @class OBJRequest
 * @extends Request
 */

EZ3.OBJRequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Entity(), crossOrigin);
};

EZ3.OBJRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.OBJRequest.prototype.constructor = EZ3.OBJRequest;

EZ3.OBJRequest.prototype._parse = function(data, onLoad) {
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

        fixedUvs.push(uvs[2 * uv]);
        fixedUvs.push(1.0 - uvs[2 * uv + 1]);
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

        for (j = 0; j < 3; j++)
          fixedNormals.push(normals[3 * normal + j]);

        fixedUvs.push(uvs[2 * uv]);
        fixedUvs.push(1.0 - uvs[2 * uv + 1]);
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

      that.response.add(mesh);

      mesh = new EZ3.Mesh(new EZ3.Geometry(), new EZ3.MeshMaterial());
    }
  }

  function processMaterials() {
    var loader = new EZ3.Loader();
    var tokens = that.url.split('/');
    var baseUrl = that.url.substr(0, that.url.length - tokens[tokens.length - 1].length);
    var files = [];
    var i;

    for (i = 0; i < libraries.length; i++)
      files.push(loader.add(new EZ3.DataRequest(baseUrl + libraries[i])));

    loader.onComplete.add(function() {
      for (i = 0; i < files.length; i++)
        processMaterial(baseUrl, files[i].data, loader);

      loader.onComplete.removeAll();
      loader.onComplete.add(function() {
        onLoad(that.url, that.response);
      });

      loader.start();
    });

    loader.start();
  }

  function processMaterial(baseUrl, data, loader) {
    var lines = data.split('\n');
    var line;
    var key;
    var value;
    var currents;
    var i;
    var j;

    function processColor(color) {
      var values = color.split(' ');

      return new EZ3.Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
    }

    function processEmissive(color) {
      var emissive = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].emissive = emissive;
    }

    function processDiffuse(color) {
      var diffuse = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].diffuse = diffuse;
    }

    function processSpecular(color) {
      var specular = processColor(color);
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].specular = specular;
    }

    function processDiffuseMap(url) {
      var texture = new EZ3.Texture2D(loader.add(new EZ3.ImageRequest(baseUrl + url)));
      var i;

      for (i = 0; i < currents.length; i++)
        currents[i].diffuseMap = texture;
    }

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      j = line.indexOf(' ');

      key = (j >= 0) ? line.substring(0, j) : line;
      key = key.toLowerCase();

      value = (j >= 0) ? line.substring(j + 1) : '';
      value = value.trim();

      if (key === 'newmtl') {
        currents = materials[value];
      } else if (key === 'ka') {
        processEmissive(value);
      } else if (key === 'kd') {
        processDiffuse(value);
      } else if (key === 'ks') {
        processSpecular(value);
      } else if (key === 'ns') {

      } else if (key === 'd') {

      } else if (key === 'map_ka') {

      } else if (key === 'map_kd') {
        processDiffuseMap(value);
      } else if (key === 'map_ks') {

      } else if (key === 'map_ns') {

      } else if (key === 'map_bump') {

      } else if (key === 'map_d') {

      }
    }
  }

  for (i = 0; i < lines.length; i++) {
    line = lines[i].trim().replace(/ +(?= )/g, '');

    if (line.length === 0 || line.charAt(0) === '#')
      continue;
    else if ((result = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processVertex(result);
    else if ((result = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processNormal(result);
    else if ((result = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/.exec(line)))
      processUv(result);
    else if ((result = /f\s(([+-]?\d+\s){2,}[+-]?\d+)/.exec(line)))
      processFace1(triangulate(result[1]));
    else if ((result = /f\s(([+-]?\d+\/[+-]?\d+\s){2,}[+-]?\d+\/[+-]?\d+)/.exec(line)))
      processFace2(triangulate(result[1]));
    else if ((result = /f\s((([+-]?\d+\/[+-]?\d+\/[+-]?\d+\s){2,})[+-]?\d+\/[+-]?\d+\/[+-]?\d+)/.exec(line)))
      processFace3(triangulate(result[1]));
    else if ((result = /f\s(([+-]?\d+\/\/[+-]?\d+\s){2,}[+-]?\d+\/\/[+-]?\d+)/.exec(line)))
      processFace4(triangulate(result[1]));
    else if (/^mtllib/.test(line))
      libraries.push(line.substring(7).trim());
    else if (/^o/.test(line) || /^g/.test(line)) {
      processMesh();
      mesh.name = line.substring(2).trim();
    } else if (/^usemtl/.test(line)) {
      processMesh();
      mesh.material.name = line.substring(7).trim();

      if (!materials[mesh.material.name])
        materials[mesh.material.name] = [];

      materials[mesh.material.name].push(mesh.material);
    }
  }

  processMesh();
  processMaterials();
};

EZ3.OBJRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var loader = new EZ3.Loader();
  var file = loader.add(new EZ3.DataRequest(this.url, this.crossOrigin));

  loader.onComplete.add(function(error) {
    if (error)
      onError(that.url, true);

    that._parse(file.data, onLoad);
  });

  loader.start();
};
