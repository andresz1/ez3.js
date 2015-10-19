/**
 * @class DirectionalLight
 * @extends Light
 */

EZ3.DirectionalLight = function() {
  EZ3.Light.call(this);
};

EZ3.DirectionalLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.DirectionalLight.prototype.constructor = EZ3.DirectionalLight;

EZ3.DirectionalLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uDirectionalLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);
};
