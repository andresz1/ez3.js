module.exports = {
  debug: {
    files: '<%= src %>',
    tasks: [
      'depconcat:src',
      'depconcat:std'
    ]
  }
};
