/**
 * @class PointLight
 * @extends Light
 * @extends PerspectiveCamera
 */

EZ3.PointLight = function() {
  EZ3.Light.call(this);
  EZ3.PerspectiveCamera.call(this, 90.0, 1.0, 1.0, 5000.0);

  this.depthFramebuffer = new EZ3.DepthCubeFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.PointLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

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
