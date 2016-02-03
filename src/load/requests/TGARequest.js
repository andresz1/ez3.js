/**
 * @class EZ3.TGARequest
 * @extends EZ3.Request
 * @param {String} url
 * @param {Boolean} [cached]
 * @param {Boolean} [crossOrigin]
 */
EZ3.TGARequest = function(url, cached, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), cached, crossOrigin);
};

EZ3.TGARequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.TGARequest.prototype.constructor = EZ3.TGARequest;

/**
 * @method EZ3.TGARequest#_parse
 * @param {ArrayBuffer} data
 * @param {Function} onLoad
 * @param {Function} onError
 */
EZ3.TGARequest.prototype._parse = function(data, onLoad, onError) {
  var TYPE_NO_DATA = 0;
  var TYPE_INDEXED = 1;
  var TYPE_RGB = 2;
  var TYPE_GREY = 3;
  var TYPE_RLE_INDEXED = 9;
  var TYPE_RLE_RGB = 10;
  var TYPE_RLE_GREY = 11;
  var ORIGIN_MASK = 0x30;
  var ORIGIN_SHIFT = 0x04;
  var ORIGIN_BL = 0x00;
  var ORIGIN_BR = 0x01;
  var ORIGIN_UL = 0x02;
  var ORIGIN_UR = 0x03;
  var that = this;

  function checkHeader(header) {
    switch (header.imageType) {
      case TYPE_INDEXED:
      case TYPE_RLE_INDEXED:
        if (header.colormapLength > 256 || header.colormapSize !== 24 || header.colormapType !== 1)
          onError(that.url);
        break;
      case TYPE_RGB:
      case TYPE_GREY:
      case TYPE_RLE_RGB:
      case TYPE_RLE_GREY:
        if (header.colormapType)
          onError(that.url);
        break;
      case TYPE_NO_DATA:
        onError(that.url);
        break;
      default:
        onError(that.url);
    }

    if (header.width <= 0 || header.height <= 0)
      onError(that.url);

    if (header.pixelSize !== 8 && header.pixelSize !== 16 && header.pixelSize !== 24 && header.pixelSize !== 32)
      onError(that.url);
  }

  function processData(useRle, usePal, header, offset, data) {
    var pixelSize =  header.pixelSize >> 3;
    var pixelTotal = header.width * header.height * pixelSize;
    var pixelData;
    var palettes;
    var pixels;
    var shift;
    var count;
    var c;
    var i;

    if (usePal)
      palettes = data.subarray(offset, offset += header.colormapLength * (header.colormapSize >> 3));

    if (useRle) {
      pixelData = new Uint8Array(pixelTotal);
      pixels = new Uint8Array(pixelSize);
      shift = 0;

      while (shift < pixelTotal) {
        c = data[offset++];
        count = (c & 0x7f) + 1;

        if (c & 0x80) {
          for (i = 0; i < pixelSize; ++i)
            pixels[i] = data[offset++];

          for (i = 0; i < count; ++i)
            pixelData.set(pixels, shift + i * pixelSize);

          shift += pixelSize * count;
        } else {
          count *= pixelSize;

          for (i = 0; i < count; ++i)
            pixelData[shift + i] = data[offset++];

          shift += count;
        }
      }
    } else
      pixelData = data.subarray(offset, offset += (usePal ? header.width * header.height : pixelTotal));

    return {
      pixelData: pixelData,
      palettes: palettes
    };
  }

  function processImageData8bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palettes) {
    var colormap = palettes;
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i++) {
        color = image[i];
        imageData[(x + width * y) * 4 + 3] = 255;
        imageData[(x + width * y) * 4 + 2] = colormap[(color * 3) + 0];
        imageData[(x + width * y) * 4 + 1] = colormap[(color * 3) + 1];
        imageData[(x + width * y) * 4 + 0] = colormap[(color * 3) + 2];
      }
    }

    return imageData;
  }

  function processImageData16bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 2) {
        color = image[i + 0] + (image[i + 1] << 8);
        imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
        imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
        imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
        imageData[(x + width * y) * 4 + 3] = (color & 0x8000) ? 0 : 255;
      }
    }

    return imageData;
  }

  function processImageData24bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 3) {
        imageData[(x + width * y) * 4 + 3] = 255;
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 1];
        imageData[(x + width * y) * 4 + 0] = image[i + 2];
      }
    }

    return imageData;
  }

  function processImageData32bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 4) {
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 1];
        imageData[(x + width * y) * 4 + 0] = image[i + 2];
        imageData[(x + width * y) * 4 + 3] = image[i + 3];
      }
    }

    return imageData;
  }

  function processImageDataGrey8bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var color;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i++) {
        color = image[i];
        imageData[(x + width * y) * 4 + 0] = color;
        imageData[(x + width * y) * 4 + 1] = color;
        imageData[(x + width * y) * 4 + 2] = color;
        imageData[(x + width * y) * 4 + 3] = 255;
      }
    }

    return imageData;
  }

  function processImageDataGrey16bits(width, imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {
    var i = 0;
    var x;
    var y;

    for (y = yStart; y !== yEnd; y += yStep) {
      for (x = xStart; x !== xEnd; x += xStep, i += 2) {
        imageData[(x + width * y) * 4 + 0] = image[i + 0];
        imageData[(x + width * y) * 4 + 1] = image[i + 0];
        imageData[(x + width * y) * 4 + 2] = image[i + 0];
        imageData[(x + width * y) * 4 + 3] = image[i + 1];
      }
    }

    return imageData;
  }

  function processImageData(useGrey, header, image, palette) {
    var width = header.width;
    var height = header.height;
    var data = new Uint8Array(width * height * 4);
    var xStart;
    var yStart;
    var xStep;
    var yStep;
    var xEnd;
    var yEnd;

    switch ((header.flags & ORIGIN_MASK) >> ORIGIN_SHIFT) {
      default:
      case ORIGIN_UL:
        xStart = 0;
        xStep = 1;
        xEnd = width;
        yStart = 0;
        yStep = 1;
        yEnd = height;
      break;

      case ORIGIN_BL:
        xStart = 0;
        xStep = 1;
        xEnd = width;
        yStart = height - 1;
        yStep = -1;
        yEnd = -1;
        break;

      case ORIGIN_UR:
        xStart = width - 1;
        xStep = -1;
        xEnd = -1;
        yStart = 0;
        yStep = 1;
        yEnd = height;
        break;

      case ORIGIN_BR:
        xStart = width - 1;
        xStep = -1;
        xEnd = -1;
        yStart = height - 1;
        yStep = -1;
        yEnd = -1;
        break;
    }

    if (useGrey) {
      switch (header.pixelSize) {
        case 8:
          processImageDataGrey8bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        case 16:
          processImageDataGrey16bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        default:
          onError(that.url);
          break;
      }
    } else {
      switch (header.pixelSize) {
        case 8:
          processImageData8bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palette);
          break;

        case 16:
          processImageData16bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 24:
          processImageData24bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 32:
          processImageData32bits(width, data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        default:
          onError(that.url);
          break;
      }
    }

    return data;
  }

  function init() {
    var useRle = false;
    var usePal = false;
    var useGrey = false;
    var content;
    var offset;
    var header;
    var result;

    if (data.length < 19)
      onError(that.url);

    content = new Uint8Array(data);
    offset = 0;
    header = {
      idLenght: content[offset++],
      colormapType: content[offset++],
      imageType: content[offset++],
      colormapIndex: content[offset++] | content[offset++] << 8,
      colormapLength: content[offset++] | content[offset++] << 8,
      colormapSize: content[offset++],
      origin: [
        content[offset++] | content[offset++] << 8,
        content[offset++] | content[offset++] << 8
      ],
      width: content[offset++] | content[offset++] << 8,
      height: content[offset++] | content[offset++] << 8,
      pixelSize: content[offset++],
      flags: content[offset++]
    };

    checkHeader(header);

    if (header.idLenght + offset > data.length)
      onError(that.url);

    offset += header.idLenght;

    switch (header.imageType) {
      case TYPE_RLE_INDEXED:
        useRle = true;
        usePal = true;
        break;

      case TYPE_INDEXED:
        usePal = true;
        break;

      case TYPE_RLE_RGB:
        useRle = true;
        break;

      case TYPE_RGB:
        break;

      case TYPE_RLE_GREY:
        useRle = true;
        useGrey = true;
        break;

      case TYPE_GREY:
        useGrey = true;
        break;
    }

    result = processData(useRle, usePal, header, offset, content);

    that.asset.data = processImageData(useGrey, header, result.pixelData, result.palettes);
    that.asset.width = header.width;
    that.asset.height = header.height;

    onLoad(that.url, that.asset, that.cached);
  }

  init();
};

/**
 * @method EZ3.TGARequest#send
 * @param {Function} onLoad
 * @param {Function} onError
 */
EZ3.TGARequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, false, this.crossOrigin, 'arraybuffer');

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url);

    that._parse(assets.get(that.url).data, onLoad);
  });

  requests.send();
};
