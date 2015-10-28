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
    if (!state.enabled[EZ3.RendererState.DEPTH_TEST]) {
      gl.enable(gl.DEPTH_TEST);
      state.enabled[EZ3.RendererState.DEPTH_TEST] = true;
    }
    if (state.enabledValue[EZ3.RendererState.DEPTH_TEST] !== gl.LEQUAL) {
      gl.depthFunc(gl.LEQUAL);
      state.enabledValue[EZ3.RendererState.DEPTH_TEST] = gl.LEQUAL;
    }
  } else {
    if (state.enabled[EZ3.RendererState.DEPTH_TEST]) {
      gl.disable(gl.DEPTH_TEST);
      state.enabled[EZ3.RendererState.DEPTH_TEST] = false;
      state.enabledValue[EZ3.RendererState.DEPTH_TEST] = null;
    }
  }

  if (this.faceCulling) {
    if (!state.enabled[EZ3.RendererState.CULL_FACE]) {
      gl.enable(gl.CULL_FACE);
      state.enabled[EZ3.RendererState.CULL_FACE] = true;
    }
    if (this.backFaceCulling) {
      if(state.enabledValue[EZ3.RendererState.CULL_FACE] !== gl.BACK) {
        gl.cullFace(gl.BACK);
        state.enabledValue[EZ3.RendererState.CULL_FACE] = gl.BACK;
      }
    } else if(this.frontFaceCulling) {
      if(state.enabledValue[EZ3.RendererState.CULL_FACE] !== gl.FRONT) {
        gl.cullFace(gl.FRONT);
        state.enabledValue[EZ3.RendererState.CULL_FACE] = gl.FRONT;
      }
    }
  } else {
    if (state.enabled[EZ3.RendererState.CULL_FACE]) {
      gl.disable(gl.CULL_FACE);
      state.enabled[EZ3.RendererState.CULL_FACE] = false;
      state.enabledValue[EZ3.RendererState.CULL_FACE] = null;
    }
  }
};

EZ3.Material.SOLID = 0;
EZ3.Material.POINTS = 1;
EZ3.Material.WIREFRAME = 2;
