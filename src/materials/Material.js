/**
 * @class Material
 */

EZ3.Material = function(name) {
  this._name = name;

  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
  this.transparent = false;
  this.backFaceCulling = true;
  this.frontFaceCulling = false;
  this.depthTest = true;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest) {
    if (!state.capability[EZ3.State.DEPTH_TEST]) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      state.capability[EZ3.State.DEPTH_TEST] = true;
    }
  } else {
    if (state.capability[EZ3.State.DEPTH_TEST]) {
      gl.disable(gl.DEPTH_TEST);
      state.capability[EZ3.State.DEPTH_TEST] = false;
    }
  }

  if (this.backFaceCulling) {
    if (!state.capability[EZ3.State.CULL_FACE]) {
      gl.enable(gl.CULL_FACE);
      state.capability[EZ3.State.CULL_FACE] = true;
    }
    if(!state.capability[EZ3.State.BACKFACE_CULLING]) {
      gl.cullFace(gl.BACK);
      state.capability[EZ3.State.BACKFACE_CULLING] = true;
    }
  } else if(this.frontFaceCulling) {
    if (!state.capability[EZ3.State.CULL_FACE]) {
      gl.enable(gl.CULL_FACE);
      state.capability[EZ3.State.CULL_FACE] = true;
    }
    if(!state.capability[EZ3.State.FRONTFACE_CULLING]) {
      gl.cullFace(gl.FRONT);
      state.capability[EZ3.State.FRONTFACE_CULLING] = true;
    }
  } else if (state.capability[EZ3.State.CULL_FACE]) {
    gl.disable(gl.CULL_FACE);
    state.capability[EZ3.State.CULL_FACE] = false;
  }
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
