module.exports = {
  src: {
    files: [
      '<%= src %>',
      '<%= shdrs.src %>',
      '!<%= shdrs.dest %>'
    ],
    tasks: [
      'shdrsconcat',
      'depsconcat'
    ]
  }
};
