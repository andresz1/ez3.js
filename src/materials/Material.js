/**
 * @class EZ3.Material
 * @constructor
 * @param {String} id
 */
EZ3.Material = function(id) {
  /**
   * @property {String} _id
   * @private
   */
  this._id = id || null;

  /**
   * @property {EZ3.GLSLProgram} program
   */
  this.program = null;
  /**
   * @property {Number} fill
   * @default EZ3.Material.SOLID
   */
  this.fill = EZ3.Material.SOLID;
  /**
   * @property {Boolean} visible
   * @default true
   */
  this.visible = true;
  /**
   * @property {Boolean} depthTest
   * @default true
   */
  this.depthTest = true;
  /**
   * @property {Boolean} transparent
   * @default false
   */
  this.transparent = false;
  /**
   * @property {Number} faceCulling
   * @default EZ3.Material.BACK_CULLING
   */
  this.faceCulling = EZ3.Material.BACK_CULLING;
  /**
   * @property {Number} blending
   * @default EZ3.Material.STANDARD_BLENDING
   */
  this.blending = EZ3.Material.STANDARD_BLENDING;
};

/**
 * @method EZ3.Material#updateStates
 * @param {WebGLContext} gl
 * @param {EZ3.RendererState} state
 */
EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest)
    state.enable(gl.DEPTH_TEST);
  else
    state.disable(gl.DEPTH_TEST);

  if (this.faceCulling !== EZ3.Material.NO_CULLING) {
    state.enable(gl.CULL_FACE);
    if(this.faceCulling === EZ3.Material.FRONT)
      state.cullFace(gl.FRONT);
    else
      state.cullFace(gl.BACK);
  } else
    state.disable(gl.CULL_FACE);

  if (this.transparent) {
    state.enable(gl.BLEND);

    if (this.blending === EZ3.Material.ADDITIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.SRC_ALPHA, gl.ONE);
    } else if (this.blending === EZ3.Material.SUBTRACTIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
    } else if (this.blending === EZ3.Material.MULTIPLICATIVE_BLENDING) {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.ZERO, gl.SRC_COLOR);
    } else {
      state.blendEquation(gl.FUNC_ADD);
      state.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }
  } else
    state.disable(gl.BLEND);
};

/**
 * @property {Number} SOLID
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.SOLID = 0;
/**
 * @property {Number} POINTS
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.POINTS = 1;
/**
 * @property {Number} WIREFRAME
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.WIREFRAME = 2;
/**
 * @property {Number} NO_CULLING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.NO_CULLING = 0;
/**
 * @property {Number} BACK_CULLING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.BACK_CULLING = 1;
/**
 * @property {Number} FRONT_CULLING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.FRONT_CULLING = 2;
/**
 * @property {Number} STANDARD_BLENDING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.STANDARD_BLENDING = 0;
/**
 * @property {Number} ADDITIVE_BLENDING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.ADDITIVE_BLENDING = 1;
/**
 * @property {Number} SUBTRACTIVE_BLENDING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.SUBTRACTIVE_BLENDING = 2;
/**
 * @property {Number} MULTIPLICATIVE_BLENDING
 * @memberof EZ3.Material
 * @static
 * @final
 */
EZ3.Material.MULTIPLICATIVE_BLENDING = 3;
