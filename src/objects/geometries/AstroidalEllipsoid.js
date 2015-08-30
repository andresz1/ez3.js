/**
 * @class AstroidalEllipsoid
 * @extends Geometry
 */

EZ3.AstroidalEllipsoid = function(xRadius, yRadius, zRadius, stacks, slices) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var that = this;

  function _create() {
    var u, v;
    var phi, rho;
    var normal, vertex;
    var cosS, cosT, sinS, sinT;
    var s, t;

    vertex = vec3.create();
    normal = vec3.create();

    for (s = 0; s < that._slices; ++s) {
      for (t = 0; t < that._stacks; ++t) {
        u = s / (that._slices - 1);
        v = t / (that._stacks - 1);

        phi = EZ3.DOUBLE_PI * u - EZ3.PI;
        rho = EZ3.PI * v - EZ3.HALF_PI;

        cosS = Math.pow(Math.cos(phi), 3.0);
        cosT = Math.pow(Math.cos(rho), 3.0);
        sinS = Math.pow(Math.sin(phi), 3.0);
        sinT = Math.pow(Math.sin(rho), 3.0);

        vertex[0] = (that._xRadius * cosT * cosS);
        vertex[1] = (that._yRadius * sinT);
        vertex[2] = (that._zRadius * cosT * sinS);

        normal[0] = vertex[0] / that._xRadius;
        normal[1] = vertex[1] / that._yRadius;
        normal[2] = vertex[2] / that._zRadius;

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

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;
