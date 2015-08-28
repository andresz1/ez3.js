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

EZ3.Renderer.prototype._createTexture = function(material) {
    var gl = this.context;
    material.diffuseTexture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, material.diffuseMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
};

EZ3.Renderer.prototype._updateMatrices = function(entity) {

  var position = vec3.create();
  vec3.set(position, 20, 20, 20);

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

EZ3.Renderer.prototype._updateMaterial = function(material) {
  if (material.dirty) {
    var program;
    this._builder.build(material);
    program = new EZ3.GLSLProgram(this.context, material, 1);
    material.program = program;
    material.dirty = false;
  }
};

EZ3.Renderer.prototype._setupBasic = function(material) {
  var gl = this.context;

  if(material.diffuseMap && !material.diffuseTexture)
    this._createTexture(material);

  var color = vec3.create();
  vec3.copy(color, material.color);
  material.program.loadUniformf('color', EZ3.GLSLProgram.UNIFORM_SIZE_3D, color);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  material.program.loadUniformi('hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    material.program.loadUniformi('diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupBlinnPhong = function(material) {
  var gl = this.context;

  if(material.textureMap && !material.diffuseTexture)
    this._createTexture(material.diffuseTexture, material.diffuseMap);

  var ambient = vec3.create();
  vec3.copy(ambient, material.ambient);
  material.program.loadUniformf('ambient', EZ3.GLSLProgram.UNIFORM_SIZE_3D, ambient);

  var diffuse = vec3.create();
  vec3.copy(diffuse, material.diffuse);
  material.program.loadUniformf('diffuse', EZ3.GLSLProgram.UNIFORM_SIZE_3D, diffuse);

  var specular = vec3.create();
  vec3.copy(specular, material.specular);
  material.program.loadUniformf('specular', EZ3.GLSLProgram.UNIFORM_SIZE_3D, specular);

  var shininess = material.shininess;
  material.program.loadUniformf('shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, shininess);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  material.program.loadUniformi('hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture){
    gl.activeTexture(gl.TEXTURE_0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    material.program.loadUniformi('diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupFlat = function(material) {
  var gl = this.context;

  if(material.textureMap && !material.diffuseTexture)
    this._createTexture(material.diffuseTexture, material.diffuseMap);

  var ambient = vec3.create();
  vec3.copy(ambient, material.ambient);
  material.program.loadUniformf('ambient', EZ3.GLSLProgram.UNIFORM_SIZE_3D, ambient);

  var diffuse = vec3.create();
  vec3.copy(diffuse, material.diffuse);
  material.program.loadUniformf('diffuse', EZ3.GLSLProgram.UNIFORM_SIZE_3D, diffuse);

  var specular = vec3.create();
  vec3.copy(specular, material.specular);
  material.program.loadUniformf('specular', EZ3.GLSLProgram.UNIFORM_SIZE_3D, specular);

  var shininess = material.shininess;
  material.program.loadUniformf('shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, shininess);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  material.program.loadUniformi('hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture){
    gl.activeTexture(gl.TEXTURE_0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    material.program.loadUniformi('diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupGouraud = function(material) {
  var gl = this.context;

  if(material.textureMap && !material.diffuseTexture)
    this._createTexture(material.diffuseTexture, material.diffuseMap);

  var ambient = vec3.create();
  vec3.copy(ambient, material.ambient);
  material.program.loadUniformf('ambient', EZ3.GLSLProgram.UNIFORM_SIZE_3D, ambient);

  var diffuse = vec3.create();
  vec3.copy(diffuse, material.diffuse);
  material.program.loadUniformf('diffuse', EZ3.GLSLProgram.UNIFORM_SIZE_3D, diffuse);

  var specular = vec3.create();
  vec3.copy(specular, material.specular);
  material.program.loadUniformf('specular', EZ3.GLSLProgram.UNIFORM_SIZE_3D, specular);

  var shininess = material.shininess;
  material.program.loadUniformf('shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, shininess);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  material.program.loadUniformi('hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture){
    gl.activeTexture(gl.TEXTURE_0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    material.program.loadUniformi('diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupMultiTexturing = function(material) {
  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);
};

EZ3.Renderer.prototype._setupNormalMapping = function(material) {
  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);
};

EZ3.Renderer.prototype._setupParallaxMapping = function(material) {
  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);
};

EZ3.Renderer.prototype._setupPhong = function(material) {
  var gl = this.context;

  if(material.textureMap && !material.diffuseTexture)
    this._createTexture(material.diffuseTexture, material.diffuseMap);

  var ambient = vec3.create();
  vec3.copy(ambient, material.ambient);
  material.program.loadUniformf('ambient', EZ3.GLSLProgram.UNIFORM_SIZE_3D, ambient);

  var diffuse = vec3.create();
  vec3.copy(diffuse, material.diffuse);
  material.program.loadUniformf('diffuse', EZ3.GLSLProgram.UNIFORM_SIZE_3D, diffuse);

  var specular = vec3.create();
  vec3.copy(specular, material.specular);
  material.program.loadUniformf('specular', EZ3.GLSLProgram.UNIFORM_SIZE_3D, specular);

  var shininess = material.shininess;
  material.program.loadUniformf('shininess', EZ3.GLSLProgram.UNIFORM_SIZE_1D, shininess);

  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);

  var hasDiffuseTexture = (material.diffuseTexture) ? true : false;
  material.program.loadUniformi('hasDiffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, hasDiffuseTexture);

  if(hasDiffuseTexture){
    gl.activeTexture(gl.TEXTURE_0);
    gl.bindTexture(gl.TEXTURE_2D, material.diffuseTexture);
    material.program.loadUniformi('diffuseTexture', EZ3.GLSLProgram.UNIFORM_SIZE_1D, 0);
  }
};

EZ3.Renderer.prototype._setupReflection = function(material) {
  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);
};

EZ3.Renderer.prototype._setupRefraction = function(material) {
  var mvpMatrix = mat4.create();
  mat4.copy(mvpMatrix, this._mvpMatrix);
  material.program.loadUniformMatrix('mvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvpMatrix);
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
  var entity;
  var gl = this.context;

  gl.viewport(screen.position[0], screen.position[1], screen.size[0], screen.size[1]);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  screen.scene.update();
  this._entities.push(screen.scene);

  while (this._entities.length) {

    entity = this._entities.pop();

    if (entity instanceof EZ3.Mesh) {

      entity.init(gl);

      this._updateMatrices(entity);
      this._updateMaterial(entity.material);

      entity.material.program.enable();

      if (entity.material instanceof EZ3.BasicMaterial)
        this._setupBasic(entity.material);
      else if (entity.material instanceof EZ3.BlinnPhongMaterial)
        this._setupBlinnPhong(entity.material);
      else if (entity.material instanceof EZ3.FlatMaterial)
        this._setupFlat(entity.material);
      else if (entity.material instanceof EZ3.GouraudMaterial)
        this._setupGouraud(entity.material);
      else if (entity.material instanceof EZ3.MultiTexturingMaterial)
        this._setupMultiTexturing(entity.material);
      else if (entity.material instanceof EZ3.NormalMappingMaterial)
        this._setupNormalMapping(entity.material);
      else if (entity.material instanceof EZ3.ParallaxMappingMaterial)
        this._setupParallax(entity.material, modelMatrix);
      else if (entity.material instanceof EZ3.PhongMaterial)
        this._setupPhong(entity.material);
      else if (entity.material instanceof EZ3.ReflectionMaterial)
        this._setupReflection(entity.material);
      else if (entity.material instanceof EZ3.RefractionMaterial)
        this._setupRefraction(entity.material);

      entity.render(gl);

      entity.material.program.disable();
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
