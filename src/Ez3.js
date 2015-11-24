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

EZ3.toFileExtension = function(url) {
  return url.split('/').pop().split('.').pop();
};

EZ3.toBaseUrl = function(url) {
  var tokens = url.split('/');

  return url.substr(0, url.length - tokens[tokens.length - 1].length);
};
