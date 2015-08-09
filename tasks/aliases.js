module.exports = {
  'default': [
    'depconcat:deps',
    'depconcat:src',
    'uglify:deps',
    'depconcat:std',
    'uglify:src',
    'depconcat:min',
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
    'depconcat:std',
    'uglify:src',
    'depconcat:min',
    'clean:deps'
  ]
};
