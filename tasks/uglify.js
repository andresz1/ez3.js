module.exports = {
  deps: {
    files: {
      '<%= dest %>.deps.min.js': ['<%= dest %>.deps.min.js']
    }
  },
  src: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },
    files: {
      '<%= dest %>.min.js': ['<%= dest %>.js']
    }
  }
};
