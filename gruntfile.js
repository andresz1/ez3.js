module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      build: {
        src: ['src/*.js', 'src/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      },
      dependencies: {
        src: ['bower_components/gl-matrix/dist/gl-matrix-min.js', '<%= concat.dependencies.dest %>'],
        dest: 'build/<%= pkg.name %>.min.js'
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
      tasks: ['concat:build', 'uglify', 'concat:dependencies']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat:build', 'uglify', 'concat:dependencies', 'watch']);
};
