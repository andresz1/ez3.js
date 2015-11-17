/**
 * @class PointLight
 * @extends Light
 */

EZ3.PointLight = function() {
  EZ3.Light.call(this);
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

EZ3.PointLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);

  /*if(state.activeShadowReceiver) {
    this.depthFramebuffer.texture.bind(gl, state);
    program.loadUniformInteger(gl, 'uShadowSampler', state.usedTextureSlots++);
  }*/
};
