/**
 * @class DirectionalLight
 * @extends Light
 * @extends OrthographicCamera
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);
  EZ3.OrthographicCamera.call(this, -60.0, 60.0, 60.0, -60.0, 0.01, 2000.0);

  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.DirectionalLight.prototype, EZ3.OrthographicCamera.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = this.worldDirection();
  var viewProjection;
  var shadow;
  var bias;

  if (!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);

  if (state.activeShadowReceiver) {
    bias = new EZ3.Matrix4().translate(new EZ3.Vector3(0.5)).scale(new EZ3.Vector3(0.5));
    viewProjection = new EZ3.Matrix4().mul(this.projection, this.view);
    shadow = new EZ3.Matrix4().mul(bias, viewProjection);

    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);

    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);

    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);

    this.depthFramebuffer.texture.bind(gl, state);

    state.textureArraySlots.push(state.usedTextureSlots++);

    if(i === state.maxDirectionalLights - 1) {
      program.loadUniformSamplerArray(gl, 'uDirectionalShadowSampler[0]', state.textureArraySlots);
      state.textureArraySlots = [];
    }
  }
};
