/**
 * @class MDLRequest
 * @extends Request
 */

EZ3.MDLRequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Entity(), cached, crossOrigin);
};

EZ3.MDLRequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.MDLRequest.prototype.constructor = EZ3.MDLRequest;

EZ3.MDLRequest.prototype._parse = function(data, onLoad, onError) {
  var that = this;
  var offset = 0;
  var palette = [
    [  0,   0,   0], [ 15,  15,  15], [ 31,  31,  31], [ 47,  47,  47],
    [ 63,  63,  63], [ 75,  75,  75], [ 91,  91,  91], [107, 107, 107],
    [123, 123, 123], [139, 139, 139], [155, 155, 155], [171, 171, 171],
    [187, 187, 187], [203, 203, 203], [219, 219, 219], [235, 235, 235],
    [ 15,  11,   7], [ 23,  15,  11], [ 31,  23,  11], [ 39,  27,  15],
    [ 47,  35,  19], [ 55,  43,  23], [ 63,  47,  23], [ 75,  55,  27],
    [ 83,  59,  27], [ 91,  67,  31], [ 99,  75,  31], [107,  83,  31],
    [115,  87,  31], [123,  95,  35], [131, 103,  35], [143, 111,  35],
    [ 11,  11,  15], [ 19,  19,  27], [ 27,  27,  39], [ 39,  39,  51],
    [ 47,  47,  63], [ 55,  55,  75], [ 63,  63,  87], [ 71,  71, 103],
    [ 79,  79, 115], [ 91,  91, 127], [ 99,  99, 139], [107, 107, 151],
    [115, 115, 163], [123, 123, 175], [131, 131, 187], [139, 139, 203],
    [  0,   0,   0], [  7,   7,   0], [ 11,  11,   0], [ 19,  19,   0],
    [ 27,  27,   0], [ 35,  35,   0], [ 43,  43,   7], [ 47,  47,   7],
    [ 55,  55,   7], [ 63,  63,   7], [ 71,  71,   7], [ 75,  75,  11],
    [ 83,  83,  11], [ 91,  91,  11], [ 99,  99,  11], [107, 107,  15],
    [  7,   0,   0], [ 15,   0,   0], [ 23,   0,   0], [ 31,   0,   0],
    [ 39,   0,   0], [ 47,   0,   0], [ 55,   0,   0], [ 63,   0,   0],
    [ 71,   0,   0], [ 79,   0,   0], [ 87,   0,   0], [ 95,   0,   0],
    [103,   0,   0], [111,   0,   0], [119,   0,   0], [127,   0,   0],
    [ 19,  19,   0], [ 27,  27,   0], [ 35,  35,   0], [ 47,  43,   0],
    [ 55,  47,   0], [ 67,  55,   0], [ 75,  59,   7], [ 87,  67,   7],
    [ 95,  71,   7], [107,  75,  11], [119,  83,  15], [131,  87,  19],
    [139,  91,  19], [151,  95,  27], [163,  99,  31], [175, 103,  35],
    [ 35,  19,   7], [ 47,  23,  11], [ 59,  31,  15], [ 75,  35,  19],
    [ 87,  43,  23], [ 99,  47,  31], [115,  55,  35], [127,  59,  43],
    [143,  67,  51], [159,  79,  51], [175,  99,  47], [191, 119,  47],
    [207, 143,  43], [223, 171,  39], [239, 203,  31], [255, 243,  27],
    [ 11,   7,   0], [ 27,  19,   0], [ 43,  35,  15], [ 55,  43,  19],
    [ 71,  51,  27], [ 83,  55,  35], [ 99,  63,  43], [111,  71,  51],
    [127,  83,  63], [139,  95,  71], [155, 107,  83], [167, 123,  95],
    [183, 135, 107], [195, 147, 123], [211, 163, 139], [227, 179, 151],
    [171, 139, 163], [159, 127, 151], [147, 115, 135], [139, 103, 123],
    [127,  91, 111], [119,  83,  99], [107,  75,  87], [ 95,  63,  75],
    [ 87,  55,  67], [ 75,  47,  55], [ 67,  39,  47], [ 55,  31,  35],
    [ 43,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [187, 115, 159], [175, 107, 143], [163,  95, 131], [151,  87, 119],
    [139,  79, 107], [127,  75,  95], [115,  67,  83], [107,  59,  75],
    [ 95,  51,  63], [ 83,  43,  55], [ 71,  35,  43], [ 59,  31,  35],
    [ 47,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [219, 195, 187], [203, 179, 167], [191, 163, 155], [175, 151, 139],
    [163, 135, 123], [151, 123, 111], [135, 111,  95], [123,  99,  83],
    [107,  87,  71], [ 95,  75,  59], [ 83,  63,  51], [ 67,  51,  39],
    [ 55,  43,  31], [ 39,  31,  23], [ 27,  19,  15], [ 15,  11,   7],
    [111, 131, 123], [103, 123, 111], [ 95, 115, 103], [ 87, 107,  95],
    [ 79,  99,  87], [ 71,  91,  79], [ 63,  83,  71], [ 55,  75,  63],
    [ 47,  67,  55], [ 43,  59,  47], [ 35,  51,  39], [ 31,  43,  31],
    [ 23,  35,  23], [ 15,  27,  19], [ 11,  19,  11], [  7,  11,   7],
    [255, 243,  27], [239, 223,  23], [219, 203,  19], [203, 183,  15],
    [187, 167,  15], [171, 151,  11], [155, 131,   7], [139, 115,   7],
    [123,  99,   7], [107,  83,   0], [ 91,  71,   0], [ 75,  55,   0],
    [ 59,  43,   0], [ 43,  31,   0], [ 27,  15,   0], [ 11,   7,   0],
    [  0,   0, 255], [ 11,  11, 239], [ 19,  19, 223], [ 27,  27, 207],
    [ 35,  35, 191], [ 43,  43, 175], [ 47,  47, 159], [ 47,  47, 143],
    [ 47,  47, 127], [ 47,  47, 111], [ 47,  47,  95], [ 43,  43,  79],
    [ 35,  35,  63], [ 27,  27,  47], [ 19,  19,  31], [ 11,  11,  15],
    [ 43,   0,   0], [ 59,   0,   0], [ 75,   7,   0], [ 95,   7,   0],
    [111,  15,   0], [127,  23,   7], [147,  31,   7], [163,  39,  11],
    [183,  51,  15], [195,  75,  27], [207,  99,  43], [219, 127,  59],
    [227, 151,  79], [231, 171,  95], [239, 191, 119], [247, 211, 139],
    [167, 123,  59], [183, 155,  55], [199, 195,  55], [231, 227,  87],
    [127, 191, 255], [171, 231, 255], [215, 255, 255], [103,   0,   0],
    [139,   0,   0], [179,   0,   0], [215,   0,   0], [255,   0,   0],
    [255, 243, 147], [255, 247, 199], [255, 255, 255], [159,  91,  83]
  ];


  function processSkins(header, skins) {
    var skinSize = header.skinWidth * header.skinHeight;
    var skinData;
    var image;
    var i;
    var j;

    for (i = 0; i < header.numSkins; i++) {
      skinData = [];
      offset += 4;

      for (j = 0; j < skinSize; j++)
        skinData.push(data.getUint8(offset++, true));

      image = new EZ3.Image(header.skinWidth, header.skinHeight, EZ3.Image.RGBA, new Uint8Array(4 * skinSize));

      for (j = 0; j < skinSize; j++) {
        image.data[4 * j] = palette[skinData[j]][0];
        image.data[4 * j + 1] = palette[skinData[j]][1];
        image.data[4 * j + 2] = palette[skinData[j]][2];
        image.data[4 * j + 3] = 255;
      }

      skins.push(new EZ3.Texture2D(image));
    }
  }

  function processTexCoords(header, seams, uvs) {
    var i;

    for (i = 0; i < header.numVerts; i++) {
      seams.push(data.getInt32(offset, true));
      uvs.push(data.getInt32(offset + 4, true));
      uvs.push(data.getInt32(offset + 8, true));

      offset += 12;
    }
  }

  function processTriangles(header, facesFront, indices) {
    var i;
    var j;

    for (i = 0; i < header.numTris; i++) {
      facesFront.push(data.getInt32(offset, true));

      for (j = 0; j < 3; j++)
        indices.push(data.getInt32(offset + (j + 1) * 4, true));

      offset += 16;
    }
  }

  function processFrames(header, frames) {
    var c;
    var i;
    var j;
    var w;

    for (i = 0; i < header.numFrames; i++) {
      frames[i] = {
        name: [],
        vertices: [],
        normals: []
      };

      offset += 12;

      for (j = 0; j < 16; j++) {
        c = data.getInt8(offset + j, true);

        if (c === 0)
          break;

        frames[i].name.push(c);
      }

      frames[i].name = String.fromCharCode.apply(null, frames[i].name);

      offset += 16;

      for (j = 0; j < header.numVerts; j++) {
        for (w = 2; w >= 0; w--)
          frames[i].vertices.push(header.scale[w] * data.getUint8(offset + w, true) + header.translate[w]);

        offset += 3;

        frames[i].normals.push(data.getUint8(offset++, true));
      }
    }
  }

  function init() {
    var skins = [];
    var seams = [];
    var uvs = [];
    var facesFront = [];
    var indices = [];
    var frames = [];
    var header;
    var n;
    var i;
    var j;
    var w;

    data = new DataView(data);

    header = {
      ident: data.getInt32(offset, true),
      version: data.getInt32(offset + 4, true),
      scale: [
        data.getFloat32(offset + 8, true),
        data.getFloat32(offset + 12, true),
        data.getFloat32(offset + 16, true)
      ],
      translate: [
        data.getFloat32(offset + 20, true),
        data.getFloat32(offset + 24, true),
        data.getFloat32(offset + 28, true)
      ],
      numSkins: data.getInt32(offset + 48, true),
      skinWidth: data.getInt32(offset + 52, true),
      skinHeight: data.getInt32(offset + 56, true),
      numVerts: data.getInt32(offset + 60, true),
      numTris: data.getInt32(offset + 64, true),
      numFrames: data.getInt32(offset + 68, true)
    };

    if (header.ident !== 1330660425 || header.version !== 6)
      return onError(that.url);

    offset += 84;

    processSkins(header, skins);
    processTexCoords(header, seams, uvs);
    processTriangles(header, facesFront, indices);
    processFrames(header, frames);

    var rev = {};
    var numVerts = header.numVerts;

    for (i = 0; i < header.numTris; i++) {
      for (j = 0; j < 3; j++) {
        n = 3 * i + j;

        if (!facesFront[i] && seams[indices[n]]) {
          if (!rev[indices[n]]) {

            for (w = 0; w < header.numFrames; w++) {
              frames[w].vertices.push(frames[w].vertices[3 * indices[n]]);
              frames[w].vertices.push(frames[w].vertices[3 * indices[n] + 1]);
              frames[w].vertices.push(frames[w].vertices[3 * indices[n] + 2]);
            }

            uvs.push(uvs[2 * indices[n]] + header.skinWidth * 0.5);
            uvs.push(uvs[2 * indices[n] + 1]);
            rev[indices[n]] = numVerts++;
          }

          indices[n] = rev[indices[n]];
        }
      }
    }

    for (i = 0; i < uvs.length / 2; i++) {
      j = 2 * i;

      uvs[j] = (uvs[j] + 0.5) / header.skinWidth;
      uvs[j + 1] = (uvs[j + 1] + 0.5) / header.skinHeight;
    }

    var mesh = new EZ3.Mesh();
    var buffer;


    console.log(frames);

    buffer = new EZ3.IndexBuffer(indices, false, true);
    mesh.geometry.buffers.add('triangle', buffer);

    buffer = new EZ3.VertexBuffer(frames[0].vertices);
    buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
    mesh.geometry.buffers.add('position', buffer);

    buffer = new EZ3.VertexBuffer(uvs);
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    mesh.geometry.buffers.add('uv', buffer);

    buffer = new EZ3.VertexBuffer(frames[53].vertices);
    buffer.addAttribute('morph1', new EZ3.VertexBufferAttribute(3));
    mesh.geometry.buffers.add('morph1', buffer);

    buffer = new EZ3.VertexBuffer(frames[55].vertices);
    buffer.addAttribute('morph2', new EZ3.VertexBufferAttribute(3));
    mesh.geometry.buffers.add('morph2', buffer);


    mesh.material.morphTarget = true;

    // mesh.material.emissive.set(0.6, 0.6, 0.6);
   //mesh.material.fill = EZ3.Material.WIREFRAME;

   //skins[0].image.download();

    mesh.material.diffuse.set(0.9, 0.9, 0.9);
    mesh.material.diffuseMap = skins[0];

    that.asset.add(mesh);

    onLoad(that.url, that.asset, that.cached);
  }

  init();
};


EZ3.MDLRequest.prototype._parse2 = function(data, onLoad) {
  var that = this;
  var COLOR_MAP = [
    [  0,   0,   0], [ 15,  15,  15], [ 31,  31,  31], [ 47,  47,  47],
    [ 63,  63,  63], [ 75,  75,  75], [ 91,  91,  91], [107, 107, 107],
    [123, 123, 123], [139, 139, 139], [155, 155, 155], [171, 171, 171],
    [187, 187, 187], [203, 203, 203], [219, 219, 219], [235, 235, 235],
    [ 15,  11,   7], [ 23,  15,  11], [ 31,  23,  11], [ 39,  27,  15],
    [ 47,  35,  19], [ 55,  43,  23], [ 63,  47,  23], [ 75,  55,  27],
    [ 83,  59,  27], [ 91,  67,  31], [ 99,  75,  31], [107,  83,  31],
    [115,  87,  31], [123,  95,  35], [131, 103,  35], [143, 111,  35],
    [ 11,  11,  15], [ 19,  19,  27], [ 27,  27,  39], [ 39,  39,  51],
    [ 47,  47,  63], [ 55,  55,  75], [ 63,  63,  87], [ 71,  71, 103],
    [ 79,  79, 115], [ 91,  91, 127], [ 99,  99, 139], [107, 107, 151],
    [115, 115, 163], [123, 123, 175], [131, 131, 187], [139, 139, 203],
    [  0,   0,   0], [  7,   7,   0], [ 11,  11,   0], [ 19,  19,   0],
    [ 27,  27,   0], [ 35,  35,   0], [ 43,  43,   7], [ 47,  47,   7],
    [ 55,  55,   7], [ 63,  63,   7], [ 71,  71,   7], [ 75,  75,  11],
    [ 83,  83,  11], [ 91,  91,  11], [ 99,  99,  11], [107, 107,  15],
    [  7,   0,   0], [ 15,   0,   0], [ 23,   0,   0], [ 31,   0,   0],
    [ 39,   0,   0], [ 47,   0,   0], [ 55,   0,   0], [ 63,   0,   0],
    [ 71,   0,   0], [ 79,   0,   0], [ 87,   0,   0], [ 95,   0,   0],
    [103,   0,   0], [111,   0,   0], [119,   0,   0], [127,   0,   0],
    [ 19,  19,   0], [ 27,  27,   0], [ 35,  35,   0], [ 47,  43,   0],
    [ 55,  47,   0], [ 67,  55,   0], [ 75,  59,   7], [ 87,  67,   7],
    [ 95,  71,   7], [107,  75,  11], [119,  83,  15], [131,  87,  19],
    [139,  91,  19], [151,  95,  27], [163,  99,  31], [175, 103,  35],
    [ 35,  19,   7], [ 47,  23,  11], [ 59,  31,  15], [ 75,  35,  19],
    [ 87,  43,  23], [ 99,  47,  31], [115,  55,  35], [127,  59,  43],
    [143,  67,  51], [159,  79,  51], [175,  99,  47], [191, 119,  47],
    [207, 143,  43], [223, 171,  39], [239, 203,  31], [255, 243,  27],
    [ 11,   7,   0], [ 27,  19,   0], [ 43,  35,  15], [ 55,  43,  19],
    [ 71,  51,  27], [ 83,  55,  35], [ 99,  63,  43], [111,  71,  51],
    [127,  83,  63], [139,  95,  71], [155, 107,  83], [167, 123,  95],
    [183, 135, 107], [195, 147, 123], [211, 163, 139], [227, 179, 151],
    [171, 139, 163], [159, 127, 151], [147, 115, 135], [139, 103, 123],
    [127,  91, 111], [119,  83,  99], [107,  75,  87], [ 95,  63,  75],
    [ 87,  55,  67], [ 75,  47,  55], [ 67,  39,  47], [ 55,  31,  35],
    [ 43,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [187, 115, 159], [175, 107, 143], [163,  95, 131], [151,  87, 119],
    [139,  79, 107], [127,  75,  95], [115,  67,  83], [107,  59,  75],
    [ 95,  51,  63], [ 83,  43,  55], [ 71,  35,  43], [ 59,  31,  35],
    [ 47,  23,  27], [ 35,  19,  19], [ 23,  11,  11], [ 15,   7,   7],
    [219, 195, 187], [203, 179, 167], [191, 163, 155], [175, 151, 139],
    [163, 135, 123], [151, 123, 111], [135, 111,  95], [123,  99,  83],
    [107,  87,  71], [ 95,  75,  59], [ 83,  63,  51], [ 67,  51,  39],
    [ 55,  43,  31], [ 39,  31,  23], [ 27,  19,  15], [ 15,  11,   7],
    [111, 131, 123], [103, 123, 111], [ 95, 115, 103], [ 87, 107,  95],
    [ 79,  99,  87], [ 71,  91,  79], [ 63,  83,  71], [ 55,  75,  63],
    [ 47,  67,  55], [ 43,  59,  47], [ 35,  51,  39], [ 31,  43,  31],
    [ 23,  35,  23], [ 15,  27,  19], [ 11,  19,  11], [  7,  11,   7],
    [255, 243,  27], [239, 223,  23], [219, 203,  19], [203, 183,  15],
    [187, 167,  15], [171, 151,  11], [155, 131,   7], [139, 115,   7],
    [123,  99,   7], [107,  83,   0], [ 91,  71,   0], [ 75,  55,   0],
    [ 59,  43,   0], [ 43,  31,   0], [ 27,  15,   0], [ 11,   7,   0],
    [  0,   0, 255], [ 11,  11, 239], [ 19,  19, 223], [ 27,  27, 207],
    [ 35,  35, 191], [ 43,  43, 175], [ 47,  47, 159], [ 47,  47, 143],
    [ 47,  47, 127], [ 47,  47, 111], [ 47,  47,  95], [ 43,  43,  79],
    [ 35,  35,  63], [ 27,  27,  47], [ 19,  19,  31], [ 11,  11,  15],
    [ 43,   0,   0], [ 59,   0,   0], [ 75,   7,   0], [ 95,   7,   0],
    [111,  15,   0], [127,  23,   7], [147,  31,   7], [163,  39,  11],
    [183,  51,  15], [195,  75,  27], [207,  99,  43], [219, 127,  59],
    [227, 151,  79], [231, 171,  95], [239, 191, 119], [247, 211, 139],
    [167, 123,  59], [183, 155,  55], [199, 195,  55], [231, 227,  87],
    [127, 191, 255], [171, 231, 255], [215, 255, 255], [103,   0,   0],
    [139,   0,   0], [179,   0,   0], [215,   0,   0], [255,   0,   0],
    [255, 243, 147], [255, 247, 199], [255, 255, 255], [159,  91,  83]
  ];

  function init() {
    var skins = [];
    var texCoords = [];
    var triangles = [];
    var frames = [];
    var offset = 0;
    var header;
    var i;
    var j;

    data = new DataView(data);

    header = {
      ident: data.getInt32(offset++ * 4, true),
      version: data.getInt32(offset++ * 4, true),
      scale: [
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true)
      ],
      translate: [
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true)
      ],
      boundingRadius: data.getFloat32(offset++ * 4, true),
      eyePosition: [
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true),
        data.getFloat32(offset++ * 4, true)
      ],
      numSkins: data.getInt32(offset++ * 4, true),
      skinWidth: data.getInt32(offset++ * 4, true),
      skinHeight: data.getInt32(offset++ * 4, true),
      numVerts: data.getInt32(offset++ * 4, true),
      numTris: data.getInt32(offset++ * 4, true),
      numFrames: data.getInt32(offset++ * 4, true),
      syncType: data.getInt32(offset++ * 4, true),
      glags: data.getInt32(offset++ * 4, true),
      size: data.getFloat32(offset++ * 4, true),
    };

    offset *= 4;

    //console.log(header);

    for (i = 0; i < header.numSkins; i++) {
      skins[i] = {
        group: data.getInt32(offset, true),
        data: []
      };

      offset += 4;

      for (j = 0; j < header.skinWidth * header.skinHeight; j++)
        skins[i].data.push(data.getUint8(offset++, true));
    }

    //console.log(skins);

    for (i = 0; i < header.numVerts; i++) {
      texCoords.push({
        onseam: data.getInt32(offset, true),
        s: data.getInt32(offset + 4, true),
        t: data.getInt32(offset + 8, true)
      });

      offset += 12;
    }

    //console.log(texCoords);

    for (i = 0; i < header.numTris; i++) {
      triangles.push({
        facesFront: data.getInt32(offset, true),
        vertex: []
      });

      for (j = 0; j < 3; j++)
        triangles[i].vertex.push(data.getInt32(offset + (j + 1) * 4, true));

      offset += 16;
    }

    //console.log(triangles);

    for (i = 0; i < header.numFrames; i++) {
      frames[i] = {
        type: data.getInt32(offset, true),
        bboxmin: {
          v: [
            data.getUint8(offset + 4, true),
            data.getUint8(offset + 5, true),
            data.getUint8(offset + 6, true),
          ],
          normalIndex: data.getUint8(offset + 7, true)
        },
        bboxmax: {
          v: [
            data.getUint8(offset + 8, true),
            data.getUint8(offset + 9, true),
            data.getUint8(offset + 10, true),
          ],
          normalIndex: data.getUint8(offset + 11, true)
        },
        name: [],
        verts: []
      };

      offset += 12;

      for (j = 0; j < 16; j++)
        frames[i].name.push(data.getInt8(offset + j, true));

      frames[i].name = String.fromCharCode.apply(null, frames[i].name);

      offset += 16;

      for (j = 0; j < header.numVerts; j++) {
        frames[i].verts.push({
          v: [
            data.getUint8(offset++, true),
            data.getUint8(offset++, true),
            data.getUint8(offset++, true),
          ],
          normalIndex: data.getUint8(offset++, true)
        });
      }
    }

    //console.log(frames);

    var indices = [];
    var vertices = [];
    var uvs = [];
    var mesh = new EZ3.Mesh();
    var buffer;
    var image;

    for (i = 0; i < triangles.length; i++) {
      for (j = 0; j < 3; j++)
        indices.push(triangles[i].vertex[j]);
    }

    for (i = 0; i < frames[0].verts.length; i++) {
      for (j = 0; j < 3; j++)
        vertices.push(header.scale[j] * frames[0].verts[i].v[j] + header.translate[j]);
    }

    for (i = 0; i < texCoords.length; i++) {
      uvs.push((texCoords[i].s + 0.5) / header.skinWidth, (texCoords[i].t + 0.5) / header.skinHeight);
    }

    buffer = new EZ3.IndexBuffer(indices, false, true);
    mesh.geometry.buffers.add('triangle', buffer);

    console.log(indices.length);

    buffer = new EZ3.VertexBuffer(vertices);
    buffer.addAttribute('position', new EZ3.VertexBufferAttribute(3));
    mesh.geometry.buffers.add('position', buffer);

    //console.log(uvs);

    buffer = new EZ3.VertexBuffer(uvs);
    buffer.addAttribute('uv', new EZ3.VertexBufferAttribute(2));
    mesh.geometry.buffers.add('uv', buffer);

    mesh.material.faceCulling = EZ3.Material.NONE;

    // mesh.material.emissive.set(0.6, 0.6, 0.6);
  //  mesh.material.fill = EZ3.Material.WIREFRAME;

   image = new EZ3.Image(header.skinWidth, header.skinHeight, EZ3.Image.RGBA, new Uint8Array(4 * header.skinWidth * header.skinHeight));

    for (i = 0; i < header.skinWidth * header.skinHeight; i++) {
      image.data[4 * i] = COLOR_MAP[skins[0].data[i]][0];
      image.data[4 * i + 1] = COLOR_MAP[skins[0].data[i]][1];
      image.data[4 * i + 2] = COLOR_MAP[skins[0].data[i]][2];
      image.data[4 * i + 3] = 255;
    }

    mesh.material.emissive.set(1, 1, 1);
    mesh.material.emissiveMap = new EZ3.Texture2D(image);

    that.asset.add(mesh);

    onLoad(that.url, that.asset, that.cached);
  }

  init();
};


EZ3.MDLRequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, true, this.crossOrigin, 'arraybuffer');

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad, onError);
  });

  requests.send();
};
