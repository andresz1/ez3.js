/**
 * @class PointLight
 * @extends Light
 * @extends PerspectiveCamera
 */

EZ3.PointLight = function() {
  EZ3.PerspectiveCamera.call(this, 50.0, 1.0, 0.1, 2000.0);
  EZ3.Light.call(this);
};

EZ3.PointLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.extends(EZ3.PointLight.prototype, EZ3.PerspectiveCamera.prototype);
EZ3.PointLight.prototype.constructor = EZ3.PointLight;

EZ3.PointLight.prototype.updateUniforms = function(gl, state, program, i) {
  var prefix = 'uPointLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformFloat(gl, prefix + 'position', this.position);
};
