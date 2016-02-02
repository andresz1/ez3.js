/**
 * @class EZ3.Image
 * @extends EZ3.File
 * @constructor
 * @param {Number} [width]
 * @param {Number} [height]
 * @param {Number} [format]
 * @param {Number[]} [data]
 */
EZ3.Image = function(width, height, format, data) {
  EZ3.File.call(this, data);

  /**
   * @property {Number} width
   * @default 0
   */
  this.width = (width !== undefined)? width : 0;
  /**
   * @property {Number} height
   * @default 0
   */
  this.height = (height !== undefined)? height : 0;
  /**
   * @property {Number} format
   * @default EZ3.Image.RGBA
   */
  this.format = (format !== undefined)? format : EZ3.Image.RGBA;
};

EZ3.Image.prototype = Object.create(EZ3.File.prototype);
EZ3.Image.prototype.constructor = EZ3.Image;

/**
 * @method EZ3.Image#getGLFormat
 * @param {WebGLContext} gl
 * @return {Number}
 */
EZ3.Image.prototype.getGLFormat = function(gl) {
  if (this.format === EZ3.Image.RGB_FORMAT)
    return gl.RGB;
  else
    return gl.RGBA;
};

/**
 * @method EZ3.Image#getCanvas
 * @return {HTMLElement}
 */
EZ3.Image.prototype.getCanvas = function() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var image = context.createImageData(this.width, this.height);

  canvas.width = this.width;
  canvas.height = this.height;

  image.data.set(new Uint8ClampedArray(this.data));

  context.putImageData(image, 0, 0);

  return canvas;
};

/**
 * @method EZ3.Image#toPowerOfTwo
 * @return {EZ3.Image}
 */
EZ3.Image.prototype.toPowerOfTwo = function() {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = EZ3.Math.nextHighestPowerOfTwo(this.width);
  canvas.height = EZ3.Math.nextHighestPowerOfTwo(this.height);
  context.drawImage(this.getCanvas(), 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

  this.width = canvas.width;
  this.height = canvas.height;
  this.data = new Uint8Array(context.getImageData(0, 0, canvas.width, canvas.height).data);

  return this;
};

/**
 * @method EZ3.Image#download
 */
EZ3.Image.prototype.download = function() {
  var a = document.createElement('a');

  a.href = this.getCanvas().toDataURL();
  a.download = 'output.png';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * @property {Number} RGB_FORMAT
 * @memberof EZ3.Image
 * @static
 * @final
 */
EZ3.Image.RGB_FORMAT = 1;
/**
 * @property {Number} RGBA_FORMAT
 * @memberof EZ3.Image
 * @static
 * @final
 */
EZ3.Image.RGBA_FORMAT = 2;
