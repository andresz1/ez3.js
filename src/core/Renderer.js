/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this.canvas = canvas;
  this.options = options;
  this.context = null;
  this.renderStack = new EZ3.Stack();
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype.initContext = function() {
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];

  for (var i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options. Your browser may not support it.');

  var that = this;

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);

  if (this._onContextRestored) {
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    delete this._onContextRestored;
  }
};

EZ3.Renderer.prototype.displaySceneGraph = function(mesh) {
  if(mesh instanceof EZ3.Entity) {
    this.renderStack.push(mesh);

    while(!this.renderStack.isEmpty()) {
      var actualMesh = this.renderStack.top();
      this.renderStack.pop();

      if(actualMesh instanceof EZ3.Mesh) {
          actualMesh.init(this.context);
          actualMesh.draw(this.context);
      }

      for(var k = actualMesh.children.length - 1; k >= 0; --k)
        this.renderStack.push(actualMesh.children[k]);
    }
  }
};

EZ3.Renderer.prototype.render = function(screen) {
  this.context.clearColor(0.0,0.0,0.0,1.0);
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  screen.scene.update();
  this.displaySceneGraph(screen.scene);
};
