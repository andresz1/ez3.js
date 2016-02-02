/**
 * @class EZ3.SpotLight
 * @extends EZ3.Light
 * @extends EZ3.OrthographicCamera
 * @constructor
 */
EZ3.SpotLight = function() {
  EZ3.Light.call(this);
  EZ3.PerspectiveCamera.call(this, 60.0, 1.0, 1.0, 4000.0);

  /**
   * @property {Number} cutoff
   * @default 0.9
   */
  this.cutoff = 0.9;
  /**
   * @property {EZ3.DepthCubeFramebuffer} depthFramebuffer
   * @default new EZ3.DepthCubeFramebuffer(new EZ3.Vector2(512, 512))
   */
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.SpotLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

/**
 * @method EZ3.SpotLight#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 * @param {EZ3.GLSLProgram} program
 * @param {Number} i
 * @param {Boolean} shadowReceiver
 * @param {Number} length
 */
EZ3.SpotLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = this.getWorldDirection();
  var viewProjection;
  var shadow;
  var bias;

  if(!direction.isZeroVector())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
  program.loadUniformFloat(gl, prefix + 'direction', direction);
  program.loadUniformFloat(gl, prefix + 'cutoff', this.cutoff);

  if(shadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uSpotShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};
