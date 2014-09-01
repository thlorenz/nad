'use strict';

var binding = require('./resolve-binding')('node_slre');

var slre_match = module.exports = function match(regex, request, ncaps, flags) {
  var args = [];
  function onmatched(){
    for (var i  = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
  }
  binding.match(regex, request, ncaps, flags, onmatched)
  return args;
}

/*
 * Example Usage
 */

var request = 'GET /index.html HTTP/1.0\r\n\r\n';
var regex = '^\\s*(\\S+)\\s+(\\S+)\\s+HTTP/(\\d)\\.(\\d)';
var ncaps = 4;
var flags = 0;

console.log(slre_match(regex, request, ncaps, flags));
