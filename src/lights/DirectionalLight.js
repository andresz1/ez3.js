/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);

  this._camera = new EZ3.TargetCamera();

  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var shadowSampler = 'uDirectionalShadowSampler[' + i + ']';
  var direction = new EZ3.Vector3().sub(this.position, this.target);
  var viewProjection;
  var shadow;
  var bias;

  if (!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);

  if (state.activeShadowReceiver) {
    bias = new EZ3.Matrix4();
    bias.translate(new EZ3.Vector3(0.5));
    bias.scale(new EZ3.Vector3(0.5));

    viewProjection = new EZ3.Matrix4();
    viewProjection.mul(this.projection, this.view);

    shadow = new EZ3.Matrix4();
    shadow.mul(bias, viewProjection);
    program.loadUniformMatrix(gl, prefix + 'shadow', shadow);

    this.depthFramebuffer.texture.bind(gl, state);
    program.loadUniformInteger(gl, shadowSampler, state.usedTextureSlots++);

    program.loadUniformFloat(gl, prefix + 'shadowBias', this.shadowBias);

    if(this.shadowDarkness < 0.0)
      this.shadowDarkness = 0.0;

    program.loadUniformFloat(gl, prefix + 'shadowDarkness', this.shadowDarkness);
  }
};

Object.defineProperty(EZ3.DirectionalLight.prototype, 'view', {
  get: function() {
    this._camera.target = this.target.clone();
    this._camera.position = this.position.clone();
    return this._camera.view;
  }
});

Object.defineProperty(EZ3.DirectionalLight.prototype, 'projection', {
  get: function() {
    return this._camera.projection;
  }
});
