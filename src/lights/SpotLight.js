/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);

  this.cutoff = 0.8;
  this._camera = null;
  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uSpotLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target);

  if(!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
  program.loadUniformFloat(gl, prefix + 'direction', direction);
  program.loadUniformFloat(gl, prefix + 'cutoff', this.cutoff);

  this.depthFramebuffer.texture.bind(gl, state, 4);
  program.loadUniformInteger(gl, 'shadowSampler', 4);
};

Object.defineProperty(EZ3.SpotLight.prototype, 'view', {
  get: function() {
    if (!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));
    else {
      this._camera.target = this.target.clone();
      this._camera.position = this.position.clone();
    }
    return this._camera.view;
  }
});

Object.defineProperty(EZ3.SpotLight.prototype, 'projection', {
  get: function() {
    if(!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));

    return this._camera.projection;
  }
});
