#NSStorage

NSStorage is a minimal module that provides namespacing for the web storage API
(localStorage and sessionStorage). This is useful in order to prevent different
parts of your webapp to overwrite and possibly corrupt each others data.

##Usage
    var fooStorage = NSStorage.createStorage('foo', localStorage);
    var barStorage = NSStorage.createStorage('bar', localStorage);

    fooStorage.setItem('key', 'foo');
    barStorage.setItem('key', 'bar');

    fooStorage.getItem('key') // returns 'foo'
    barStorage.getItem('key') // returns 'bar'

Follow [@AronKornhall](http://twitter.com/AronKornhall) for news and updates
regarding this library.

##Install
Browserify

    npm install nsstorage

Bower

    bower install nsstorage

Global

    download nsstorage.js and include it in your app

##Test
    npm test

##Reference

###createNamespace(namespace, storage)

Creates a namespaced storage instance on top of storage

__Arguments__
 
    namespace  {String} The namespace to be used by this storage
    storage  {Object} Implementation of the web storage API
             (eg. sessionStorage or localStorage)

    returns an object implementing the web storage API

##License 

(The MIT License)

Copyright (c) 2014 Aron Kornhall <aron@kornhall.se>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
