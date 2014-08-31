'use strict';

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

var hello_binding = process.binding('hello')
var hello = hello_binding.hello;

console.log('hello', hello());

var slre_binding = process.binding('slre')

var request = 'GET /index.html HTTP/1.0\r\n\r\n"';
var regex = '^\\s*(\\S+)\\s+(\\S+)\\s+HTTP/(\\d)\\.(\\d)';
var ncaps = 4;
var flags = 0;

function onmatched(){
  console.dir(arguments);
}

slre_binding.match(regex, request, ncaps, flags, onmatched)
