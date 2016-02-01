module.exports = {
  src: {
    options: {
      requireTemplate: '\\n*@extends\\s+([^\\n\\r]+)[\\n\\r]*',
      nameTemplate: '\\n*@class\\s+([^\\n\\r]+)[\\n\\r]*'
    },
    files: {
      '<%= dest %>.js': '<%= src %>'
    }
  }
};
