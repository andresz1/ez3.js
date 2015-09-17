module.exports = {
  src: {
    options: {
      object: 'EZ3.ShaderLibrary',
      prefix: [
        '/**',
        '* @class ShaderLibrary',
        '*/',
        '',
        'EZ3.ShaderLibrary = function() {',
        '  this.mesh = {};',
        '};',
        '',
        'EZ3.ShaderLibrary = new EZ3.ShaderLibrary();',
        '\n'
      ].join('\n')
    },
    files: {
      '<%= shdrs.dest %>': '<%= shdrs.src %>'
    }
  }
};
