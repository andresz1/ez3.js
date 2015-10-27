/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);

  this.target = new EZ3.Vector3();
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';
  var direction = new EZ3.Vector3().sub(this.position, this.target).normalize();

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);

  program.loadUniformf(gl, prefix + 'direction', 3, direction);
};
