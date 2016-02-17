# EZ3.js
A JavaScript framework for building 3D games with HTML5 and WebGL in an easy way. Inspired by [Three.js](http://threejs.org/) and [Phaser](http://phaser.io/).

## Usage
Download the [minified library](http://ccg.ciens.ucv.ve) and include it in your html.

```html
<html>
<body>
  <canvas id="canvas"></canvas>
  <script src="js/ez3.min.js"></script>
</body>
</html>
```

The following code creates a screen composed of a camera, a box with a diffuse map and a point light. Additionally when the R key is pressed the box rotate over the x axis.

```javascript
var canvas = document.getElementById('canvas');
var engine = new EZ3.Engine(canvas, {
  preload: preload,
  create: create,
  update: update
});
var mesh, light;

function preload() {
  this.load.image('assets/images/diffuse.png');
}

function create(assets) {
  this.camera = new EZ3.PerspectiveCamera();
  this.camera.aspect = canvas.width / canvas.height;
  this.camera.position.z = 100;

  mesh = new EZ3.Mesh(new EZ3.BoxGeometry());
  mesh.scale.set(20, 20, 20);
  mesh.material.diffuseMap = new EZ3.Texture2D(assets.get('diffuse.png'));

  this.scene.add(mesh);

  light = new EZ3.PointLight();
  light.position.set(0, 50, 100);

  this.scene.add(light);
}

function update() {
  var keyboard = this.manager.input.keyboard;

  if (keyboard.getKey(EZ3.Keyboard.R).isDown())
    mesh.rotation.x += 0.1;
}
```

## Build
To build the library yourself you need to have installed [node.js](https://nodejs.org/), and follow this steps.

Install [Grunt](http://gruntjs.com/) globally.

```bash
npm install -g grunt-cli
```

Clone (or download and unzip) the project to your file system.

```bash
git clone https://github.com/andresz1/ez3.js.git
```

Go into the directory of the project.

```bash
cd ez3.js
```

Install build dependencies.

```bash
npm install
```

Run the debug mode if you want to rebuild the project when a file is modified (Only `build/ez3.js` is generated).

```bash
grunt debug
```

Run the release mode if you want to build the complete project (`build/ez3.js`, `build/ez3.min.js` and `docs`).

```bash
grunt release
```

## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.

## License

MIT
