var EZ3 = {
  VERSION: '1.0.0',

  Vector2: vec2
};

EZ3.Engine = function(canvas, options) {
  this.canvas = canvas || document.createElement('canvas');
  this.canvas.width = canvas.width || 800;
  this.canvas.height = canvas.height || 600;
  try {
    this.gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch(e) {
    throw new Error('WebGl not supported');
  }
  this.setViewport(0, 0, this.canvas.width, this.canvas.height);
};

EZ3.Engine.prototype.setViewport = function(x, y, width, height) {
  this.gl.viewport(x, y, width, height);
};



EZ3.Key = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Key.prototype.processDown = function(context, onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.call(context, this);

  if(onDown)
    onDown.call(context, this);
};

EZ3.Key.prototype.processUp = function(context, onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.call(context, this);
};

EZ3.Key.prototype.isDown = function() {
  return this._state;
};

EZ3.Key.prototype.isUp = function() {
  return !this._state;
};

EZ3.Keyboard = function(domElement) {
  this._domElement = domElement;
  this._keys = [];

  this.enabled = false;
  this.callbacks = {};
  this.callbacks.context = this;
  this.callbacks.onKeyPress = null;
  this.callbacks.onKeyDown = null;
  this.callbacks.onKeyRelease = null;
};

EZ3.Keyboard.prototype._processKeyDown = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Key(event.keyCode);

  this._keys[event.keyCode].processDown(this.callbacks.context, this.callbacks.onKeyPress, this.callbacks.onKeyDown);
};

EZ3.Keyboard.prototype._processKeyUp = function(event) {
  this._keys[event.keyCode].processUp(this.callbacks.context, this.callbacks.onKeyRelease);
};

EZ3.Keyboard.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onKeyDown = function(event) {
    that._processKeyDown(event);
  };
  this._onKeyUp = function(event) {
    that._processKeyUp(event);
  };

  this._domElement.addEventListener('keydown', this._onKeyDown, false);
	this._domElement.addEventListener('keyup', this._onKeyUp, false);
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('keydown', this._onKeyDown);
	this._domElement.removeEventListener('keyup', this._onKeyUp);
};

EZ3.Keyboard.prototype.getKey = function(keyCode) {
  if(!this._keys[keyCode])
    this._keys[keyCode] = new EZ3.Key(keyCode);

  return this._keys[keyCode];
};

EZ3.Keyboard.A = 'A'.charCodeAt(0);
EZ3.Keyboard.B = 'B'.charCodeAt(0);
EZ3.Keyboard.C = 'C'.charCodeAt(0);
EZ3.Keyboard.D = 'D'.charCodeAt(0);
EZ3.Keyboard.E = 'E'.charCodeAt(0);
EZ3.Keyboard.F = 'F'.charCodeAt(0);
EZ3.Keyboard.G = 'G'.charCodeAt(0);
EZ3.Keyboard.H = 'H'.charCodeAt(0);
EZ3.Keyboard.I = 'I'.charCodeAt(0);
EZ3.Keyboard.J = 'J'.charCodeAt(0);
EZ3.Keyboard.K = 'K'.charCodeAt(0);
EZ3.Keyboard.L = 'L'.charCodeAt(0);
EZ3.Keyboard.M = 'M'.charCodeAt(0);
EZ3.Keyboard.N = 'N'.charCodeAt(0);
EZ3.Keyboard.O = 'O'.charCodeAt(0);
EZ3.Keyboard.P = 'P'.charCodeAt(0);
EZ3.Keyboard.Q = 'Q'.charCodeAt(0);
EZ3.Keyboard.R = 'R'.charCodeAt(0);
EZ3.Keyboard.S = 'S'.charCodeAt(0);
EZ3.Keyboard.T = 'T'.charCodeAt(0);
EZ3.Keyboard.U = 'U'.charCodeAt(0);
EZ3.Keyboard.V = 'V'.charCodeAt(0);
EZ3.Keyboard.W = 'W'.charCodeAt(0);
EZ3.Keyboard.X = 'X'.charCodeAt(0);
EZ3.Keyboard.Y = 'Y'.charCodeAt(0);
EZ3.Keyboard.Z = 'Z'.charCodeAt(0);
EZ3.Keyboard.ZERO = '0'.charCodeAt(0);
EZ3.Keyboard.ONE = '1'.charCodeAt(0);
EZ3.Keyboard.TWO = '2'.charCodeAt(0);
EZ3.Keyboard.THREE = '3'.charCodeAt(0);
EZ3.Keyboard.FOUR = '4'.charCodeAt(0);
EZ3.Keyboard.FIVE = '5'.charCodeAt(0);
EZ3.Keyboard.SIX = '6'.charCodeAt(0);
EZ3.Keyboard.SEVEN = '7'.charCodeAt(0);
EZ3.Keyboard.EIGHT = '8'.charCodeAt(0);
EZ3.Keyboard.NINE = '9'.charCodeAt(0);
EZ3.Keyboard.NUMPAD_0 = 96;
EZ3.Keyboard.NUMPAD_1 = 97;
EZ3.Keyboard.NUMPAD_2 = 98;
EZ3.Keyboard.NUMPAD_3 = 99;
EZ3.Keyboard.NUMPAD_4 = 100;
EZ3.Keyboard.NUMPAD_5 = 101;
EZ3.Keyboard.NUMPAD_6 = 102;
EZ3.Keyboard.NUMPAD_7 = 103;
EZ3.Keyboard.NUMPAD_8 = 104;
EZ3.Keyboard.NUMPAD_9 = 105;
EZ3.Keyboard.NUMPAD_MULTIPLY = 106;
EZ3.Keyboard.NUMPAD_ADD = 107;
EZ3.Keyboard.NUMPAD_ENTER = 108;
EZ3.Keyboard.NUMPAD_SUBTRACT = 109;
EZ3.Keyboard.NUMPAD_DECIMAL = 110;
EZ3.Keyboard.NUMPAD_DIVIDE = 111;
EZ3.Keyboard.F1 = 112;
EZ3.Keyboard.F2 = 113;
EZ3.Keyboard.F3 = 114;
EZ3.Keyboard.F4 = 115;
EZ3.Keyboard.F5 = 116;
EZ3.Keyboard.F6 = 117;
EZ3.Keyboard.F7 = 118;
EZ3.Keyboard.F8 = 119;
EZ3.Keyboard.F9 = 120;
EZ3.Keyboard.F10 = 121;
EZ3.Keyboard.F11 = 122;
EZ3.Keyboard.F12 = 123;
EZ3.Keyboard.F13 = 124;
EZ3.Keyboard.F14 = 125;
EZ3.Keyboard.F15 = 126;
EZ3.Keyboard.COLON = 186;
EZ3.Keyboard.EQUALS = 187;
EZ3.Keyboard.COMMA = 188;
EZ3.Keyboard.UNDERSCORE = 189;
EZ3.Keyboard.PERIOD = 190;
EZ3.Keyboard.QUESTION_MARK = 191;
EZ3.Keyboard.TILDE = 192;
EZ3.Keyboard.OPEN_BRACKET = 219;
EZ3.Keyboard.BACKWARD_SLASH = 220;
EZ3.Keyboard.CLOSED_BRACKET = 221;
EZ3.Keyboard.QUOTES = 222;
EZ3.Keyboard.BACKSPACE = 8;
EZ3.Keyboard.TAB = 9;
EZ3.Keyboard.CLEAR = 12;
EZ3.Keyboard.ENTER = 13;
EZ3.Keyboard.SHIFT = 16;
EZ3.Keyboard.CONTROL = 17;
EZ3.Keyboard.ALT = 18;
EZ3.Keyboard.CAPS_LOCK = 20;
EZ3.Keyboard.ESC = 27;
EZ3.Keyboard.SPACEBAR = 32;
EZ3.Keyboard.PAGE_UP = 33;
EZ3.Keyboard.PAGE_DOWN = 34;
EZ3.Keyboard.END = 35;
EZ3.Keyboard.HOME = 36;
EZ3.Keyboard.LEFT = 37;
EZ3.Keyboard.UP = 38;
EZ3.Keyboard.RIGHT = 39;
EZ3.Keyboard.DOWN = 40;
EZ3.Keyboard.PLUS = 43;
EZ3.Keyboard.MINUS = 44;
EZ3.Keyboard.INSERT = 45;
EZ3.Keyboard.DELETE = 46;
EZ3.Keyboard.HELP = 47;
EZ3.Keyboard.NUM_LOCK = 144;

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
};

EZ3.Mouse.prototype._processDown = function(event) {
  this.pointer.processDown(event);
};

EZ3.Mouse.prototype._processMove = function(event) {
  this.pointer.processMove(event);
};

EZ3.Mouse.prototype._processUp = function(event) {
  this.pointer.processUp(event);
};

EZ3.Mouse.prototype._processWheel = function(event) {
  this.pointer.processWheel(event);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onDown = function (event) {
    that._processDown(event);
  };

  this._onMove = function (event) {
    that._processMove(event);
  };

  this._onUp = function (event) {
    that._processUp(event);
  };

  this._onWheel = function(event) {
    that._processWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onDown, true);
  this._domElement.addEventListener('mousemove', this._onMove, true);
  this._domElement.addEventListener('mouseup', this._onUp, true);
  this._domElement.addEventListener('mousewheel', this._onWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onDown, true);
  this._domElement.removeEventListener('mousemove', this._onMove, true);
  this._domElement.removeEventListener('mouseup', this._onUp, true);
  this._domElement.removeEventListener('mousewheel', this._onWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onWheel, true);
};

EZ3.MousePointer = function() {

};

EZ3.Pointer.prototype.processDown = function(event) {
  super.processDown(event);
};

EZ3.Pointer.prototype.processUp = function(event) {
  super.processUp(event);
};

EZ3.Pointer = function(id) {
  this.id = id;
  this.client = EZ3.Vector2.create();
  this.page = EZ3.Vector2.create();
  this.screen = EZ3.Vector2.create();
};

EZ3.Pointer.prototype.processDown = function(event) {
  this.processMove(event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  this.client[0] = event.clientX;
  this.client[1] = event.clientY;

  this.page[0] = event.pageX;
  this.page[1] = event.pageY;

  this.screen[0] = event.screenX;
  this.screen[0] = event.screenY;
};

EZ3.Geometry = function(data) {

  this._uv = [];
  this._indices = [];
  this._normals = [];
  this._vertices = [];
  this._tangents = [];
  this._binormals = [];
  this._maxPoint = vec3.create();
  this._minPoint = vec3.create();
  this._midPoint = vec3.create();

  this.PI = Math.PI;
  this.HALF_PI = this.PI / 2.0;
  this.DOUBLE_PI = 2.0 * this.PI;

};

EZ3.Geometry.prototype.initArray = function(size, value) {

  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });

};

EZ3.Geometry.prototype.calculateNormals = function() {

  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  var temporalNormals = initArray(this.vertices.length, 0);
  var temporalAppearances = initArray(this.vertices.length / 3, 0);

  for(k = 0; k < this._indices.length; k += 3) {

    x = 3 * this._indices[k + 0];
    y = 3 * this._indices[k + 1];
    z = 3 * this._indices[k + 2];

    point0 = vec3.create(this.vertices[x + 0], this.vertices[x + 1], this.vertices[x + 2]);
    point1 = vec3.create(this.vertices[y + 0], this.vertices[y + 1], this.vertices[y + 2]);
    point2 = vec3.create(this.vertices[z + 0], this.vertices[z + 1], this.vertices[z + 2]);

    vec3.subtract(vector0, point1, point0);
    vec3.subtract(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if(normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    temporalNormals[x + 0] += normal[0];
    temporalNormals[x + 1] += normal[1];
    temporalNormals[x + 2] += normal[2];

    temporalNormals[y + 0] += normal[0];
    temporalNormals[y + 1] += normal[1];
    temporalNormals[y + 2] += normal[2];

    temporalNormals[z + 0] += normal[0];
    temporalNormals[z + 1] += normal[1];
    temporalNormals[z + 2] += normal[2];

    ++temporalAppearances[x / 3];
    ++temporalAppearances[y / 3];
    ++temporalAppearances[z / 3];

  }

  for(k = 0; k < this._vertices.length / 3; ++k){

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this._normals.push(temporalNormals[x] / temporalAppearances[k]);
    this._normals.push(temporalNormals[y] / temporalAppearances[k]);
    this._normals.push(temporalNormals[z] / temporalAppearances[k]);

  }

  temporalNormals.splice(0, temporalNormals.length);
  temporalAppearances.splice(0, temporalAppearances.length);

};

EZ3.Geometry.prototype.updateMaxPoint = function(x, y, z) {

  this._maxPoint[0] = Math.max(this._maxPoint[0], x);
  this._maxPoint[1] = Math.max(this._maxPoint[1], y);
  this._maxPoint[2] = Math.max(this._maxPoint[2], z);

};

EZ3.Geometry.prototype.updateMinPoint = function(x, y, z) {

  this._minPoint[0] = Math.min(this._minPoint[0], x);
  this._minPoint[1] = Math.min(this._minPoint[1], y);
  this._minPoint[2] = Math.min(this._minPoint[2], z);

};

EZ3.Geometry.prototype.calculateMidPoint = function () {

  this._midPoint[0] = (this._maxPoint[0] + this._minPoint[0]) * 0.5;
  this._midPoint[0] = (this._maxPoint[1] + this._minPoint[1]) * 0.5;
  this._midPoint[0] = (this._maxPoint[2] + this._minPoint[2]) * 0.5;

};

EZ3.Geometry.prototype.calculateTangents = function() {

};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};


EZ3.ASTROIDAL_ELLIPSOID = function(radiusx, radiusy, radiusz, stacks, slices) {

  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._radiusx = radiusx;
  this._radiusy = radiusy;
  this._radiusz = radiusz;

  this.create();

};

EZ3.ASTROIDAL_ELLIPSOID.prototype.create = function() {

  var s, t, cosS, cosT, sinS, sinT, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u - this.PI;
      rho = this.PI * v - this.HALF_PI;

      cosS = Math.pow(Math.cos(phi), 3.0);
      cosT = Math.pow(Math.cos(rho), 3.0);
      sinS = Math.pow(Math.sin(phi), 3.0);
      sinT = Math.pow(Math.sin(rho), 3.0);

      vertex[0] = (this._radiusx * cosT * cosS);
      vertex[1] = (this._radiusy * sinT);
      vertex[2] = (this._radiusz * cosT * sinS);

      normal[0] = vertex[0] / this._xradius;
      normal[1] = vertex[1] / this._yradius;
      normal[2] = vertex[2] / this._zradius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }
};

EZ3.BOX = function(width, height, depth) {

  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth  = this._width * 0.5;
  this._halfDepth  = this._depth * 0.5;
  this._halfHeight = this._height * 0.5;

  this.create();

};

EZ3.BOX.prototype.create = function() {

  this._vertices = [
    +this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, +this._halfHeight, -this._halfDepth,
    +this._halfWidth, +this._halfHeight, -this._halfDepth
  ];

  this._indices = [
    0, 1 ,2,
    0, 2, 3,
    7, 4, 5,
    7, 5, 6,
    6, 5, 2,
    6, 2, 1,
    7, 0, 3,
    7, 3, 4,
    7, 6, 1,
    7, 1, 0,
    3, 2, 5,
    3, 5, 4
  ];

};

EZ3.CONE = function(base, height, slices, stacks) {

  EZ3.Geometry.call(this);

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this.create();

};

EZ3.CONE.prototype.create = function() {

  var s, t, u, v, radius, actualHeight, vertex, normal, step, S, T;

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  actualHeight = this._height;
  step = (this._height - this._base) / this._slices;

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      radius = Math.abs(this._height - actualHeight) * 0.5;

      vertex[0] = radius * Math.cos(this.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = radius * Math.sin(this.DOUBLE_PI * v);

      normal[0] = vertex[0];
      normal[1] = vertex[1];
      normal[2] = vertex[2];

      if(normal[0] !== 0.0 || normal[1] !== 0.0 || normal[2] !== 0.0)
        vec3.normalize(normal, normal);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._uv.push(u);
      this._uv.push(v);

      actualHeight -= step;

      if(actualHeight < this._base)
        break;

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

};


EZ3.ELLIPSOID = function(xRadius, yRadius, zRadius, slices, stacks) {

  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  this.create();

};

EZ3.ELLIPSOID.prototype.create = function() {

  var s, t, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this.slices - 1);
  T = 1.0 / (this.stacks - 1);

  for(s = 0; s < this.slices; ++s) {
    for(t = 0; t < this.stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u;
      rho = this.PI * v;

      vertex[0] = (this.xRadius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this.yRadius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this.zRadius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this.xRadius;
      normal[1] = vertex[1] / this.yRadius;
      normal[2] = vertex[2] / this.zRadius;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this.slices - 1; ++s) {
    for(t = 0; t < this.stacks - 1; ++t) {

      this.indices.push((s + 0) * this.stacks + (t + 0));
      this.indices.push((s + 0) * this.stacks + (t + 1));
      this.indices.push((s + 1) * this.stacks + (t + 1));

      this.indices.push((s + 0) * this.stacks + (t + 0));
      this.indices.push((s + 1) * this.stacks + (t + 1));
      this.indices.push((s + 1) * this.stacks + (t + 0));

    }
  }

};

EZ3.GRID = function(width, height) {

  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

};

EZ3.SPHERE = function(radius, slices, stacks) {

  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  this.create();

};

EZ3.SPHERE.prototype.create = function() {

  var s, t, phi, rho, u, v, normal, vertex, S, T;

  vertex = vec3.create();
  normal = vec3.create();

  S = 1.0 / (this._slices - 1);
  T = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * S;
      v = t * T;

      phi = this.DOUBLE_PI * u;
      rho = this.PI * v;

      vertex[0] = (this._radius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this._radius * Math.sin(rho - this.HALF_PI));
      vertex[2] = (this._radius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this._radius;
      normal[1] = vertex[1] / this._radius;
      normal[2] = vertex[2] / this._radius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

};

EZ3.TORUS = function(innerRadius, outerRadius, sides, rings) {

  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  this.create();

};

EZ3.TORUS.prototype.create = function() {

  var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, S, R;

  S = 1.0 / (this._sides - 1);
  R = 1.0 / (this._rings - 1);

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._sides; ++s){
    for(r = 0; r < this._rings; ++r){

      u = s * S;
      v = r * R;

      rho = this.DOUBLE_PI * u;
      phi = this.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex[0] = (this._innerRadius + this._outerRadius * cosR) * cosS;
      vertex[1] = (this._outerRadius * sinR);
      vertex[2] = (this._innerRadius + this._outerRadius * cosR) * sinS;

      normal[0] = vertex[0] - this._innerRadius * cosS;
      normal[1] = vertex[1];
      normal[2] = vertex[2] - this._innerRadius * sinS;

      vec3.normalize(normal, normal);

      this.uv.push(u);
      this.uv.push(v);

      this.normals.push(normal[0]);
      this.normals.push(normal[1]);
      this.normals.push(normal[2]);

      this.vertices.push(vertex[0]);
      this.vertices.push(vertex[1]);
      this.vertices.push(vertex[2]);

    }
  }

  for(s = 0; s < this._sides - 1; ++s){
    for(r = 0; r < this._rings - 1; ++r){

      this.indices.push((s + 0) * this._rings + (r + 0));
      this.indices.push((s + 0) * this._rings + (r + 1));
      this.indices.push((s + 1) * this._rings + (r + 1));

      this.indices.push((s + 0) * this._rings + (r + 0));
      this.indices.push((s + 1) * this._rings + (r + 1));
      this.indices.push((s + 1) * this._rings + (r + 0));

    }
  }

};
