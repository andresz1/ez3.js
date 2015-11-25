/**
 * @class SpotLight
 * @extends Light
 * @extends OrthographicCamera
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);
  EZ3.OrthographicCamera.call(this, -60.0, 60.0, 60.0, -60.0, 0.01, 2000.0);

  this.cutoff = 0.9;
  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.SpotLight.prototype, EZ3.OrthographicCamera.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target);
  var viewProjection;
  var shadow;
  var bias;

  if(!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
  program.loadUniformFloat(gl, prefix + 'direction', direction);
  program.loadUniformFloat(gl, prefix + 'cutoff', this.cutoff);

  if(state.activeShadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);

    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);

    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state);

    if(state.maxSpotLights === 1)
      program.loadUniformInteger(gl, 'uSpotShadowSampler[0]', state.usedTextureSlots++);
    else {
      state.textureArraySlots.push(state.usedTextureSlots++);

      if(i === state.maxSpotLights - 1) {
        program.loadUniformSamplerArray(gl, 'uSpotShadowSampler[0]', state.textureArraySlots);
        state.textureArraySlots = [];
      }
    }
  }
};
