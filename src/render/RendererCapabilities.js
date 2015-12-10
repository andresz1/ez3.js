/**
 * @class RendererCapabilities
 */

EZ3.RendererCapabilities = function(gl) {
  this.maxTextureSlots = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) - 1;
};
