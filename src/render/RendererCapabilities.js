/**
 * @class EZ3.RendererCapabilities
 * @constructor
 * @param {WebGLContext} gl
 */
EZ3.RendererCapabilities = function(gl) {
  /**
   * @property {Number} maxTextureSlots
   */
  this.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) - 1;
};
