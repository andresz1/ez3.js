module.exports = {
  'default': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'uglify:src',
    'depconcat:min',
    'depconcat:std',
    'clean:deps'
  ],
  'debug': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'depconcat:std',
    'watch'
  ],
  'release': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'uglify:src',
    'depconcat:min',
    'depconcat:std',
    'clean:deps'
  ]
};
