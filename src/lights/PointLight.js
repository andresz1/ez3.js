/**
 * @class PointLight
 * @extends Light
 * @extends PerspectiveCamera
 */

EZ3.PointLight = function() {
  EZ3.PerspectiveCamera.call(this, 70.0, 1.0, 0.01, 5000.0);
  EZ3.Light.call(this);

  this.depthFramebuffer = new EZ3.CubeDepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.PointLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

EZ3.PointLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);

  if(state.activeShadowReceiver) {
    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);

    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === state.maxSpotLights - 1) {
      program.loadUniformSamplerArray(gl, 'uPointShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};
