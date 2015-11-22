/**
 * @class TGARequest
 * @extends Request
 */

EZ3.TGARequest = function(url, crossOrigin) {
  EZ3.Request.call(this, url, new EZ3.Image(), crossOrigin);
};

EZ3.TGARequest.prototype = Object.create(EZ3.Request.prototype);
EZ3.TGARequest.prototype.constructor = EZ3.TGARequest;

EZ3.TGARequest.prototype._parse = function(data, onLoad) {
  var TGA_TYPE_NO_DATA = 0;
  var TGA_TYPE_INDEXED = 1;
  var TGA_TYPE_RGB = 2;
  var TGA_TYPE_GREY = 3;
  var TGA_TYPE_RLE_INDEXED = 9;
  var TGA_TYPE_RLE_RGB = 10;
  var TGA_TYPE_RLE_GREY = 11;
  var TGA_ORIGIN_MASK = 0x30;
  var TGA_ORIGIN_SHIFT = 0x04;
  var TGA_ORIGIN_BL = 0x00;
  var TGA_ORIGIN_BR = 0x01;
  var TGA_ORIGIN_UL = 0x02;
  var TGA_ORIGIN_UR = 0x03;


  if (data.length < 19)
    console.error('THREE.TGALoader.parse: Not enough data to contain header.');

  //console.log(data);
  var content = new Uint8Array(data);
  var offset = 0;
  var header = {
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

  function tgaCheckHeader(header) {
    switch (header.imageType) {
      case TGA_TYPE_INDEXED:
      case TGA_TYPE_RLE_INDEXED:
        if (header.colormapLength > 256 || header.colormapSize !== 24 || header.colormapType !== 1) {

          console.error('THREE.TGALoader.parse.tgaCheckHeader: Invalid type colormap data for indexed type');

        }
        break;
      case TGA_TYPE_RGB:
      case TGA_TYPE_GREY:
      case TGA_TYPE_RLE_RGB:
      case TGA_TYPE_RLE_GREY:
        if (header.colormapType) {

          console.error('THREE.TGALoader.parse.tgaCheckHeader: Invalid type colormap data for colormap type');

        }
        break;
      case TGA_TYPE_NO_DATA:
        console.error('THREE.TGALoader.parse.tgaCheckHeader: No data');
        break;
      default:
        console.error('THREE.TGALoader.parse.tgaCheckHeader: Invalid type " ' + header.imageType + '"');
    }

    if (header.width <= 0 || header.height <= 0)
      console.error('THREE.TGALoader.parse.tgaCheckHeader: Invalid image size');

    if (header.pixelSize !== 8 && header.pixelSize !== 16 && header.pixelSize !== 24 && header.pixelSize !== 32)
      console.error('THREE.TGALoader.parse.tgaCheckHeader: Invalid pixel size "' + header.pixelSize + '"');
  }

  tgaCheckHeader(header);

  if (header.idLenght + offset > data.length)
    console.error('THREE.TGALoader.parse: No data');

  offset += header.idLenght;

  var useRle = false;
  var usePal = false;
  var useGrey = false;

  switch (header.imageType) {
    case TGA_TYPE_RLE_INDEXED:
      useRle = true;
      usePal = true;
      break;

    case TGA_TYPE_INDEXED:
      usePal = true;
      break;

    case TGA_TYPE_RLE_RGB:
      useRle = true;
      break;

    case TGA_TYPE_RGB:
      break;

    case TGA_TYPE_RLE_GREY:
      useRle = true;
      useGrey = true;
      break;

    case TGA_TYPE_GREY:
      useGrey = true;
      break;
  }

  function tgaParse(useRle, usePal, header, offset, data) {
    var pixelSize =  header.pixelSize >> 3;
    var pixelTotal = header.width * header.height * pixelSize;
    var pixelData;
    var palettes;

    if (usePal)
      palettes = data.subarray(offset, offset += header.colormapLength * (header.colormapSize >> 3));

    if (useRle) {
      pixelData = new Uint8Array(pixelTotal);

      var c, count, i;
      var shift = 0;
      var pixels = new Uint8Array(pixelSize);

      while (shift < pixelTotal) {

        c = data[offset++];
        count = (c & 0x7f) + 1;

        // RLE pixels.
        if (c & 0x80) {

          // Bind pixel tmp array
          for (i = 0; i < pixelSize; ++i) {

            pixels[i] = data[offset++];

          }

          // Copy pixel array
          for (i = 0; i < count; ++i) {

            pixelData.set(pixels, shift + i * pixelSize);

          }

          shift += pixelSize * count;

        } else {

          // Raw pixels.
          count *= pixelSize;
          for (i = 0; i < count; ++i) {

            pixelData[shift + i] = data[offset++];

          }
          shift += count;

        }

      }

    } else {

      // RAW Pixels
      pixelData = data.subarray(
        offset, offset += (usePal ? header.width * header.height : pixelTotal)
      );

    }

    return {
      pixelData: pixelData,
      palettes: palettes
    };

  }

  function tgaGetImageData8bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palettes) {

    var colormap = palettes;
    var color, i = 0,
      x, y;
    var width = header.width;

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

  function tgaGetImageData16bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {

    var color, i = 0,
      x, y;
    var width = header.width;

    for (y = yStart; y !== yEnd; y += yStep) {

      for (x = xStart; x !== xEnd; x += xStep, i += 2) {

        color = image[i + 0] + (image[i + 1] << 8); // Inversed ?
        imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
        imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
        imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
        imageData[(x + width * y) * 4 + 3] = (color & 0x8000) ? 0 : 255;

      }

    }

    return imageData;

  }

  function tgaGetImageData24bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {

    var i = 0,
      x, y;
    var width = header.width;

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

  function tgaGetImageData32bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {

    var i = 0,
      x, y;
    var width = header.width;

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

  function tgaGetImageDataGrey8bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {

    var color, i = 0,
      x, y;
    var width = header.width;

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

  function tgaGetImageDataGrey16bits(imageData, yStart, yStep, yEnd, xStart, xStep, xEnd, image) {

    var i = 0,
      x, y;
    var width = header.width;

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

  function getTgaRGBA(width, height, image, palette) {

    var xStart,
      yStart,
      xStep,
      yStep,
      xEnd,
      yEnd,
      data = new Uint8Array(width * height * 4);

    switch ((header.flags & TGA_ORIGIN_MASK) >> TGA_ORIGIN_SHIFT) {
      default:
        case TGA_ORIGIN_UL:
        xStart = 0;
      xStep = 1;
      xEnd = width;
      yStart = 0;
      yStep = 1;
      yEnd = height;
      break;

      case TGA_ORIGIN_BL:
          xStart = 0;
        xStep = 1;
        xEnd = width;
        yStart = height - 1;
        yStep = -1;
        yEnd = -1;
        break;

      case TGA_ORIGIN_UR:
          xStart = width - 1;
        xStep = -1;
        xEnd = -1;
        yStart = 0;
        yStep = 1;
        yEnd = height;
        break;

      case TGA_ORIGIN_BR:
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
          tgaGetImageDataGrey8bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        case 16:
          tgaGetImageDataGrey16bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;
        default:
          console.error('THREE.TGALoader.parse.getTgaRGBA: not support this format');
          break;
      }

    } else {

      switch (header.pixelSize) {
        case 8:
          tgaGetImageData8bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image, palette);
          break;

        case 16:
          tgaGetImageData16bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 24:
          tgaGetImageData24bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        case 32:
          tgaGetImageData32bits(data, yStart, yStep, yEnd, xStart, xStep, xEnd, image);
          break;

        default:
          console.error('THREE.TGALoader.parse.getTgaRGBA: not support this format');
          break;
      }

    }

    return data;
  }

  var result = tgaParse(useRle, usePal, header, offset, content);
  var rgbaData = getTgaRGBA(header.width, header.height, result.pixelData, result.palettes);

  this.asset.width = header.width;
  this.asset.height = header.height;
  this.asset.data = rgbaData;

  console.log(this.asset);

  onLoad(this.url, this.asset);
};

EZ3.TGARequest.prototype.send = function(onLoad, onError) {
  var that = this;
  var requests = new EZ3.RequestManager();

  requests.addFileRequest(this.url, this.crossOrigin, 'arraybuffer');

  requests.onComplete.add(function(assets, failed) {
    if (failed)
      return onError(that.url, true);

    that._parse(assets.get(that.url).data, onLoad);
  });

  requests.send();
};
