/**
 * @class Primitive
 * @extends Geometry
 */

EZ3.Primitive = function() {
  EZ3.Geometry.call(this);
};

EZ3.Primitive.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Primitive.prototype.constructor = EZ3.Primitive;

EZ3.Primitive.prototype.updateCommonData = function() {
  if (this.needGenerate) {
    this.generate();
    this.linearDataNeedUpdate = true;
    this.normalDataNeedUpdate = false;
  }
};
