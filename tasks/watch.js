module.exports = {
  debug: {
    files: '<%= src %>',
    tasks: [
      'depconcat:deps',
      'depconcat:src',
      'uglify:deps',
      'clean:deps:std'
    ]
  }
};
