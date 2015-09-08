module.exports = {
  src: {
    options: {
      requireTemplate: '\\n*@extends\\s+([^\\n\\r]+)[\\n\\r]*'
    },
    files: {
      '<%= dest %>.js': '<%= src %>'
    }
  }
};
