/**
 * @class EZ3.AnimationFrame
 * @constructor
 * @param {Boolean} [timeOut]
 */
EZ3.AnimationFrame = function(timeOut) {
  var device = EZ3.Device;

  /**
   * @property {Number} _id
   * @private
   */
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

/**
 * @method EZ3.AnimationFrame#request
 * @param {Function} callback
 */
EZ3.AnimationFrame.prototype.request = function(callback) {
  this._id = this._onRequestAnimationFrame(callback);
};

/**
 * @method EZ3.AnimationFrame#cancel
 */
EZ3.AnimationFrame.prototype.cancel = function() {
  this._onCancelAnimationFrame(this._id);
};
