/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._mvMatrix = new EZ3.Matrix4();
  this._mvpMatrix = new EZ3.Matrix4();
  this._viewMatrix = new EZ3.Matrix4();
  this._modelMatrix = new EZ3.Matrix4();
  this._normalMatrix = new EZ3.Matrix3();
  this._projectionMatrix = new EZ3.Matrix4();

  this.canvas = canvas;
  this.options = options;
  this.context = null;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype._processProgram = function(material) {
  var gl;

  gl = this.context;

  if (material.dirty) {
    material.program = new EZ3.GLSLProgram(gl, material.config);
    material.dirty = false;
  }
};

EZ3.Renderer.prototype._processMatrices = function(mesh) {
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

EZ3.Renderer.prototype._processUniforms = function(material) {
  var gl, program;

  gl = this.context;
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

EZ3.Renderer.prototype._processGeometry = function(mesh) {
  var gl, geometry, material, program, length, fill;

  gl = this.context;
  geometry = mesh.geometry;
  material = mesh.material;
  program = material.program;

  if (!geometry.uvs.empty) {
    if (geometry.uvs.dirty) {
      mesh.uv.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.uvs);
      geometry.uvs.dirty = false;
    }

    mesh.uv.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.uv, geometry.uvs);
  }

  if (!geometry.colors.empty) {
    if (geometry.colors.dirty) {
      mesh.color.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.colors);
      geometry.colors.dirty = false;
    }

    mesh.color.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.color, geometry.colors);
  }

  if (!geometry.normals.empty) {
    if (geometry.normals.dirty) {
      mesh.normal.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.normals);
      geometry.normals.dirty = false;
    }

    mesh.normal.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.normal, geometry.normals);
  }

  if (!geometry.tangents.empty) {
    if (geometry.tangents.dirty) {
      mesh.tangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.tangents);
      geometry.tangents.dirty = false;
    }

    mesh.tangents.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.tangent, geometry.tangents);
  }

  if (!geometry.bitangents.empty) {
    if (geometry.bitangents.dirty) {
      mesh.bitangent.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.bitangents);
      geometry.bitangents.dirty = false;
    }

    mesh.bitangent.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.bitangent, geometry.bitangents);
  }

  if (material.fill === EZ3.MeshMaterial.SOLID) {
    fill = gl.TRIANGLES;

    if (!geometry.triangulated)
      geometry.triangulate();

  } else {
    fill = (material.fill === EZ3.MeshMaterial.WIREFRAME) ? gl.LINES : gl.POINT;

    if (geometry.triangulated)
      geometry.linearize();
  }

  if (!geometry.vertices.empty) {
    if (geometry.vertices.dirty) {
      mesh.vertex.update(gl, gl.ARRAY_BUFFER, gl.FLOAT, geometry.vertices);
      geometry.vertices.dirty = false;
    }

    mesh.vertex.bind(gl, gl.ARRAY_BUFFER, gl.FLOAT, program.attribute.vertex, geometry.vertices);

    if (!geometry.indices.empty) {
      if (geometry.indices.dirty) {
        mesh.index.update(gl, gl.ELEMENT_ARRAY_BUFFER, gl.UNSIGNED_SHORT, geometry.indices);
        geometry.indices.dirty = false;
      }

      mesh.index.bind(gl, gl.ELEMENT_ARRAY_BUFFER);
      gl.drawElements(fill, geometry.indices.data.length, gl.UNSIGNED_SHORT, 0);
    } else
      gl.drawArrays(fill, 0, geometry.vertices.data.length / 3);
  }
};

EZ3.Renderer.prototype.initContext = function() {
  var that, names;
  var i;

  that = this;
  names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];

  for (i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options. Your browser may not support it.');

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
  var gl;

  gl = this.context;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  gl.enable(this.context.DEPTH_TEST);
  gl.depthFunc(this.context.LEQUAL);

  gl.enable(this.context.CULL_FACE);
  gl.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var gl, entities, entity, material, program;

  gl = this.context;
  entities = [];

  gl.viewport(screen.position.x, screen.position.y, screen.size.x, screen.size.y);

  screen.scene.update();
  entities.push(screen.scene);

  while (entities.length) {
    entity = entities.pop();

    if (entity instanceof EZ3.Mesh) {
      material = entity.material;

      this._processMatrices(entity);
      this._processProgram(material);

      program = material.program;

      program.enable(gl);

      this._processUniforms(material);
      this._processGeometry(entity);

      program.disable(gl);
    }

    for (var k = entity.children.length - 1; k >= 0; --k)
      entities.push(entity.children[k]);
  }
};
