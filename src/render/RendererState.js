/**
 * @class RendererState
 */

EZ3.RendererState = function(context) {
  this._context = context;
  this._states = {};

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

  this.activeShadowReceiver = false;
};

EZ3.RendererState.prototype.constructor = EZ3.State;

EZ3.RendererState.prototype.enable = function(state) {
  var gl = this._context;

  if (!this._states[state]) {
    this._states[state] = true;

    gl.enable(state);
  }
};

EZ3.RendererState.prototype.disable = function(state) {
  var gl = this._context;

  if (this._states[state]) {
    this._states[state] = false;

    gl.disable(state);
  }
};

EZ3.RendererState.prototype.depthFunc = function(func) {
  var gl = this._context;

  if (this._depthFunc !== func) {
    this._depthFunc = func;

    gl.depthFunc(func);
  }
};

EZ3.RendererState.prototype.cullFace = function(face) {
  var gl = this._context;

  if (this._cullFace !== face) {
    this._cullFace = face;

    gl.cullFace(face);
  }
};

EZ3.RendererState.prototype.blendEquation = function(modeRGB, modeAlpha) {
  var gl = this._context;
  var changed = false;

  modeAlpha = (modeAlpha !== undefined) ? modeAlpha : modeRGB;

  if (this._modeRGB !== modeRGB) {
    this._modeRGB = modeRGB;
    changed = true;
  }

  if (this._modeAlpha !== modeAlpha) {
    this._modeAlpha = modeAlpha;
    changed = true;
  }

  if (changed)
    gl.blendEquationSeparate(modeRGB, modeAlpha);
};

EZ3.RendererState.prototype.blendFunc = function(srcRGB, dstRGB, srcAlpha, dstAlpha) {
  var gl = this._context;
  var changed = false;

  srcAlpha = (srcAlpha !== undefined) ? srcAlpha : srcRGB;
  dstAlpha = (dstAlpha !== undefined) ? dstAlpha : dstRGB;

  if (this._srcRGB !== srcRGB) {
    this._srcRGB = srcRGB;
    changed = true;
  }

  if (this._dstRGB !== dstRGB) {
    this._dstRGB = dstRGB;
    changed = true;
  }

  if (this._srcAlpha !== srcAlpha) {
    this._srcAlpha = srcAlpha;
    changed = true;
  }

  if (this._dstAlpha !== dstAlpha) {
    this._dstAlpha = dstAlpha;
    changed = true;
  }

  if (changed)
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
};
