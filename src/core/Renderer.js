/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._lights = [];
  this._entities = [];
  this._programs = [];
  this.context = null;
  this.canvas = canvas;
  this.options = options;
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

EZ3.Renderer.prototype.updateMaterial = function(material) {
  if(material.dirty){

    var shaders = EZ3.ShaderLib[material.name];

    if(shaders) {
      material.vertex = shaders.vertex;
      material.fragment = shaders.fragment;

      var program = new EZ3.Program(this.context, material, 1);
      material.program = program;
    }

    material.dirty = false;
  }
};

EZ3.Renderer.prototype.setupBasic = function(material) {
  var mvp = mat4.create();
  var view = mat4.create();
  var projection = mat4.create();

  var position = vec3.create();
  vec3.set(position, 50, 50, 50);

  var target = vec3.create();
  vec3.set(target, 0, 0, 0);

  var up = vec3.create();
  vec3.set(up, 0, 1, 0);

  mat4.lookAt(view, position, target, up);
  mat4.perspective(projection, 70, 800 / 600, 1, 1000);
  mat4.multiply(mvp, projection, view);

  material.program.loadUniformf(this.context, 'color', EZ3.Program.UNIFORM_SIZE_3D, material.color);
  material.program.loadUniformMatrix(this.context, 'modelViewProjectionMatrix', EZ3.Program.UNIFORM_SIZE_4X4, mvp);
};

EZ3.Renderer.prototype.render = function(screen) {
  this.context.clearColor(0.0,0.0,0.0,1.0);
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  screen.scene.update();
  this._entities.push(screen.scene);

  while(this._entities.length) {
    var entity = this._entities.pop();

    if(entity instanceof EZ3.Mesh) {
        entity.init(this.context);
        this.updateMaterial(entity.material);

        entity.material.program.enable(this.context);

          if(entity.material instanceof EZ3.BasicMaterial)
            this.setupBasic(entity.material);

          entity.render(this.context);

        entity.material.program.disable(this.context);
    }

    for(var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
