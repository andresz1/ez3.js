/**
 * @class Image
 * @extends File
 */

EZ3.Image = function(width, height, format, data) {
  EZ3.File.call(this, data);

  this.width = width || 0;
  this.height = height || 0;
  this.format = format || EZ3.Image.RGBA;
};

EZ3.Image.prototype = Object.create(EZ3.File.prototype);
EZ3.Image.prototype.constructor = EZ3.Image;

EZ3.Image.prototype.getGLFormat = function(gl) {
  if (this.format === EZ3.Image.RGB)
    return gl.RGB;
  else
    return gl.RGBA;
};

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

EZ3.Image.prototype.download = function() {
  var a = document.createElement('a');

  a.href = this.getCanvas().toDataURL();
  a.download = 'output.png';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

EZ3.Image.RGB = 'RGB';
EZ3.Image.RGBA = 'RGBA';

EZ3.Image.RGB_FORMAT = 1;
EZ3.Image.RGBA_FORMAT = 2;
