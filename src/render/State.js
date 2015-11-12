/**
 * @class State
 */

EZ3.State = function() {
  this.programs = {};
  this.texture = {};
  this.attribute = {};
  this.currentTextureSlot = null;

  this.depthTest = false;
  this.faceCulling = false;
  this.backFaceCulling = false;
  this.frontFaceCulling = false;
};

EZ3.State.prototype.constructor = EZ3.State;
