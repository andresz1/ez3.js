/**
 * @class EZ3
 * @static
 */
var EZ3 = function() {};

EZ3 = new EZ3();

/**
 * @method EZ3#extends
 * @param {Object} destination
 * @param {Object} source
 */
EZ3.extends = function(destination, source) {
  var k;

  for (k in source)
    destination[k] = source[k];
};

/**
 * @method EZ3#toFileName
 * @param {String} url
 * @return {String}
 */
EZ3.toFileName = function(url) {
  return url.split('/').pop();
};

/**
 * @method EZ3#toFileExtension
 * @param {String} url
 * @return {String}
 */
EZ3.toFileExtension = function(url) {
  return url.split('/').pop().split('.').pop();
};

/**
 * @method EZ3#toBaseUrl
 * @param {String} url
 * @return {String}
 */
EZ3.toBaseUrl = function(url) {
  var tokens = url.split('/');

  return url.substr(0, url.length - tokens[tokens.length - 1].length);
};
