/**
 * @class Material
 */

EZ3.Material = function(name) {
  this._name = name;

  this.program = null;
  this.fill = EZ3.MeshMaterial.WIREFRAME;
  this.transparent = false;
  this.faceCulling = true;
  this.backFaceCulling = true;
  this.frontFaceCulling = false;
  this.depthTest = true;
};

EZ3.Material.prototype.updateStates = function(gl, state) {
  if (this.depthTest) {
    if (!state.capability[EZ3.RendererState.DEPTH_TEST].enabled) {
      gl.enable(gl.DEPTH_TEST);
      state.capability[EZ3.RendererState.DEPTH_TEST].enabled = true;
    }
    if (state.capability[EZ3.RendererState.DEPTH_TEST].value !== gl.LEQUAL) {
      gl.depthFunc(gl.LEQUAL);
      state.capability[EZ3.RendererState.DEPTH_TEST].value = gl.LEQUAL;
    }
  } else {
    if (state.capability[EZ3.RendererState.DEPTH_TEST].enabled) {
      gl.disable(gl.DEPTH_TEST);
      state.capability[EZ3.RendererState.DEPTH_TEST].enabled = false;
      state.capability[EZ3.RendererState.DEPTH_TEST].value = null;
    }
  }

  if (this.faceCulling) {
    if (!state.capability[EZ3.RendererState.CULL_FACE].enabled) {
      gl.enable(gl.CULL_FACE);
      state.capability[EZ3.RendererState.CULL_FACE].enabled = true;
    }
    if (this.backFaceCulling) {
      if(state.capability[EZ3.RendererState.CULL_FACE].value !== gl.BACK) {
        gl.cullFace(gl.BACK);
        state.capability[EZ3.RendererState.CULL_FACE].value = gl.BACK;
      }
    } else if(this.frontFaceCulling) {
      if(state.capability[EZ3.RendererState.CULL_FACE].value !== gl.FRONT) {
        gl.cullFace(gl.FRONT);
        state.capability[EZ3.RendererState.CULL_FACE].value = gl.FRONT;
      }
    }
  } else {
    if (state.capability[EZ3.RendererState.CULL_FACE].enabled) {
      gl.disable(gl.CULL_FACE);
      state.capability[EZ3.RendererState.CULL_FACE].enabled = false;
      state.capability[EZ3.RendererState.CULL_FACE].value = null;
    }
  }
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
