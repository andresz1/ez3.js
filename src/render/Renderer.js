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
  var gl = this.context;

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
  var gl = this.context;
  var program = material.program;
  var data;
  var name;
  var length;

  name = 'uModelView';
  data = this._mvMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uModelViewProjection';
  data = this._mvpMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uModel';
  data = this._modelMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
  program.loadUniformMatrix(gl, name, length, data);

  name = 'uNormal';
  data = this._normalMatrix.toArray();
  length = EZ3.GLSLProgram.UNIFORM_SIZE_3X3;
  program.loadUniformMatrix(gl, name, length, data);

  if (this._viewMatrix.dirty) {
    name = 'uView';
    data = this._viewMatrix.toArray();
    length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
    program.loadUniformMatrix(gl, name, length, data);
    this._viewMatrix.dirty = false;
  }

  if (this._projectionMatrix.dirty) {
    name = 'uProjection';
    data = this._projectionMatrix.toArray();
    length = EZ3.GLSLProgram.UNIFORM_SIZE_4X4;
    program.loadUniformMatrix(gl, name, length, data);
    this._projectionMatrix.dirty = false;
  }
};

EZ3.Renderer.prototype._processGeometry = function(mesh) {
  var gl = this.context;
  var geometry = mesh.geometry;
  var material = mesh.material;
  var program = material.program;
  var target = gl.ARRAY_BUFFER;
  var type = gl.FLOAT;
  var layout;
  var fill;

  if(geometry) {

    if(geometry.mathematic && geometry.dirty) {
      geometry.generate();
      geometry.dirty = false;
    }

    if (geometry.uvs.data.length) {
      if (geometry.uvs.dirty) {
        mesh.uv.update(gl, target, type, geometry.uvs);
        geometry.uvs.dirty = false;
      }

      layout = program.attribute.uv;
      mesh.uv.bind(gl, target, type, layout, geometry.uvs);
    }

    if (geometry.colors.data.length) {
      if (geometry.colors.dirty) {
        mesh.color.update(gl, target, type, geometry.colors);
        geometry.colors.dirty = false;
      }

      layout = program.attribute.color;
      mesh.color.bind(gl, target, type, layout, geometry.colors);
    }

    if (geometry.normals.data.length) {
      if (geometry.normals.dirty) {
        mesh.normal.update(gl, target, type, geometry.normals);
        geometry.normals.dirty = false;
      }

      layout = program.attribute.normal;
      mesh.normal.bind(gl, target, type, layout, geometry.normals);
    }

    if (geometry.tangents.data.length) {
      if (geometry.tangents.dirty) {
        mesh.tangent.update(gl, target, type, geometry.tangents);
        geometry.tangents.dirty = false;
      }

      layout = program.attribute.tangent;
      mesh.tangents.bind(gl, target, type, layout, geometry.tangents);
    }

    if (geometry.bitangents.data.length) {
      if (geometry.bitangents.dirty) {
        mesh.bitangent.update(gl, target, type, geometry.bitangents);
        geometry.bitangents.dirty = false;
      }

      layout = program.attribute.tangent;
      mesh.bitangent.bind(gl, target, type, layout, geometry.bitangents);
    }

    if (material.fill === EZ3.MeshMaterial.SOLID) {
      fill = gl.TRIANGLES;

      if (!geometry.triangulated)
        geometry.triangulate();

    } else {
      if(material.fill === EZ3.MeshMaterial.WIREFRAME)
        fill = gl.LINES;
      else
        fill = gl.POINTS;

      if (geometry.triangulated)
        geometry.linearize();
    }

    if (geometry.vertices.data.length) {
      if (geometry.vertices.dirty) {
        mesh.vertex.update(gl, target, type, geometry.vertices);
        geometry.vertices.dirty = false;
      }

      layout = program.attribute.vertex;
      mesh.vertex.bind(gl, target, type, layout, geometry.vertices);

      if (geometry.indices.data.length) {
        target = gl.ELEMENT_ARRAY_BUFFER;
        type = gl.UNSIGNED_SHORT;

        if (geometry.indices.dirty) {
          mesh.index.update(gl, target, type, geometry.indices);
          geometry.indices.dirty = false;
        }

        mesh.index.bind(gl, target);
        gl.drawElements(fill, geometry.indices.data.length, type, 0);
      } else
        gl.drawArrays(fill, 0, geometry.vertices.data.length / 3);
    }
  }
};

EZ3.Renderer.prototype.initContext = function() {
  var that = this;
  var contextName;
  var contextStatus;
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];
  var i;

  for (i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options.');

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  contextName = 'webglcontextlost';
  contextStatus = this._onContextLost;
  this.canvas.addEventListener(contextName, contextStatus, false);

  if (this._onContextRestored) {
    contextName = 'webglcontextrestored';
    contextStatus = this._onContextRestored;
    this.canvas.removeEventListener(contextName, contextStatus, false);
    delete this._onContextRestored;
  }
};

EZ3.Renderer.prototype.clear = function() {
  var gl = this.context;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  gl.enable(this.context.DEPTH_TEST);
  gl.depthFunc(this.context.LEQUAL);

  gl.enable(this.context.CULL_FACE);
  gl.cullFace(this.context.BACK);
};

EZ3.Renderer.prototype.render = function(screen) {
  var gl = this.context;
  var lights = [];
  var meshes = [];
  var entities = [];
  var position = screen.position;
  var size = screen.size;
  var entity;
  var material;
  var program;
  var k;

  gl.viewport(position.x, position.y, size.x, size.y);

  entities.push(screen.scene);

  while(entities.length) {
    entity = entities.pop();
    entity.update();

    if(entity instanceof EZ3.Light)
      lights.push(entity);
    else if(entity instanceof EZ3.Mesh)
      meshes.push(entity);

    for(k = entity.children.length - 1; k >= 0; k--) {
      if(entity.dirty)
        entity.children[k].dirty = true;

      entities.push(entity.children[k]);
    }
  }

  for(k = 0; k < meshes.length; ++k) {
    material = meshes[k].material;

    this._processMatrices(meshes[k]);
    this._processProgram(meshes[k].material);

    program = meshes[k].material.program;

    program.enable(gl);

    this._processUniforms(material);
    this._processGeometry(meshes[k]);

    program.disable(gl);
  }

  lights.length = 0;
  meshes.length = 0;
  entities.length = 0;
};
