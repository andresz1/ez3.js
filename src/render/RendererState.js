/**
 * @class RendererState
 */

EZ3.RendererState = function(gl) {
  this.program = {};
  this.texture = {};
  this.extension = {};
  this.attribute = {};
  this.capability = {};
  this.currentTextureSlot = null;

  this._initCapabilities();
  this._initExtensions(gl);
};

EZ3.RendererState.prototype.constructor = EZ3.RendererState;

EZ3.RendererState.prototype._initCapabilities = function() {
  this.capability[EZ3.RendererState.DEPTH_TEST] = {
    enabled: false,
    value: null
  };
  this.capability[EZ3.RendererState.CULL_FACE] = {
    enabled: false,
    value: null
  };
  this.capability[EZ3.RendererState.BLENDING] = {
    enabled: false,
    blendEquation: null,
    blendFunc: {
      sfactor: null,
      dfactor: null
    }
  };
};

EZ3.RendererState.prototype._initExtensions = function(gl) {
  this.extension['OES_standard_derivatives'] = gl.getExtension('OES_standard_derivatives');
  this.extension['OES_vertex_array_object'] = gl.getExtension('OES_vertex_array_object');
  this.extension['OES_element_index_uint'] = gl.getExtension('OES_element_index_uint');
};

EZ3.RendererState.CULL_FACE = 0;
EZ3.RendererState.BLENDING = 1;
EZ3.RendererState.DEPTH_TEST = 2;
