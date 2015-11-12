/**
 * @class Material
 */

EZ3.Material = function(id) {
  this._id = id || null;

  this.program = null;
  this.fill = EZ3.Material.SOLID;
  this.transparent = false;
  this.depthTest = true;
  this.backFaceCulling = true;
  this.frontFaceCulling = false;
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

  if (this.backFaceCulling) {
    if (!state.faceCulling) {
      gl.enable(gl.CULL_FACE);
      state.faceCulling = true;
    }
    if (!state.backFaceCulling) {
      gl.cullFace(gl.BACK);
      state.backFaceCulling = true;
    }
  } else if (this.frontFaceCulling) {
    if (!state.faceCulling) {
      gl.enable(gl.CULL_FACE);
      state.faceCulling = true;
    }
    if (!state.frontFaceCulling) {
      gl.cullFace(gl.FRONT);
      state.frontFaceCulling = true;
    }
  } else if (state.faceCulling) {
    gl.disable(gl.CULL_FACE);
    state.faceCulling = false;
  }
};

EZ3.Material.MESH = 'MESH.';
EZ3.Material.SHADER = 'SHADER.';
EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
