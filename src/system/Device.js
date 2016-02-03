/**
 * @class EZ3.Device
 * @static
 */
EZ3.Device = function() {
  /**
   * @property {Boolean} ready
   */
  this.ready = false;
  /**
   * @property {EZ3.Signal} onResize
   */
  this.onResize = new EZ3.Signal();
  /**
   * @property {Number} operatingSystem
   */
  this.operatingSystem = 0;
  /**
   * @property {String} requestAnimationFrame
   */
  this.requestAnimationFrame = null;
  /**
   * @property {String} cancelAnimationFrame
   */
  this.cancelAnimationFrame = null;
  /**
   * @property {String} touchDown
   */
  this.touchDown = null;
  /**
   * @property {String} touchMove
   */
  this.touchMove = null;
  /**
   * @property {String} touchUp
   */
  this.touchUp = null;
  /**
   * @property {String} wheel
   */
  this.wheel = null;
  /**
   * @property {String} requestFullScreen
   */
  this.requestFullScreen = null;
  /**
   * @property {String} exitFullScreen
   */
  this.exitFullScreen = null;
  /**
   * @property {String} fullScreenChange
   */
  this.fullScreenChange = null;
  /**
   * @property {String} fullScreenError
   */
  this.fullScreenError = null;
  /**
   * @property {String} requestPointerLock
   */
  this.requestPointerLock = null;
  /**
   * @property {String} exitPointerLock
   */
  this.exitPointerLock = null;
  /**
   * @property {String} pointerLockChange
   */
  this.pointerLockChange = null;
  /**
   * @property {String} pointerLockError
   */
  this.pointerLockError = null;
  /**
   * @property {Number} WINDOW
   * @final
   */
  EZ3.Device.WINDOWS = 1;
  /**
   * @property {Number} MACOS
   * @final
   */
  EZ3.Device.MACOS = 2;
  /**
   * @property {Number} LINUX
   * @final
   */
  EZ3.Device.LINUX = 4;
  /**
   * @property {Number} IOS
   * @final
   */
  EZ3.Device.IOS = 8;
  /**
   * @property {Number} ANDROID
   * @final
   */
  EZ3.Device.ANDROID = 16;
  /**
   * @property {Number} WINDOWS_PHONE
   * @final
   */
  EZ3.Device.WINDOWS_PHONE = 32;
  /**
   * @property {Number} CRHOMEOS
   * @final
   */
  EZ3.Device.CRHOMEOS = 64;
  /**
   * @property {Number} KINDLE
   * @final
   */
  EZ3.Device.KINDLE = 128;
  /**
   * @property {Number} PSVITA
   * @final
   */
  EZ3.Device.PSVITA = 256;
};

EZ3.Device = new EZ3.Device();

/**
 * @method EZ3.Device#_check
 */
EZ3.Device._check = function() {
  var that = this;

  function checkOperatingSystem() {
    if (/Playstation Vita/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.PSVITA;
    else if (/Kindle/.test(navigator.userAgent) || /\bKF[A-Z][A-Z]+/.test(navigator.userAgent) || /Silk.*Mobile Safari/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.KINDLE;
    else if (/Android/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.ANDROID;
    else if (/CrOS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.CRHOMEOS;
    else if (/iP[ao]d|iPhone/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.IOS;
    else if (/Linux/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.LINUX;
    else if (/Mac OS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.MACOS;
    else if (/Windows/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.WINDOWS;

    if (/Windows Phone/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.WINDOWS_PHONE;
  }

  function checkAnimationFrame() {
    if (window.requestAnimationFrame) {
      that.requestAnimationFrame = 'requestAnimationFrame';
      that.cancelAnimationFrame = 'cancelAnimationFrame';
    } else if (window.webkitRequestAnimationFrame) {
      that.requestAnimationFrame = 'webkitRequestAnimationFrame';
      that.cancelAnimationFrame = 'webkitCancelAnimationFrame';
    } else if (window.mozRequestAnimationFrame) {
      that.requestAnimationFrame = 'mozRequestAnimationFrame';
      that.cancelAnimationFrame = 'mozCancelAnimationFrame';
    } else if (window.msRequestAnimationFrame) {
      that.requestAnimationFrame = 'msRequestAnimationFrame';
      that.cancelAnimationFrame = 'msCancelAnimationFrame';
    } else if (window.oRequestAnimationFrake) {
      that.requestAnimationFrame = 'oRequestAnimationFrame';
      that.cancelAnimationFrame = 'oCancelAnimationFrame';
    }
  }

  function checkInput() {
    if ('ontouchstart' in document.documentElement || window.navigator.maxTouchPoints) {
      that.touchDown = 'touchstart';
      that.touchMove = 'touchmove';
      that.touchUp = 'touchend';
    } else if (window.navigator.pointerEnabled) {
      that.touchDown = 'pointerdown';
      that.touchMove = 'pointermove';
      that.touchUp = 'pointerup';
    } else if (window.navigator.msPointerEnabled) {
      that.touchDown = 'MSPointerDown';
      that.touchMove = 'MSPointerMove';
      that.touchUp = 'MSPointerUp';
    }

    if ('onwheel' in window || 'WheelEvent' in window) {
      that.wheel = 'wheel';
    } else if ('onmousewheel' in window) {
      that.wheel = 'mousewheel';
    } else if ('MouseScrollEvent' in window) {
      that.wheel = 'DOMMouseScroll';
    }
  }

  function checkFullScreen() {
    if (document.fullscreenEnabled) {
      that.requestFullScreen = 'requestFullscreen';
      that.exitFullScreen = 'exitFullscreen';
      that.fullScreenChange = 'fullscreenchange';
      that.fullScreenError = 'fullscreenerror';
    } else if (document.webkitFullscreenEnabled) {
      that.requestFullScreen = 'webkitRequestFullscreen';
      that.exitFullScreen = 'webkitExitFullscreen';
      that.fullScreenChange = 'webkitfullscreenchange';
      that.fullScreenError = 'webkitfullscreenerror';
    } else if (document.mozFullScreenEnabled) {
      that.requestFullScreen = 'mozRequestFullscreen';
      that.exitFullScreen = 'mozCancelFullScreen';
      that.fullScreenChange = 'mozfullscreenchange';
      that.fullScreenError = 'mozfullscreenerror';
    } else if (document.msFullscreenEnabled) {
      that.requestFullScreen = 'msRequestFullscreen';
      that.exitFullScreen = 'msExitFullscreen';
      that.fullScreenChange = 'MSFullscreenChange';
      that.fullScreenError = 'MSFullscreenError';
    }
  }

  function checkPointerLock() {
    if ('pointerLockElement' in document) {
      that.requestPointerLock = 'requestPointerLock';
      that.exitPointerLock = 'exitPointerLock';
      that.pointerLockChange = 'pointerlockchange';
      that.pointerLockCancel = 'pointerlockerror';
    } else if ('webkitPointerLockElement' in document) {
      that.requestPointerLock = 'webkitRequestPointerLock';
      that.exitPointerLock = 'webkitExitPointerLock';
      that.pointerLockChange = 'webkitpointerlockchange';
      that.pointerLockCancel = 'webkitpointerlockerror';
    } else if ('mozPointerLockElement' in document) {
      that.requestPointerLock = 'mozRequestPointerLock';
      that.exitPointerLock = 'mozExitPointerLock';
      that.pointerLockChange = 'mozpointerlockchange';
      that.pointerLockCancel = 'mozpointerlockerror';
    }
  }

  checkOperatingSystem();
  checkAnimationFrame();
  checkFullScreen();
  checkPointerLock();
  checkInput();
};

/**
 * @method EZ3.Device#_isReady
 */
EZ3.Device._isReady = function() {
  var that;

  if (!document.body)
    window.setTimeout(this._isReady, 20);
  else if (!this.ready) {
    that = this;

    document.removeEventListener('deviceready', this._onReady);
    document.removeEventListener('DOMContentLoaded', this._onReady);
    window.removeEventListener('load', this._onReady);
    delete this._onReady;

    this._check();
    delete this._check;

    this._onResize = function() {
      that.onResize.dispatch();
    };

    window.addEventListener('resize', this._onResize, true);

    this.ready = true;
    this._isReady.signal.dispatch();

    this._isReady.signal.dispose();
    delete this._isReady;
  }
};

/**
 * @method EZ3.Device#onReady
 * @param {EZ3.Signal} callback
 * @param {Object} [context]
 * @param {Any[]} params
 */
EZ3.Device.onReady = function(callback, context, params) {
  var that;
  var binding;

  if (this.ready)
    callback.apply(context, params);
  else if (this._isReady.signal) {
    binding = this._isReady.signal.add(callback, context);
    binding.params = params;
  } else {
    that = this;

    this._isReady.signal = new EZ3.Signal();
    binding = this._isReady.signal.add(callback, context);
    binding.params = params;

    this._onReady = function() {
      that._isReady();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive')
      this._isReady();
    else if (typeof window.cordova !== 'undefined' && !navigator['isCocoonJS'])
      document.addEventListener('deviceready', this._onReady, false);
    else {
      document.addEventListener('DOMContentLoaded', this._onReady, false);
      window.addEventListener('load', this._onReady, false);
    }
  }
};
