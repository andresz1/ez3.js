/**
 * @class RendererState
 */

EZ3.RendererState = function(gl) {
  this.gl = gl;
  this.program = {};
  this.extension = {};
  this.capability = {};
  this.attribute = {};

  this._init();
};

EZ3.RendererState.prototype.constructor = EZ3.RendererState;

EZ3.RendererState.prototype._init = function() {
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
};

EZ3.RendererState.prototype.enable = function(id) {
  if(!this.capability[name]) {
    this.capability[name] = true;
    this.gl.enable(id);
  }
};

EZ3.RendererState.prototype.disable = function(id) {
  if(this.capability[name]) {
    this.capability[name] = false;
    this.gl.disable(id);
  }
};

EZ3.RendererState.prototype.enableAttribute = function(attribute) {
  if(!this.attribute[attribute]) {
    this.attribute[attribute] = true;
    this.gl.enableVertexAttribArray(attribute);
  }
};

EZ3.RendererState.prototype.disableAttribute = function(attribute) {
  if(this.attribute[attribute]) {
    this.attribute[attribute] = false;
    this.gl.disableVertexAttribArray(attribute);
  }
};

EZ3.RendererState.prototype.activeTexture = function(unit) {

};

EZ3.RendererState.prototype.bindTexture = function(target, id) {

};

EZ3.RendererState.prototype.setBlending = function(mode) {

};

EZ3.NO_BLENDING = 0;
EZ3.ADDITIVE_BLENDING = 1;
EZ3.SUBSTRACTIVE_BLENDING = 2;
EZ3
