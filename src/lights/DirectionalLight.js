/**
 * @class EZ3.DirectionalLight
 * @extends EZ3.Light
 * @extends EZ3.OrthographicCamera
 * @constructor
 */
EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);
  EZ3.OrthographicCamera.call(this, -500.0, 500.0, 500.0, -500.0, 1.0, 5000.0);

  /**
   * @property {EZ3.DepthFramebuffer} depthFramebuffer
   * @default new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512))
   */
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.DirectionalLight.prototype, EZ3.OrthographicCamera.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

/**
 * @method EZ3.DirectionalLight#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 * @param {EZ3.GLSLProgram} program
 * @param {Number} i
 * @param {Boolean} shadowReceiver
 * @param {Number} length
 */
EZ3.DirectionalLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = this.getWorldDirection().normalize();
  var viewProjection;
  var shadow;
  var bias;

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);

  if (shadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uDirectionalShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};
