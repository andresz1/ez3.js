/**
 * @class AnimationFrame
 */

EZ3.AnimationFrame = function(timeOut) {
  var device;

  this._id = 0;

  device = EZ3.Device;

  if (device.animationFrame === device.ANIMATION_FRAME.TIME_OUT || timeOut) {
    this._onRequestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };

    this._onCancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  } else {
    this._onRequestAnimationFrame = function(callback) {
      return window.requestAnimationFrame(callback);
    };

    this._onCancelAnimationFrame = function(id) {
      window.cancelAnimationFrame(id);
    };
  }
};

EZ3.AnimationFrame.prototype.request = function(callback) {
  this._id = this._onRequestAnimationFrame(callback);
};

EZ3.AnimationFrame.prototype.cancel = function() {
  this._onCancelAnimationFrame(this._id);
};
