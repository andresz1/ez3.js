/**
 * @class TargetCubemap
 * @extends Cubemap
 */

 EZ3.TargetCubemap = function(resolution, target) {
   EZ3.Cubemap.call(this,
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     new EZ3.Image(resolution.x, resolution.y, target, null),
     false
   );
 };

 EZ3.TargetCubemap.prototype = Object.create(EZ3.Cubemap.prototype);
 EZ3.TargetCubemap.prototype.constructor = EZ3.TargetCubemap;

 EZ3.TargetCubemap.prototype.attachToFramebuffer = function(gl, attachment) {
   // TODO
 };
