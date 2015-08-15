EZ3.Renderer = function(canvas, options) {
  var that = this;

  this.canvas = canvas;
  this.context = null;

  function _init() {
    try {
      that.context = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
      console.log('ok');
    } catch (e) {
      throw new Error('WebGl not supported');
    }
  }

  _init();
};
