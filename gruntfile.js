module.exports = function(grunt) {
  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'tasks'),
    jitGrunt: true,
    data: {
      pkg: grunt.file.readJSON('package.json'),
      dest: 'build/<%= pkg.name %>',
      deps: [
        'bower_components/gl-matrix/dist/gl-matrix-min.js',
        'bower_components/js-signals/dist/signals.min.js',
        'bower_components/mixin.js/build/mixin.min.js'
      ],
      src: [
        'src/*.js',
        'src/**/*.js'
      ]
    }
  });
};
