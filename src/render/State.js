/**
 * @class State
 */

EZ3.State = function() {
  this.program = {};
  this.texture = {};
  this.attribute = {};
  this.capability = {};
  this.currentTextureSlot = null;
};

EZ3.State.prototype.constructor = EZ3.State;

EZ3.State.FACE_CULLING = 0;
EZ3.State.BACKFACE_CULLING = 1;
EZ3.State.FRONTFACE_CULLING = 2;
EZ3.State.BLENDING = 3;
EZ3.State.DEPTH_TEST = 4;
