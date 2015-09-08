var EZ3 = {
  VERSION: '1.0.0'
};

EZ3.extends = function(destination, source) {
  var k;

  for (k in source)
    if (source.hasOwnProperty(k))
      destination[k] = source[k];
};
