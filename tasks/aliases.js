module.exports = {
  'default': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'clean:deps',
    'watch'
  ],
  'debug': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'clean:deps',
    'watch'
  ],
  'release': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'depconcat:std',
    'uglify:src',
    'depconcat:min',
    'clean:deps'
  ]
};
