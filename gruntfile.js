module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      build: {
        src: [
          'bower_components/gl-matrix/dist/gl-matrix-min.js',
          'bower_components/js-signals/dist/signals.js',
          'bower_components/eztend.js/build/eztend.min.js',
          'src/*.js',
          'src/**/*.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      build: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.build.dest %>']
        }
      }
    },
    watch: {
      files: '<%= concat.build.src %>',
      tasks: [
        'concat',
        'uglify'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', [
    'concat',
    'uglify',
    'watch'
  ]);
};
