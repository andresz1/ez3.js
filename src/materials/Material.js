/**
 * @class Material
 */

EZ3.Material = function(id) {
  this._id = id || null;

  this.program = null;
  this.fill = EZ3.Material.SOLID;
  this.visible = true;
  this.depthTest = true;
  this.transparent = false;
  this.faceCulling = EZ3.Material.BACK_CULLING;
  this.blending = EZ3.Material.STANDARD_BLENDING;
};

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

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;

EZ3.Material.NO_CULLING = 0;
EZ3.Material.BACK_CULLING = 1;
EZ3.Material.FRONT_CULLING = 2;

EZ3.Material.STANDARD_BLENDING = 0;
EZ3.Material.ADDITIVE_BLENDING = 1;
EZ3.Material.SUBTRACTIVE_BLENDING = 2;
EZ3.Material.MULTIPLICATIVE_BLENDING = 3;
