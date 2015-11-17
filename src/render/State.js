/**
 * @class State
 */

EZ3.State = function() {
  this.programs = {};
  this.currentProgram = null;

  this.texture = {};
  this.maxTextureSlots = 0;
  this.usedTextureSlots = 0;
  this.currentTextureSlot = null;

  this.attribute = {};

  this.depthTest = false;
  this.faceCulling = false;
  this.backFaceCulling = false;
  this.frontFaceCulling = false;
  this.activeShadowReceiver = false;
};

EZ3.State.prototype.constructor = EZ3.State;
