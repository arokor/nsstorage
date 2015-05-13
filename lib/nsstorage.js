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

// Storage constructor
function Storage(namespace, storage){
  this._ns = namespace;
  this._nsRegex = new RegExp(''+namespace+'_');
  this._storage = storage;
  this._keyCache = null;
  this.length = this._keys().length;
}

// Generate an namespaced key
Storage.prototype._genKey = function(key){
  return this._ns + '_' + key;
};

// Check if key is in namespace
Storage.prototype._inNamespace = function(key){
  return key && (key.indexOf(this._ns) === 0);
};

// Check if key exists
Storage.prototype._exists = function(key){
  return !!this.getItem(key);
};

// Get all keys in this namespace
Storage.prototype._keys = function(){
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

Storage.prototype._invalidateCache = function(){
  this._keyCache = null;
};

//
// STORAGE API
// Spec here: http://dev.w3.org/html5/webstorage/#storage-0
//

// Get the key of index idx
Storage.prototype.key = function(idx){
  return this._keys()[idx] || null;
};

// Get item for key
Storage.prototype.getItem = function(key){
  return this._storage.getItem(this._genKey(key));
};

// Set value of key to val
Storage.prototype.setItem = function(key, val){
  if(!this._exists(key)){
    this.length++;
    this._invalidateCache();
  }
  this._storage.setItem(this._genKey(key), val);
};

// Remove item from storage
Storage.prototype.removeItem = function(key){
  if(this._exists(key)){
    this.length--;
    this._invalidateCache();
  }
  this._storage.removeItem(this._genKey(key));
};

// Clear storage
Storage.prototype.clear = function(){
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
    return new Storage(namespace, storage);
  }
};

// Module packaging
packageModule(this, 'NSStorage', API);
