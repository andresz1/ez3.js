/**
 * @class RendererState
 */

EZ3.RendererState = function() {
  this.enabled = {};
  this.enabledValue = {};
  this.program = {};
  this.extension = {};
  this.attribute = {};
};

EZ3.RendererState.prototype.constructor = EZ3.RendererState;

EZ3.RendererState.CULL_FACE = 0;
EZ3.RendererState.BLENDING = 1;
EZ3.RendererState.DEPTH_TEST = 2;
EZ3.RendererState.BLEND_EQUATION = 3;
EZ3.RendererState.BLEND_FUNCTION = 4;
