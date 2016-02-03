/**
 * @class EZ3.RendererState
 * @constructor
 * @param {WebGLContext} context
 */

EZ3.RendererState = function(context) {
  /**
   * @property {WebGLContext} _context
   * @private
   */
  this._context = context;
  /**
   * @property {Object} _states
   * @private
   */
  this._states = {};
  /**
   * @property {Object} _blendEquation
   * @private
   */
  this._blendEquation = {};
  /**
   * @property {Object} _blendFunc
   * @private
   */
  this._blendFunc = {};
  /**
   * @property {Object} _textureSlots
   * @private
   */
  this._textureSlots = {};
  /**
   * @property {Object} _attributeLayouts
   * @private
   */
  this._attributeLayouts = {};
  /**
   * @property {Object} _viewport
   * @private
   */
  this._viewport = {};
  /**
   * @property {GLSLProgram} _program
   * @private
   */
  this._program = null;
  /**
   * @property {Number} _cullFace
   * @private
   */
  this._cullFace = null;
  /**
   * @property {Number} _depthFunc
   * @private
   */
  this._depthFunc = null;
  /**
   * @property {Number} _textureSlot
   * @private
   */
  this._textureSlot = null;

  /**
   * @property {Object} programs
   */
  this.programs = {};
  /**
   * @property {Number} usedTextureSlots
   * @default 0
   */
  this.usedTextureSlots = 0;
  /**
   * @property {Number[]} textureArraySlots
   */
  this.textureArraySlots = [];
};

EZ3.RendererState.prototype.constructor = EZ3.State;

/**
 * @method EZ3.RendererState#enable
 * @param {Number} state
 */
EZ3.RendererState.prototype.enable = function(state) {
  var gl = this._context;

  if (!this._states[state]) {
    this._states[state] = true;

    gl.enable(state);
  }
};

/**
 * @method EZ3.RendererState#disable
 * @param {Number} state
 */
EZ3.RendererState.prototype.disable = function(state) {
  var gl = this._context;

  if (this._states[state]) {
    this._states[state] = false;

    gl.disable(state);
  }
};

/**
 * @method EZ3.RendererState#enableVertexAttribArray
 * @param {Number} layout
 */
EZ3.RendererState.prototype.enableVertexAttribArray = function(layout) {
  var gl = this._context;

  if (!this._attributeLayouts[layout]) {
    gl.enableVertexAttribArray(layout);
    this._attributeLayouts[layout] = true;
  }
};

/**
 * @method EZ3.RendererState#createProgram
 * @param {String} id
 * @param {String} vertex
 * @param {String} fragment
 * @param {String} [prefix]
 * @return {EZ3.GLSLProgram}
 */
EZ3.RendererState.prototype.createProgram = function(id, vertex, fragment, prefix) {
  var gl = this._context;

  if (!this.programs[id])
    this.programs[id] = new EZ3.GLSLProgram(gl, vertex, fragment, prefix);

  return this.programs[id];
};

/**
 * @method EZ3.RendererState#bindProgram
 * @param {EZ3.GLSLProgram} program
 */
EZ3.RendererState.prototype.bindProgram = function(program) {
  var gl = this._context;

  if (this._program !== program) {
    this._program = program;

    program.bind(gl);
  }
};

/**
 * @method EZ3.RendererState#bindTexture
 * @param {Number} target
 * @param {Number} id
 */
EZ3.RendererState.prototype.bindTexture = function(target, id) {
  var gl = this._context;
  var slot = gl.TEXTURE0 + this.usedTextureSlots;
  var changed;

  if (this._textureSlot !== slot) {
    gl.activeTexture(slot);
    this._textureSlot = slot;
  }

  if (!this._textureSlots[slot]) {
    this._textureSlots[slot] = {
      id: id,
      target: target
    };

    gl.bindTexture(target, id);
  } else {
    changed = false;

    if (this._textureSlots[slot].id !== id) {
      this._textureSlots[slot].id = id;
      changed = true;
    }

    if (this._textureSlots[slot].target !== target) {
      this._textureSlots[slot].target = target;
      changed = true;
    }

    if (changed)
      gl.bindTexture(target, id);
  }
};

/**
 * @method EZ3.RendererState#viewport
 * @param {EZ3.Vector2} position
 * @param {EZ3.Vector2} size
 */
EZ3.RendererState.prototype.viewport = function(position, size) {
  var gl = this._context;
  var changed = false;

  if (position.isDiff(this._viewport.position)) {
    this._viewport.position = position.clone();
    changed = true;
  }

  if (size.isDiff(this._viewport.size)) {
    this._viewport.size = size.clone();
    changed = true;
  }

  if (changed)
    gl.viewport(position.x, position.y, size.x, size.y);
};

/**
 * @method EZ3.RendererState#depthFunc
 * @param {Number} func
 */
EZ3.RendererState.prototype.depthFunc = function(func) {
  var gl = this._context;

  if (this._depthFunc !== func) {
    this._depthFunc = func;

    gl.depthFunc(func);
  }
};

/**
 * @method EZ3.RendererState#cullFace
 * @param {Number} face
 */
EZ3.RendererState.prototype.cullFace = function(face) {
  var gl = this._context;

  if (this._cullFace !== face) {
    this._cullFace = face;

    gl.cullFace(face);
  }
};

/**
 * @method EZ3.RendererState#blendEquation
 * @param {Number} modeRGB
 * @param {Number} modeAlpha
 */
EZ3.RendererState.prototype.blendEquation = function(modeRGB, modeAlpha) {
  var gl = this._context;
  var changed = false;

  modeAlpha = (modeAlpha !== undefined) ? modeAlpha : modeRGB;

  if (this._blendEquation.modeRGB !== modeRGB) {
    this._blendEquation.modeRGB = modeRGB;
    changed = true;
  }

  if (this._blendEquation.modeAlpha !== modeAlpha) {
    this._blendEquation.modeAlpha = modeAlpha;
    changed = true;
  }

  if (changed)
    gl.blendEquationSeparate(modeRGB, modeAlpha);
};

/**
 * @method EZ3.RendererState#blendEquation
 * @param {Number} srcRGB
 * @param {Number} dstRGB
 * @param {Number} srcAlpha
 * @param {Number} dstAlpha
 */
EZ3.RendererState.prototype.blendFunc = function(srcRGB, dstRGB, srcAlpha, dstAlpha) {
  var gl = this._context;
  var changed = false;

  srcAlpha = (srcAlpha !== undefined) ? srcAlpha : srcRGB;
  dstAlpha = (dstAlpha !== undefined) ? dstAlpha : dstRGB;

  if (this._blendFunc.srcRGB !== srcRGB) {
    this._blendFunc.srcRGB = srcRGB;
    changed = true;
  }

  if (this._blendFunc.dstRGB !== dstRGB) {
    this._blendFunc.dstRGB = dstRGB;
    changed = true;
  }

  if (this._blendFunc.srcAlpha !== srcAlpha) {
    this._blendFunc.srcAlpha = srcAlpha;
    changed = true;
  }

  if (this._blendFunc.dstAlpha !== dstAlpha) {
    this._blendFunc.dstAlpha = dstAlpha;
    changed = true;
  }

  if (changed)
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
};
