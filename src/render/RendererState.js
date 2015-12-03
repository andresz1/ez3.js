/**
 * @class State
 */

EZ3.State = function() {
  this.programs = {};
  this.currentProgram = null;

  this.texture = {};
  this.maxTextureSlots = 0;
  this.usedTextureSlots = 0;
  this.textureArraySlots = [];
  this.currentTextureSlot = null;

  this.attribute = {};

  this.hasLights = false;
  this.maxSpotLights = 0;
  this.maxPointLights = 0;
  this.maxDirectionalLights = 0;

  this.depthTest = false;
  this.faceCulling = EZ3.Material.NONE;
  this.activeShadowReceiver = false;
};

EZ3.State.prototype.constructor = EZ3.State;
