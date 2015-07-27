EZ3.Engine = function(canvas, options) {
  this.canvas = canvas || document.createElement('canvas');
  this.canvas.width = canvas.width || 800;
  this.canvas.height = canvas.height || 600;
  try {
    this.gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch(e) {
    throw new Error('WebGl not supported');
  }
  this.setViewport(0, 0, this.canvas.width, this.canvas.height);
};

EZ3.Engine.prototype.setViewport = function(x, y, width, height) {
  this.gl.viewport(x, y, width, height);
};
