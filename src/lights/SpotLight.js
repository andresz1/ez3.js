/**
 * @class SpotLight
 * @extends Light
 */

EZ3.SpotLight = function() {
  EZ3.Light.call(this);
};

EZ3.SpotLight.prototype = Object.create(EZ3.Light.prototype);
EZ3.SpotLight.prototype.constructor = EZ3.SpotLight;

EZ3.SpotLight.prototype.updateUniforms = function(gl, program, i) {
  var prefix = 'uSpotLights[' + i + '].';

  EZ3.Light.prototype.updateUniforms.call(this, gl, program, prefix);
};
