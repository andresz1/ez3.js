module.exports = {
  src: {
    files: [
      '<%= src %>',
      '<%= shdrs.src %>',
      '!src/render/ShaderLibrary.js'
    ],
    tasks: [
      'shdrsconcat',
      'depsconcat'
    ]
  }
};
