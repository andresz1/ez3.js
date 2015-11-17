var EZ3 = function() {
};

EZ3 = new EZ3();

EZ3.extends = function(destination, source) {
  var k;

  for (k in source)
    if (source.hasOwnProperty(k))
      destination[k] = source[k];
};

EZ3.toFileName = function(url) {
  return url.split('/').pop();
};
