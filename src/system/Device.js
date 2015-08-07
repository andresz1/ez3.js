/**
 * @class Device
 */

EZ3.Device = function() {
  this.ready = false;
  this.operatingSystem = 0;
  this.touch = 0;
};

EZ3.Device = new EZ3.Device();

EZ3.Device._check = function() {
  var that = this;

  function _checkOperatingSystem() {
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

  function _checkInput() {
    if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1))
      that.touch = EZ3.Device.TOUCH;
    else {
      if(window.navigator.pointerEnabled)
        that.touch = EZ3.Device.POINTER;

      if(window.navigator.msPointerEnabled)
        that.touch = EZ3.Device.MSPOINTER;
    }
  }

  _checkOperatingSystem();
  _checkInput();
};

EZ3.Device._isReady = function() {
  if (!document.body) {
    window.setTimeout(this._isReady, 20);
  } else if (!this.ready) {
    document.removeEventListener('deviceready', this._onReady);
    document.removeEventListener('DOMContentLoaded', this._onReady);
    window.removeEventListener('load', this._onReady);

    this._check();

    this.ready = true;

    var item;
    while ((item = this._isReady.queue.shift()))
      item.callback.call(item.context, this);

    delete this._isReady;
    delete this._onReady;
    delete this._check;
  }
};

EZ3.Device.onReady = function(callback, context) {
  if (this.ready)
    callback.call(context, this);
  else if (this._isReady.queue)
    this._isReady.queue.push({
      callback: callback,
      context: context
    });
  else {
    var that = this;

    this._isReady.queue = [];
    this._isReady.queue.push({
      callback: callback,
      context: context
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

EZ3.Device.WINDOWS = 1;
EZ3.Device.MACOS = 2;
EZ3.Device.LINUX = 4;
EZ3.Device.IOS = 8;
EZ3.Device.ANDROID = 16;
EZ3.Device.WINDOWS_PHONE = 32;
EZ3.Device.CRHOMEOS = 64;
EZ3.Device.KINDLE = 128;
EZ3.Device.PSVITA = 256;

EZ3.Device.TOUCH = 1;
EZ3.Device.POINTER = 2;
EZ3.Device.MSPOINTER = 4;
