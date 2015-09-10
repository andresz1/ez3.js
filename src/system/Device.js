/**
 * @class Device
 */

EZ3.Device = function() {
  this.ready = false;
  this.operatingSystem = 0;
  this.touch = 0;
  this.animationFrame = 0;
};

EZ3.Device = new EZ3.Device();

EZ3.Device._check = function() {
  var that;

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
    var vendors = [
      'ms',
      'moz',
      'webkit',
      'o'
    ];

    this.animationFrame = EZ3.Device.ANIMATION_FRAME.TIME_OUT;

    for (var i = 0; i < vendors.length; i++) {
      if (window.requestAnimationFrame) {
        this.animationFrame = EZ3.Device.ANIMATION_FRAME.STANDARD;
        return;
      }

      window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
    }
  }

  function checkInput() {
    if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1))
      that.touch = EZ3.Device.TOUCH.STANDARD;
    else {
      if (window.navigator.pointerEnabled)
        that.touch = EZ3.Device.TOUCH.POINTER;

      if (window.navigator.msPointerEnabled)
        that.touch = EZ3.Device.TOUCH.MSPOINTER;
    }
  }

  that = this;

  checkOperatingSystem();
  checkAnimationFrame();
  checkInput();
};

EZ3.Device._isReady = function() {
  if (!document.body)
    window.setTimeout(this._isReady, 20);
  else if (!this.ready) {
    document.removeEventListener('deviceready', this._onReady);
    document.removeEventListener('DOMContentLoaded', this._onReady);
    window.removeEventListener('load', this._onReady);

    this._check();

    this.ready = true;

    var item;
    while ((item = this._isReady.queue.shift()))
      item.callback.apply(item.context, item.params);

    delete this._isReady;
    delete this._onReady;
    delete this._check;
  }
};

EZ3.Device.onReady = function(callback, context, params) {
  if (this.ready)
    callback.apply(context, params);
  else if (this._isReady.queue)
    this._isReady.queue.push({
      callback: callback,
      context: context,
      params: params
    });
  else {
    var that = this;

    this._isReady.queue = [];
    this._isReady.queue.push({
      callback: callback,
      context: context,
      params: params
    });

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

EZ3.Device.TOUCH = {};
EZ3.Device.TOUCH.STANDARD = 1;
EZ3.Device.TOUCH.POINTER = 2;
EZ3.Device.TOUCH.MSPOINTER = 4;

EZ3.Device.ANIMATION_FRAME = {};
EZ3.Device.ANIMATION_FRAME.STANDARD = 1;
EZ3.Device.ANIMATION_FRAME.TIME_OUT = 2;
