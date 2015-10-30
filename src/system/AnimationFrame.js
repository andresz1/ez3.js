/**
 * @class AnimationFrame
 */

EZ3.AnimationFrame = function(timeOut) {
  var device = EZ3.Device;

  this._id = 0;

  if (!device.requestAnimationFrame || timeOut) {
    this._onRequestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };

    this._onCancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  } else {
    this._onRequestAnimationFrame = function(callback) {
      return window[device.requestAnimationFrame](callback);
    };

    this._onCancelAnimationFrame = function(id) {
      window[device.cancelAnimationFrame](id);
    };
  }
};

EZ3.AnimationFrame.prototype.request = function(callback) {
  this._id = this._onRequestAnimationFrame(callback);
};

EZ3.AnimationFrame.prototype.cancel = function() {
  this._onCancelAnimationFrame(this._id);
};
