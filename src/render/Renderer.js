/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._entities = [];
  this._programs = [];
  this._builder = new EZ3.ShaderBuilder();

  this._mvMatrix = mat4.create();
  this._mvpMatrix = mat4.create();
  this._viewMatrix = mat4.create();
  this._modelMatrix = mat4.create();
  this._normalMatrix = mat3.create();
  this._projectionMatrix = mat4.create();

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

EZ3.Renderer.prototype._createTexture = function(map) {
    var gl;
    var texture;

    texture = null;
    gl = this.context;

    texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, map);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
};

EZ3.Renderer.prototype._updateMatrices = function(entity) {
  var position = vec3.create();
  vec3.set(position, 45, 45, 45);

  var target = vec3.create();
  vec3.set(target, 0, 0, 0);

  var up = vec3.create();
  vec3.set(up, 0, 1, 0);

  mat4.lookAt(this._viewMatrix, position, target, up);
  mat4.perspective(this._projectionMatrix, 70, 800 / 600, 1, 1000);

  mat4.copy(this._modelMatrix, entity.worldMatrix);
  mat4.copy(this._normalMatrix, entity.normalMatrix);
  mat4.multiply(this._mvMatrix, this._viewMatrix, this._modelMatrix);
  mat4.multiply(this._mvpMatrix, this._projectionMatrix, this._mvMatrix);
};

EZ3.Renderer.prototype._setupBasic = function(material) {
  var gl = this.context;
  var program = material.program;

  if(material.diffuseMap && !material.diffuseTexture)
    material.diffuseTexture = this._createTexture(material.diffuseMap);

  var color = vec3.create();
  vec3.copy(color, material.color);
  program.loadUniformf(gl, 'color', EZ3.GLSLProgram.UNIFORM_SIZE_3D, color);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  program.loadUniformMatrix(gl, 'mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  program.loadUniformi(gl, 'hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    program.loadUniformi(gl, 'diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupBlinnPhong = function(material) {

};

EZ3.Renderer.prototype._setupCookTorrance = function(material) {

};

EZ3.Renderer.prototype._setupFlat = function(material) {

};

EZ3.Renderer.prototype._setupGouraud = function(material) {

};

EZ3.Renderer.prototype._setupMultiTexturing = function(material) {

};

EZ3.Renderer.prototype._setupNormalMapping = function(material) {

};

EZ3.Renderer.prototype._setupOrenNayar = function(material) {

};

EZ3.Renderer.prototype._setupParallaxMapping = function(material) {

};

EZ3.Renderer.prototype._setupPhong = function(material) {

};

EZ3.Renderer.prototype._setupReflection = function(material) {

};

EZ3.Renderer.prototype._setupRefraction = function(material) {

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

EZ3.Renderer.prototype.clear = function() {
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  this.context.enable(this.context.DEPTH_TEST);
  this.context.depthFunc(this.context.LEQUAL);

  this.context.enable(this.context.CULL_FACE);
  this.context.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var gl = this.context;
  var entity;
  var program;
  var material;

  gl.viewport(screen.position[0], screen.position[1], screen.size[0], screen.size[1]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  screen.scene.update();
  this._entities.push(screen.scene);

  while (this._entities.length) {

    entity = this._entities.pop();

    if (entity instanceof EZ3.Mesh) {

      entity.setup(gl);
      this._updateMatrices(entity);

      material = entity.material;
      program = material.program;

      program.enable(gl);

      if (material instanceof EZ3.BasicMaterial)
        this._setupBasic(material);
      else if (material instanceof EZ3.BlinnPhongMaterial)
        this._setupBlinnPhong(material);
      else if(material instanceof EZ3.CookTorranceMaterial)
        this._setupCookTorrance(material);
      else if (material instanceof EZ3.FlatMaterial)
        this._setupFlat(material);
      else if (material instanceof EZ3.GouraudMaterial)
        this._setupGouraud(material);
      else if (material instanceof EZ3.MultiTexturingMaterial)
        this._setupMultiTexturing(material);
      else if (material instanceof EZ3.NormalMappingMaterial)
        this._setupNormalMapping(material);
      else if(material instanceof EZ3.OrenNayarMaterial)
        this._setupOrenNayar(material);
      else if (material instanceof EZ3.ParallaxMappingMaterial)
        this._setupParallax(material);
      else if (material instanceof EZ3.PhongMaterial)
        this._setupPhong(material);
      else if (material instanceof EZ3.ReflectionMaterial)
        this._setupReflection(material);
      else if (material instanceof EZ3.RefractionMaterial)
        this._setupRefraction(material);

      entity.render(gl);

      program.disable(gl);
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
