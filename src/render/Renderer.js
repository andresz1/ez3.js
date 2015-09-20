/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._spots = [];
  this._puntuals = [];
  this._directionals = [];

  this._entities = [];
  this._programs = [];

  this._mvMatrix = new EZ3.Matrix4();
  this._mvpMatrix = new EZ3.Matrix4();
  this._viewMatrix = new EZ3.Matrix4();
  this._modelMatrix = new EZ3.Matrix4();
  this._normalMatrix = new EZ3.Matrix3();
  this._projectionMatrix = new EZ3.Matrix4();

  this.context = null;
  this.canvas = canvas;
  this.options = options;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype._updateMeshProgram = function(mesh) {
  var gl = this.context;

  if (mesh.material.dirty) {
    mesh.material.program = new EZ3.GLSLProgram(gl, mesh.material.config);
    mesh.material.dirty = false;
  }
};

EZ3.Renderer.prototype._updateMatrices = function(mesh) {
  if (this._viewMatrix.dirty) {
    var up = new EZ3.Vector3(0, 1, 0);
    var target = new EZ3.Vector3(0, 0, 0);
    var position = new EZ3.Vector3(45, 45, 45);
    this._viewMatrix.lookAt(position, target, up);
  }

  if (this._projectionMatrix.dirty)
    this._projectionMatrix.perspective(70, 800 / 600, 1, 1000);

  this._modelMatrix.copy(mesh.worldMatrix);
  this._normalMatrix.copy(mesh.normalMatrix);
  this._mvMatrix.mul(this._modelMatrix, this._viewMatrix);
  this._mvpMatrix.mul(this._mvMatrix, this._projectionMatrix);
};

EZ3.Renderer.prototype._updateProgramUniforms = function(mesh) {
  var gl, material, program;

  gl = this.context;
  material = mesh.material;
  program = material.program;

  program.loadUniformMatrix(gl, 'uMvMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvMatrix.toArray());
  program.loadUniformMatrix(gl, 'uMvpMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._mvpMatrix.toArray());
  program.loadUniformMatrix(gl, 'uModelMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._modelMatrix.toArray());
  program.loadUniformMatrix(gl, 'uNormalMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_3X3, this._normalMatrix.toArray());

  if (this._viewMatrix.dirty) {
    this._viewMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uViewMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._viewMatrix.toArray());
  }

  if (this._projectionMatrix.dirty) {
    this._projectionMatrix.dirty = false;
    program.loadUniformMatrix(gl, 'uProjectionMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, this._projectionMatrix.toArray());
  }

};

EZ3.Renderer.prototype._processMesh = function(mesh) {
  var gl, geometry, material, program, length, fill;

  geometry = mesh.geometry;

  if (geometry) {
    gl = this.context;
    material = mesh.material;
    program = material.program;

    if (!geometry.uvs.empty) {
      if (geometry.uvs.dirty) {
        mesh.uv.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.uvs);
        geometry.uvs.dirty = false;
      }

      mesh.uv.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.uv, geometry.uvs);
    }

    if (!geometry.colors.empty) {
      if (geometry.colors.dirty) {
        mesh.color.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.colors);
        geometry.colors.dirty = false;
      }

      mesh.color.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.color, geometry.colors);
    }

    if (!geometry.normals.empty) {
      if (geometry.normals.dirty) {
        mesh.normal.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.normals);
        geometry.normals.dirty = false;
      }

      mesh.normal.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.normal, geometry.normals);
    }

    if (!geometry.vertices.empty) {
      if(geometry.indices.empty) {
        // ...
      }

      if (geometry.vertices.dirty) {
        mesh.vertex.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.vertices);
        geometry.vertices.dirty = false;
      }

      mesh.vertex.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.vertex, geometry.vertices);
    }

    if (!geometry.tangents.empty) {
      if (geometry.tangents.dirty) {
        mesh.tangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.tangents);
        geometry.tangents.dirty = false;
      }

      mesh.tangents.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.tangent, geometry.tangents);
    }

    if (!geometry.bitangents.empty) {
      if (geometry.bitangents.dirty) {
        mesh.bitangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.bitangents);
        geometry.bitangents.dirty = false;
      }

      mesh.bitangent.setup(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.bitangent, geometry.bitangents);
    }

    if (!geometry.indices.empty) {
      if (material.fill === EZ3.MeshMaterial.WIREFRAME && !geometry.linearIndices)
        geometry.calculateLinearIndices();
      else if (material.fill === EZ3.MeshMaterial.SOLID && geometry.linearIndices)
        geometry.calculateTriangularIndices();

      if (geometry.indices.dirty) {
        mesh.index.update(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT, geometry.indices);
        geometry.indices.dirty = false;
      }

      mesh.index.setup(gl, gl.ELEMENT_ARRAY_BUFFER);
    }

    if (material.fill === EZ3.MeshMaterial.SOLID)
      fill = gl.TRIANGLES;
    else if (material.fill === EZ3.MeshMaterial.POINTS)
      fill = gl.POINTS;
    else if (material.fill === EZ3.MeshMaterial.WIREFRAME)
      fill = gl.LINES;

    if(!geometry.indices.empty)
      gl.drawElements(fill, geometry.indices.data.length, gl.UNSIGNED_SHORT, 0);
    else if(!geometry.vertices.empty)
      gl.drawArrays(fill, 0, geometry.vertices.data.length / 3);
  }
};

EZ3.Renderer.prototype.initContext = function() {
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];

  for (var i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {

    }

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options. Your browser may not support it.');

  var that = this;

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);

  if (this._onContextRestored) {
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    delete this._onContextRestored;
  }
};

EZ3.Renderer.prototype.clear = function() {
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  this.context.enable(this.context.DEPTH_TEST);
  this.context.depthFunc(this.context.LEQUAL);

  this.context.enable(this.context.CULL_FACE);
  this.context.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var gl, entity;

  gl = this.context;

  this.context.viewport(screen.position.x, screen.position.y, screen.size.x, screen.size.y);
  this.context.clearColor(0.0, 0.0, 0.0, 1.0);

  screen.scene.update();
  this._entities.push(screen.scene);

  while (this._entities.length) {

    entity = this._entities.pop();

    if (entity instanceof EZ3.Mesh) {
      this._updateMatrices(entity);
      this._updateMeshProgram(entity);

      entity.material.program.enable(gl);
      this._updateProgramUniforms(entity);
      this._processMesh(entity);
      entity.material.program.disable(gl);
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
