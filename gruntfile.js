module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'build/<%= pkg.name %>.js',
        includeDev: true
      }
    },
    depconcat: {
      build: {
        options: {
          requireTemplate: '\\\n*@extends\\s+([^\\n\\r]+)[\\n\\r]*'
        },
        files: {
          'build/<%= pkg.name %>.js': [
            'build/<%= pkg.name %>.js',
            'src/*.js',
            'src/**/*.js'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      build: {
        files: {
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
        }
      }
    },
    watch: {
      files: [
        'src/*.js',
        'src/**/*.js'
      ],
      tasks: [
        'bower_concat',
        'depconcat',
        'uglify'
      ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-depconcat');
  grunt.loadNpmTasks('grunt-bower-concat');

  grunt.registerTask('default', [
    'bower_concat',
    'depconcat',
    'uglify',
    'watch'
  ]);
};
