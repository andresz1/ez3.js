/**
 * @class EZ3.Light
 * @constructor
 */
EZ3.Light = function() {
  /**
   * @property {EZ3.Vector3} diffuse
   * @default new EZ3.Vector3(1.0, 1.0, 1.0)
   */
  this.diffuse = new EZ3.Vector3(1.0, 1.0, 1.0);
  /**
   * @property {EZ3.Vector3} specular
   * @default new EZ3.Vector3(1.0, 1.0, 1.0)
   */
  this.specular = new EZ3.Vector3(1.0, 1.0, 1.0);
  /**
   * @property {Number} shadowBias
   * @default 0.00005
   */
  this.shadowBias = 0.00005;
  /**
   * @property {Number} shadowDarkness
   * @default 0.2
   */
  this.shadowDarkness = 0.2;
};

EZ3.Light.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Light.prototype.constructor = EZ3.Light;

/**
 * @method EZ3.Light#updateUniforms
 * @param {WebGLContext} gl
 * @param {EZ3.GLSLProgram} program
 * @param {String} prefix
 */
EZ3.Light.prototype.updateUniforms = function(gl, program, prefix) {
  program.loadUniformFloat(gl, prefix + 'diffuse', this.diffuse);
  program.loadUniformFloat(gl, prefix + 'specular', this.specular);
};
