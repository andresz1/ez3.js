/**
 * @class EZ3.PointLight
 * @extends EZ3.Light
 * @extends EZ3.CubeCamera
 * @constructor
 */
EZ3.PointLight = function() {
  EZ3.Light.call(this);
  EZ3.CubeCamera.call(this);

  /**
   * @property {EZ3.DepthCubeFramebuffer} depthFramebuffer
   * @default new EZ3.DepthCubeFramebuffer(new EZ3.Vector2(512, 512))
   */
  this.depthFramebuffer = new EZ3.DepthCubeFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.PointLight.prototype, EZ3.CubeCamera.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

/**
 * @method EZ3.PointLight#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 * @param {EZ3.RendererCapabilities} capabilities
 * @param {EZ3.GLSLProgram} program
 * @param {Number} i
 * @param {Boolean} shadowReceiver
 * @param {Number} length
 */
EZ3.PointLight.prototype.updateUniforms = function(gl, state, capabilities, program, i, shadowReceiver, length) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);

  if(shadowReceiver) {
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);
    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state, capabilities);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === length - 1) {
      program.loadUniformSamplerArray(gl, 'uPointShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};
