'use strict';

// package module for different environments
function packageModule(global, name, api) {
  if (global.define && global.define.amd) {
    define([], api);
  } else if (typeof exports !== "undefined") {
    module.exports = api;
  } else {
    global[name] = api;
  }
}

// SNStorage constructor
function NSStorage(namespace, storage){
  this._ns = namespace;
  this._nsRegex = new RegExp(''+namespace+'_');
  this._storage = storage;
  this._keyCache = null;
  this.length = this._keys().length;
}

// Generate an namespaced key
NSStorage.prototype._genKey = function(key){
  return this._ns + '_' + key;
};

// Check if key is in namespace
NSStorage.prototype._inNamespace = function(key){
  return key && (key.indexOf(this._ns) === 0);
};

// Check if key exists
NSStorage.prototype._exists = function(key){
  return !!this.getItem(key);
};

// Get all keys in this namespace
NSStorage.prototype._keys = function(){
  if(this._keyCache){
    return this._keyCache;
  }else{
    var keys = [];
    for(var i=0, len=this._storage.length; i<len; i++) {
      var key = this._storage.key(i);
      if(this._inNamespace(key)) keys.push(key.replace(this._nsRegex, ''));
    }
    this._keyCache = keys;
    return keys;
  }
};

NSStorage.prototype._invalidateCache = function(){
  this._keyCache = null;
};

//
// STORAGE API
// Spec here: http://dev.w3.org/html5/webstorage/#storage-0
//

// Get the key of index idx
NSStorage.prototype.key = function(idx){
  return this._keys()[idx] || null;
};

// Get item for key
NSStorage.prototype.getItem = function(key){
  return this._storage.getItem(this._genKey(key));
};

// Set value of key to val
NSStorage.prototype.setItem = function(key, val){
  if(!this._exists(key)){
    this.length++;
    this._invalidateCache();
  }
  this._storage.setItem(this._genKey(key), val);
};

// Remove item from storage
NSStorage.prototype.removeItem = function(key){
  if(this._exists(key)){
    this.length--;
    this._invalidateCache();
  }
  this._storage.removeItem(this._genKey(key));
};

// Clear storage
NSStorage.prototype.clear = function(){
  var _this = this;
  this._keys().forEach(function(key){
    _this.removeItem(key);
  });
  this._invalidateCache();
};

//
// API
//
var API = {
  createNamespace: function(namespace, storage){
    return new NSStorage(namespace, storage);
  }
};

// Module packaging
packageModule(this, 'NSStorage', API);
