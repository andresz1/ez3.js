/**
 * @class Sphere
 * @extends Geometry
 */

EZ3.Sphere = function(radius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  var that = this;

  function _create() {
    var u, v;
    var phi, rho;
    var normal, vertex;
    var s, t;

    vertex = vec3.create();
    normal = vec3.create();

    for (s = 0; s < that._slices; s++) {
      for (t = 0; t < that._stacks; t++) {

        u = s / (that._slices - 1);
        v = t / (that._stacks - 1);

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex[0] = (that._radius * Math.cos(phi) * Math.sin(rho));
        vertex[1] = (that._radius * Math.sin(rho - EZ3.HALF_PI));
        vertex[2] = (that._radius * Math.sin(phi) * Math.sin(rho));

        normal[0] = vertex[0] / that._radius;
        normal[1] = vertex[1] / that._radius;
        normal[2] = vertex[2] / that._radius;

        vec3.normalize(normal, normal);

        that.uvs.push(u);
        that.uvs.push(v);

        that.normals.push(normal[0]);
        that.normals.push(normal[1]);
        that.normals.push(normal[2]);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);
      }
    }

    for (s = 0; s < that._slices - 1; ++s) {
      for (t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

  }

  _create();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;
