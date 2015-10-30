/**
 * @class Device
 */

EZ3.Device = function() {
  this.ready = false;
  this.onResize = new EZ3.Signal();
  this.operatingSystem = 0;
  this.requestAnimationFrame = null;
  this.cancelAnimationFrame = null;
  this.touchDown = null;
  this.touchMove = null;
  this.touchUp = null;
  this.scroll = null;
  this.requestFullScreen = null;
  this.cancelFullScreen = null;
  this.fullScreenChange = null;
  this.fullScreenError = null;
  this.requestPointerLock = null;
  this.cancelPointerLock = null;
  this.pointerLockChange = null;
  this.pointerLockError = null;
};

EZ3.Device = new EZ3.Device();

EZ3.Device._check = function() {
  var that = this;

  function checkOperatingSystem() {
    if (/Playstation Vita/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.PSVITA;
    else if (/Kindle/.test(navigator.userAgent) || /\bKF[A-Z][A-Z]+/.test(navigator.userAgent) || /Silk.*Mobile Safari/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.KINDLE;
    else if (/Android/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.ANDROID;
    else if (/CrOS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.CRHOMEOS;
    else if (/iP[ao]d|iPhone/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.IOS;
    else if (/Linux/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.LINUX;
    else if (/Mac OS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.MACOS;
    else if (/Windows/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS;

    if (/Windows Phone/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE;
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
      that.cancelFullScreen = 'exitFullscreen';
      that.fullScreenChange = 'fullscreenchange';
      that.fullScreenError = 'fullscreenerror';
    } else if (document.webkitFullscreenEnabled) {
      that.requestFullScreen = 'webkitRequestFullscreen';
      that.cancelFullScreen = 'webkitExitFullscreen';
      that.fullScreenChange = 'webkitfullscreenchange';
      that.fullScreenError = 'webkitfullscreenerror';
    } else if (document.mozFullScreenEnabled) {
      that.requestFullScreen = 'mozRequestFullscreen';
      that.cancelFullScreen = 'mozCancelFullScreen';
      that.fullScreenChange = 'mozfullscreenchange';
      that.fullScreenError = 'mozfullscreenerror';
    } else if (document.msFullscreenEnabled) {
      that.requestFullScreen = 'msRequestFullscreen';
      that.cancelFullScreen = 'msExitFullscreen';
      that.fullScreenChange = 'MSFullscreenChange';
      that.fullScreenError = 'MSFullscreenError';
    }
  }

  function checkPointerLock() {
    if ('pointerLockElement' in document) {
      that.requestPointerLock = 'requestPointerLock';
      that.cancelPointerLock = 'exitPointerLock';
      that.pointerLockChange = 'pointerlockchange';
      that.pointerLockCancel = 'pointerlockerror';
    } else if ('webkitPointerLockElement' in document) {
      that.requestPointerLock = 'webkitRequestPointerLock';
      that.cancelPointerLock = 'webkitExitPointerLock';
      that.pointerLockChange = 'webkitpointerlockchange';
      that.pointerLockCancel = 'webkitpointerlockerror';
    } else if ('mozPointerLockElement' in document) {
      that.requestPointerLock = 'mozRequestPointerLock';
      that.cancelPointerLock = 'mozExitPointerLock';
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

EZ3.Device.OPERATING_SYSTEM = {};
EZ3.Device.OPERATING_SYSTEM.WINDOWS = 1;
EZ3.Device.OPERATING_SYSTEM.MACOS = 2;
EZ3.Device.OPERATING_SYSTEM.LINUX = 4;
EZ3.Device.OPERATING_SYSTEM.IOS = 8;
EZ3.Device.OPERATING_SYSTEM.ANDROID = 16;
EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE = 32;
EZ3.Device.OPERATING_SYSTEM.CRHOMEOS = 64;
EZ3.Device.OPERATING_SYSTEM.KINDLE = 128;
EZ3.Device.OPERATING_SYSTEM.PSVITA = 256;
