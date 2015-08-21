/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._content = [];
  this._content[EZ3.Cache.IMAGE] = {};
  this._content[EZ3.Cache.DATA] = {};
};

EZ3.Cache.prototype.get = function(type, id) {
  if(!this._content[type])
    return undefined;
  return this._content[type][id];
};

EZ3.Cache.prototype.set = function(type, id, content) {
  if(this._content[type])
    this._content[type][id] = content;
};

EZ3.Cache.IMAGE = 0;
EZ3.Cache.DATA = 1;
