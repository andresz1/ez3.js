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

EZ3.Renderer.prototype._updateMesh = function(mesh) {
  this._updateMeshBuffers(mesh);
  this._updateMeshMatrices(mesh);
  this._updateMeshUniforms(mesh);
};

EZ3.Renderer.prototype._updateMeshBuffers = function(mesh) {
  var gl, geometry, material;

  geometry = mesh.geometry;

  if (geometry) {

    gl = this.context;
    material = mesh.material;

    if (geometry.uvs.data.length && geometry.uvs.dirty) {
      geometry.uvs.dirty = false;

      mesh.uv.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.uvs.data,
        dynamic: geometry.uvs.dynamic
      });
    }

    if (geometry.colors.data.length && geometry.colors.dirty) {
      geometry.colors.dirty = false;

      mesh.color.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.colors.data,
        dynamic: geometry.colors.dynamic
      });
    }

    if (geometry.normals.data.length && geometry.normals.dirty) {
      geometry.normals.dirty = false;

      mesh.normal.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.normals.data,
        dynamic: geometry.normals.dynamic
      });
    }

    if (geometry.vertices.data.length && geometry.vertices.dirty) {
      geometry.vertices.dirty = false;

      mesh.vertex.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.vertices.data,
        dynamic: geometry.vertices.dynamic
      });
    }

    if (geometry.tangents.data.length && geometry.tangents.dirty) {
      geometry.tangents.dirty = false;

      mesh.tangent.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.tangents.data,
        dynamic: geometry.tangents.dynamic
      });
    }

    if (geometry.bitangents.data.length && geometry.bitangents.dirty) {
      geometry.bitangents.dirty = false;

      mesh.bitangent.update(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        data: geometry.bitangents.data,
        dynamic: geometry.bitangents.dynamic
      });
    }

    if (geometry.indices.data.length && geometry.indices.dirty) {
      geometry.indices.dirty = false;

      if(material.fill == EZ3.MeshMaterial.WIREFRAME && !material.wireframeActivated){
        geometry.calculateLinearIndices();
        material.wireframeActivated = true;
      }

      else if(material.fill === EZ3.MeshMaterial.SOLID && material.wireframeActivated){
        geometry.calculateTriangularIndices();
        material.wireframeActivated = false;
      }

      mesh.index.update(gl, {
        type: gl.UNSIGNED_SHORT,
        data: geometry.indices.data,
        target: gl.ELEMENT_ARRAY_BUFFER,
        dynamic: geometry.indices.dynamic
      });
    }
  }
};

EZ3.Renderer.prototype._updateMeshProgram = function(mesh) {
  var gl = this.context;

  if (mesh.material.dirty) {
    mesh.material.dirty = false;
    mesh.material.program = new EZ3.GLSLProgram(gl, mesh.material.config);
  }
};

EZ3.Renderer.prototype._updateMeshMatrices = function(mesh) {
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

EZ3.Renderer.prototype._updateMeshUniforms = function(mesh) {
  this._updateMeshUniformMatrices(mesh.material.program);
};

EZ3.Renderer.prototype._updateMeshUniformMatrices = function(program) {
  var gl = this.context;

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

EZ3.Renderer.prototype._renderMesh = function(mesh) {
  var gl, geometry, material, program, length;

  geometry = mesh.geometry;

  if (geometry) {
    gl = this.context;
    material = mesh.material;
    program = material.program;

    if (geometry.uvs.data.length) {
      mesh.uv.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.uvs.offset,
        stride: geometry.uvs.stride,
        layout: program.attribute.uv,
        normalized: geometry.uvs.normalized,
        length: EZ3.BufferGeometry.UV_LENGTH
      });
    }

    if (geometry.colors.data.length) {
      mesh.color.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.colors.offset,
        stride: geometry.colors.stride,
        layout: program.attribute.color,
        normalized: geometry.colors.normalized,
        length: EZ3.BufferGeometry.COLOR_LENGTH
      });
    }

    if (geometry.normals.data.length) {
      mesh.normal.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.normals.offset,
        stride: geometry.normals.stride,
        layout: program.attribute.normal,
        normalized: geometry.normals.normalized,
        length: EZ3.BufferGeometry.NORMAL_LENGTH
      });
    }

    if (geometry.vertices.data.length) {
      mesh.vertex.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.vertices.offset,
        stride: geometry.vertices.stride,
        layout: program.attribute.vertex,
        normalized: geometry.vertices.normalized,
        length: EZ3.BufferGeometry.VERTEX_LENGTH
      });
    }

    if (geometry.tangents.data.length) {
      mesh.tangent.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.tangents.offset,
        stride: geometry.tangents.stride,
        layout: program.attribute.tangent,
        normalized: geometry.tangents.normalized,
        length: EZ3.BufferGeometry.TANGENT_LENGTH
      });
    }

    if (geometry.bitangents.data.length) {
      mesh.bitangent.setup(gl, {
        type: gl.FLOAT,
        target: gl.ARRAY_BUFFER,
        offset: geometry.bitangents.offset,
        stride: geometry.bitangents.stride,
        layout: program.attribute.bitangent,
        normalized: geometry.bitangents.normalized,
        length: EZ3.BufferGeometry.BITANGENT_LENGTH
      });
    }

    if (geometry.indices.data.length) {
      length = geometry.indices.data.length;

      mesh.index.setup(gl, {
        target: gl.ELEMENT_ARRAY_BUFFER
      });

      if(material.fill === EZ3.MeshMaterial.SOLID)
        gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);

      else if(material.fill === EZ3.MeshMaterial.POINTS)
        gl.drawElements(gl.POINTS, length, gl.UNSIGNED_SHORT, 0);

      else if(material.fill === EZ3.MeshMaterial.WIREFRAME)
        gl.drawElements(gl.LINES, length, gl.UNSIGNED_SHORT, 0);
    }

    else if (geometry.vertices.data.length) {
      length = geometry.vertices.data.length / 3;

      if(material.fill === EZ3.MeshMaterial.SOLID)
        gl.drawArrays(gl.TRIANGLES, 0, length);

      else if(material.fill === EZ3.MeshMaterial.POINTS)
        gl.drawArrays(gl.POINTS, 0, length);

      else if(material.fill === EZ3.MeshMaterial.WIREFRAME)
        gl.drawArrays(gl.LINES, 0, length);
    }
  }
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
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
      this._updateMeshProgram(entity);
      entity.material.program.enable(gl);
      this._updateMesh(entity);
      this._renderMesh(entity);
      entity.material.program.disable(gl);
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};
