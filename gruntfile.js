module.exports = function(grunt) {
  var path = require('path');

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'tasks'),
    jitGrunt: true,
    data: {
      pkg: grunt.file.readJSON('package.json'),
      dest: 'build/<%= pkg.name %>',
      src: [
        'src/*.js',
        'src/**/*.js'
      ],
      shdrs: {
        dest: 'src/render/ShaderLibrary.js',
        src: [
          'src/render/shaders/*.vert',
          'src/render/shaders/*.frag'
        ]
      }
    }
  });
};
