module.exports = {
  deps: {
    files: {
      '<%= dest %>.deps.min.js': '<%= deps %>'
    }
  },
  src: {
    options: {
      requireTemplate: '\\n*@extends\\s+([^\\n\\r]+)[\\n\\r]*'
    },
    files: {
      '<%= dest %>.js': '<%= src %>'
    }
  },
  std: {
    files: {
      '<%= dest %>.js': [
        '<%= dest %>.deps.min.js',
        '<%= dest %>.js'
      ]
    }
  },
  min: {
    files: {
      '<%= dest %>.min.js': [
        '<%= dest %>.deps.min.js',
        '<%= dest %>.min.js'
      ]
    }
  }
};
