EZ3.Device = function() {
  this.readyAt = 0;
};

EZ3.Device = new EZ3.Device();

EZ3.Device.onReady = function(callback, context, nonPrimer) {
  if (this.readyAt)
    callback.call(context, this);
  else if (this._checkReady._monitor || nonPrimer) {
    this._checkReady._queue = this._checkReady._queue || [];
    this._checkReady._queue.push([callback, context]);
  }
  else {
    this._checkReady._monitor = this._checkReady.bind(this);
    this._checkReady._queue = this._checkReady._queue || [];
    this._checkReady._queue.push([callback, context]);

    if (document.readyState === 'complete' || document.readyState === 'interactive')
      window.setTimeout(this._checkReady._monitor, 0);
    else if (typeof window.cordova !== 'undefined' && !navigator['isCocoonJS'])
      document.addEventListener('deviceready', this._checkReady._monitor, false);
    else {
      document.addEventListener('DOMContentLoaded', this._checkReady._monitor, false);
      window.addEventListener('load', this._checkReady._monitor, false);
    }
  }
};

EZ3.Device._checkReady = function() {
  if (!document.body)
    window.setTimeout(this._checkReady._monitor, 20);
  else if (!this.readyAt) {
    this.readyAt = Date.now();

    document.removeEventListener('deviceready', this._checkReady._monitor);
    document.removeEventListener('DOMContentLoaded', this._checkReady._monitor);
    window.removeEventListener('load', this._checkReady._monitor);

    this._check();

    var item;
    while ((item = this._checkReady._queue.shift())) {
      var callback = item[0];
      var context = item[1];
      callback.call(context, this);
    }

    this._checkReady = null;
    this._check = null;
  }
};

EZ3.Device._check = function() {
  var device = this;

  function _checkOS() {
    var ua = navigator.userAgent;

    if (/Playstation Vita/.test(ua)) {
      device.vita = true;
    } else if (/Kindle/.test(ua) || /\bKF[A-Z][A-Z]+/.test(ua) || /Silk.*Mobile Safari/.test(ua)) {
      device.kindle = true;
    } else if (/Android/.test(ua)) {
      device.android = true;
    } else if (/CrOS/.test(ua)) {
      device.chromeOS = true;
    } else if (/iP[ao]d|iPhone/i.test(ua)) {
      device.iOS = true;
    } else if (/Linux/.test(ua)) {
      device.linux = true;
    } else if (/Mac OS/.test(ua)) {
      device.macOS = true;
    } else if (/Windows/.test(ua)) {
      device.windows = true;
    }

    if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
      device.android = false;
      device.iOS = false;
      device.macOS = false;
      device.windows = true;
      device.windowsPhone = true;
    }

    var silk = /Silk/.test(ua); // detected in browsers

    if (device.windows || device.macOS || (device.linux && !silk) || device.chromeOS) {
      device.desktop = true;
    }

    //  Windows Phone / Table reset
    if (device.windowsPhone || ((/Windows NT/i.test(ua)) && (/Touch/i.test(ua)))) {
      device.desktop = false;
    }

  }

  _checkOS();
};
