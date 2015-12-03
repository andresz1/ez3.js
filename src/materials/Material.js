/**
 * @class Material
 */

EZ3.Material = function(id) {
  this._id = id || null;

  this.program = null;
  this.fill = EZ3.Material.SOLID;

  this.depthTest = true;
  this.faceCulling = EZ3.Material.BACK;
  this.transparent = false;
  this.opacity = 1;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest) {
    if (!state.depthTest) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      state.depthTest = true;
    }
  } else if (state.depthTest) {
    gl.disable(gl.DEPTH_TEST);
    state.depthTest = false;
  }

  if (this.faceCulling === EZ3.Material.BACK) {
    if (state.faceCulling === EZ3.Material.NONE) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
    }
    else if (state.faceCulling === EZ3.Material.FRONT)
      gl.cullFace(gl.BACK);

    state.faceCulling = EZ3.Material.BACK;
  } else if (this.faceCulling === EZ3.Material.FRONT) {
    if (state.faceCulling === EZ3.Material.NONE) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT);
    }
    else if (state.faceCulling === EZ3.Material.BACK)
      gl.cullFace(gl.FRONT);

    state.faceCulling = EZ3.Material.FRONT;
  } else if (state.faceCulling !== EZ3.Material.NONE) {
    gl.disable(gl.CULL_FACE);
    state.faceCulling = EZ3.Material.NONE;
  }
};

EZ3.Material.MESH = 'MESH.';
EZ3.Material.SHADER = 'SHADER.';
EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;

EZ3.Material.NONE = 0;
EZ3.Material.BACK = 1;
EZ3.Material.FRONT = 2;
