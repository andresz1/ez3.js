/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);

  this._camera = null;
  this.target = new EZ3.Vector3();
  this.depthFramebuffer = new EZ3.DepthFramebuffer(new EZ3.Vector2(512, 512));
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target);

  if(!direction.testZero())
    direction.normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'direction', direction);
};

Object.defineProperty(EZ3.DirectionalLight.prototype, 'view', {
  get: function() {
    if (!this._camera) {
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));
    } else {
      this._camera.target = this.target.clone();
      this._camera.position = this.position.clone();
    }
    return this._camera.view;
  }
});

Object.defineProperty(EZ3.DirectionalLight.prototype, 'projection', {
  get: function() {
    if(!this._camera)
      this._camera = new EZ3.TargetCamera(this.position, this.target, new EZ3.Vector3(0, 1, 0));

    return this._camera.projection;
  }
});
