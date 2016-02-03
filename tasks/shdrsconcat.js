module.exports = {
  src: {
    options: {
      object: 'EZ3.ShaderLibrary',
      prefix: [
        '/**',
        '* @class EZ3.ShaderLibrary',
        '* @constructor',
        '*/',
        'EZ3.ShaderLibrary = function() {',
        '/**',
        '* @property {Object} mesh',
        '*/',
        '  this.mesh = {};',
        '/**',
        '* @property {Object} depth',
        '*/',
        '  this.depth = {};',
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
