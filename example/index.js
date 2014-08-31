'use strict';

console.log('Starting up index.js');
var binding = process.binding('hello')

var hello = binding.hello;

console.log(hello());
