module.exports = {
  'debug': [
    'shdrsconcat',
    'depsconcat',
    'watch'
  ],
  'release': [
    'shdrsconcat',
    'depsconcat',
    'uglify',
    'yuidoc'
  ],
  'default': 'release'
};
